// DOM lookups stay centralized so markup changes are easy to track.
const el = {
  homeRailButton: document.getElementById("homeRailButton"),
  selfRailLabel: document.getElementById("selfRailLabel"),
  groupRailList: document.getElementById("groupRailList"),
  notificationToggleButton: document.getElementById("notificationToggleButton"),
  notificationBadge: document.getElementById("notificationBadge"),
  newGroupBtn: document.getElementById("newGroupBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  userAvatar: document.getElementById("userAvatar"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
  friendCard: document.getElementById("friendCard"),
  friendCardToggle: document.getElementById("friendCardToggle"),
  friendsCard: document.getElementById("friendsCard"),
  friendsCardToggle: document.getElementById("friendsCardToggle"),
  friendRequestForm: document.getElementById("friendRequestForm"),
  friendEmailInput: document.getElementById("friendEmailInput"),
  friendSubmitBtn: document.getElementById("friendSubmitBtn"),
  friendRequestFeedback: document.getElementById("friendRequestFeedback"),
  friendsSearchInput: document.getElementById("friendsSearchInput"),
  attachmentInput: document.getElementById("attachmentInput"),
  attachBtn: document.getElementById("attachBtn"),
  friendsList: document.getElementById("friendsList"),
  friendsCount: document.getElementById("friendsCount"),
  friendsEmpty: document.getElementById("friendsEmpty"),
  groupsList: document.getElementById("groupsList"),
  groupsEmpty: document.getElementById("groupsEmpty"),
  createGroupSidebarBtn: document.getElementById("createGroupSidebarBtn"),
  chatKicker: document.getElementById("chatKicker"),
  chatTitle: document.getElementById("chatTitle"),
  chatSubtitle: document.getElementById("chatSubtitle"),
  connectionState: document.getElementById("connectionState"),
  headerInboxButton: document.getElementById("headerInboxButton"),
  overviewFriends: document.getElementById("overviewFriends"),
  overviewNotifications: document.getElementById("overviewNotifications"),
  overviewGroups: document.getElementById("overviewGroups"),
  surfaceBanner: document.getElementById("surfaceBanner"),
  messagesArea: document.getElementById("messagesArea"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
  utilityPanel: document.getElementById("utilityPanel"),
  closeInboxButton: document.getElementById("closeInboxButton"),
  incomingFriendRequests: document.getElementById("incomingFriendRequests"),
  incomingFriendsCount: document.getElementById("incomingFriendsCount"),
  incomingFriendsEmpty: document.getElementById("incomingFriendsEmpty"),
  groupInvitations: document.getElementById("groupInvitations"),
  groupInvitationsCount: document.getElementById("groupInvitationsCount"),
  groupInvitationsEmpty: document.getElementById("groupInvitationsEmpty"),
  toast: document.getElementById("toast"),
};

// Runtime state
let currentUser = null;
let groups = [];
let socialState = {
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  groupInvitations: [],
};
let activeChannel = { type: "home" };
let stompClient = null;
let activeSubscription = null;
let reconnectTimer = null;
let workspaceRefreshTimer = null;
let notificationsPrimed = false;
let friendSearchQuery = "";
const previews = new Map();
const AUTH_SESSION_KEY = "authSession";
const LEGACY_SESSION_KEY = "supabaseSession";
const FRIEND_CARD_STORAGE_KEY = "workspaceFriendCardCollapsed";
const FRIENDS_CARD_STORAGE_KEY = "workspaceFriendsCardCollapsed";
const INBOX_BREAKPOINT = 1380;

// Session and auth helpers
function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
}

function getSession() {
  const current = parseJson(sessionStorage.getItem(AUTH_SESSION_KEY));
  if (current) return current;
  const legacy = parseJson(sessionStorage.getItem(LEGACY_SESSION_KEY));
  if (!legacy) return null;
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(legacy));
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
  return legacy;
}

function clearSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
  sessionStorage.removeItem("currentUser");
}

function getCurrentUser() {
  const saved = parseJson(sessionStorage.getItem("currentUser"));
  if (saved) return saved;
  const session = getSession();
  const user = session && session.user ? session.user : null;
  if (!user) return null;
  return {
    username:
      (user.user_metadata &&
        (user.user_metadata.full_name || user.user_metadata.username)) ||
      (user.email ? user.email.split("@")[0] : "User"),
    email: user.email || "",
  };
}

function requireAuth() {
  const user = getCurrentUser();
  if (user && user.email) return user;
  window.location.href = "/login.html?returnTo=/index.html";
  return null;
}

function decodeJwtPayload(token) {
  if (!token || token.split(".").length < 2) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch (_) {
    return null;
  }
}

function isTokenExpired(token, skewSeconds = 30) {
  const payload = decodeJwtPayload(token);
  return payload && typeof payload.exp === "number"
    ? payload.exp <= Math.floor(Date.now() / 1000) + skewSeconds
    : false;
}

async function refreshSession() {
  const session = getSession();
  const refreshToken = session && session.refresh_token;
  if (!refreshToken) return null;
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await parseResponsePayload(response);
  if (!response.ok || !data.access_token) return null;
  sessionStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({ ...session, ...data, user: session.user || null }),
  );
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
  return data.access_token;
}

async function getValidAccessToken() {
  const session = getSession();
  if (!session || !session.access_token) return null;
  return isTokenExpired(session.access_token)
    ? refreshSession()
    : session.access_token;
}

async function authorizedRequest(url, options = {}) {
  let token = await getValidAccessToken();
  if (!token) return { ok: false, data: { error: "Sign in again." } };
  const buildOptions = (accessToken) => ({
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      Authorization: "Bearer " + accessToken,
    },
  });
  let response = await fetch(url, buildOptions(token));
  if (response.status === 401) {
    token = await refreshSession();
    if (!token) {
      clearSession();
      return { ok: false, data: { error: "Sign in again." } };
    }
    response = await fetch(url, buildOptions(token));
  }
  const data = await parseResponsePayload(response);
  return { ok: response.ok, data };
}

// Formatting and UI helpers
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function defaultName(email) {
  const text = String(email || "");
  const atIndex = text.indexOf("@");
  return atIndex > 0 ? text.slice(0, atIndex) : text || "User";
}

function displayName(user) {
  return user && (user.username || user.fullName || defaultName(user.email))
    ? user.username || user.fullName || defaultName(user.email)
    : "User";
}

function initials(value) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "MC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function formatAgo(timestamp) {
  if (!timestamp) return "Just now";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(timestamp)) / 60000));
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours + "h ago";
  return Math.round(hours / 24) + "d ago";
}

function formatTime(timestamp) {
  if (!timestamp) return "Now";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function previewKey(type, id) {
  return type + ":" + String(id);
}

function setPreview(type, id, value) {
  previews.set(previewKey(type, id), value);
  const node = document.querySelector(
    '.channel-item[data-type="' + type + '"][data-id="' + String(id) + '"] .channel-preview',
  );
  if (node) node.textContent = value;
}

function getPreview(type, id, fallback) {
  return previews.get(previewKey(type, id)) || fallback;
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.remove("show"), 2400);
}

function setFriendFeedback(message, variant) {
  el.friendRequestFeedback.textContent = message || "";
  el.friendRequestFeedback.className = "mini friend-feedback";
  if (!message) return;
  el.friendRequestFeedback.classList.add(
    variant === "error" ? "error" : "success",
  );
}

function setFriendCardCollapsed(collapsed) {
  if (!el.friendCard || !el.friendCardToggle) return;
  el.friendCard.classList.toggle("is-collapsed", collapsed);
  el.friendCardToggle.setAttribute("aria-expanded", String(!collapsed));
  el.friendCardToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand add friend" : "Collapse add friend",
  );
  try {
    window.localStorage.setItem(FRIEND_CARD_STORAGE_KEY, collapsed ? "1" : "0");
  } catch (_) {
    // no-op
  }
}

function loadFriendCardPreference() {
  try {
    return window.localStorage.getItem(FRIEND_CARD_STORAGE_KEY) === "1";
  } catch (_) {
    return false;
  }
}

function setFriendsCardCollapsed(collapsed) {
  if (!el.friendsCard || !el.friendsCardToggle) return;
  el.friendsCard.classList.toggle("is-collapsed", collapsed);
  el.friendsCardToggle.setAttribute("aria-expanded", String(!collapsed));
  el.friendsCardToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand friends list" : "Collapse friends list",
  );
  try {
    window.localStorage.setItem(FRIENDS_CARD_STORAGE_KEY, collapsed ? "1" : "0");
  } catch (_) {
    // no-op
  }
}

function loadFriendsCardPreference() {
  try {
    return window.localStorage.getItem(FRIENDS_CARD_STORAGE_KEY) === "1";
  } catch (_) {
    return false;
  }
}

async function parseResponsePayload(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (_) {
    if (!response.ok) {
      return {
        error:
          response.status === 401 || response.status === 403
            ? "Sign in again."
            : "Server returned an unexpected response.",
      };
    }
    return {};
  }
}

// Surface state and composer behavior
function isWideLayout() {
  return window.innerWidth > INBOX_BREAKPOINT;
}

function isInboxPanelOpen() {
  return isWideLayout()
    ? !document.body.classList.contains("notifications-collapsed")
    : document.body.classList.contains("inbox-open");
}

function syncInboxToggleState() {
  const open = isInboxPanelOpen();
  el.notificationToggleButton.classList.toggle("active", open);
  el.notificationToggleButton.setAttribute("aria-pressed", String(open));
  if (el.headerInboxButton) {
    el.headerInboxButton.classList.toggle("active", open);
    el.headerInboxButton.setAttribute("aria-pressed", String(open));
  }
}

function setInboxPanelOpen(nextOpen) {
  if (isWideLayout()) {
    document.body.classList.toggle("notifications-collapsed", !nextOpen);
    document.body.classList.remove("inbox-open");
  } else {
    document.body.classList.toggle("inbox-open", nextOpen);
  }
  syncInboxToggleState();
}

function openInboxPanel() {
  setInboxPanelOpen(true);
}

function closeInboxPanel() {
  setInboxPanelOpen(false);
}

function toggleInboxPanel() {
  setInboxPanelOpen(!isInboxPanelOpen());
}

function showBanner(message, variant) {
  if (!message) {
    el.surfaceBanner.className = "banner";
    el.surfaceBanner.textContent = "";
    return;
  }
  el.surfaceBanner.className = "banner " + variant + " show";
  el.surfaceBanner.textContent = message;
}

function syncSurfaceMode() {
  document.body.classList.toggle("compact-chat", activeChannel.type !== "home");
  document.body.classList.toggle("home-surface", activeChannel.type === "home");
}

function syncComposer() {
  const inConversation = activeChannel.type !== "home";
  const canSendText = inConversation && stompClient && stompClient.connected;
  const canAttach = activeChannel.type === "direct";
  el.messageInput.disabled = !inConversation;
  el.sendBtn.disabled = !canSendText;
  el.attachBtn.disabled = !canAttach;
  if (!inConversation) {
    el.messageInput.placeholder = "Pick a chat to start typing...";
  } else if (activeChannel.type === "direct") {
    el.messageInput.placeholder = canSendText
      ? "Write a message or add a caption..."
      : "Reconnecting before this message can be sent...";
  } else {
    el.messageInput.placeholder = canSendText
      ? "Write a message..."
      : "Reconnecting before group messages can be sent...";
  }
}

function setConnectionState(text, online) {
  el.connectionState.textContent = text;
  el.connectionState.className = "status-pill" + (online ? " online" : "");
  syncComposer();
}

function clearMessages(title, copy, kicker) {
  el.messagesArea.innerHTML =
    '<div class="empty-state">' +
    (kicker ? '<div class="eyebrow">' + kicker + "</div>" : "") +
    "<h2>" +
    title +
    '</h2><div class="muted">' +
    copy +
    "</div></div>";
}

function createHomeAction(label, copy, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-action-card";
  button.dataset.homeAction = action;

  const title = document.createElement("strong");
  title.textContent = label;
  const body = document.createElement("span");
  body.textContent = copy;

  button.append(title, body);
  return button;
}

function createHomeShortcut(name, meta, datasetKey, datasetValue) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-shortcut";
  button.dataset[datasetKey] = String(datasetValue);

  const avatar = document.createElement("div");
  avatar.className = "channel-avatar";
  avatar.textContent = initials(name);

  const copy = document.createElement("div");
  copy.className = "home-shortcut-copy";

  const title = document.createElement("div");
  title.className = "home-shortcut-title";
  title.textContent = name;

  const subtitle = document.createElement("div");
  subtitle.className = "home-shortcut-meta";
  subtitle.textContent = meta;

  copy.append(title, subtitle);
  button.append(avatar, copy);
  return button;
}

function createHomePanel(title, meta, buttons, emptyCopy) {
  const panel = document.createElement("section");
  panel.className = "home-panel";

  const head = document.createElement("div");
  head.className = "home-section-head";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const detail = document.createElement("span");
  detail.className = "mini muted";
  detail.textContent = meta;
  head.append(heading, detail);

  const body = document.createElement("div");
  body.className = "home-shortcut-list";
  if (buttons.length) {
    buttons.forEach((button) => body.appendChild(button));
  } else {
    const empty = document.createElement("div");
    empty.className = "home-empty";
    empty.textContent = emptyCopy;
    body.appendChild(empty);
  }

  panel.append(head, body);
  return panel;
}

function renderHomeOverview() {
  el.messagesArea.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "home-overview";

  const hero = document.createElement("section");
  hero.className = "home-hero";
  const kicker = document.createElement("div");
  kicker.className = "eyebrow";
  kicker.textContent = "Workspace";
  const heading = document.createElement("h2");
  heading.textContent = "Everything is ready to continue.";
  const copy = document.createElement("p");
  copy.textContent =
    "Jump back into a friend chat, open one of your groups, or handle requests from one place.";
  const actions = document.createElement("div");
  actions.className = "home-actions";
  actions.append(
    createHomeAction("Add Friend", "Send a request and unlock direct chat.", "add-friend"),
    createHomeAction("Open Notifications", "Review invites and friend requests.", "notifications"),
    createHomeAction("Create Group", "Start a fresh room for your class or team.", "create-group"),
  );
  hero.append(kicker, heading, copy, actions);

  const sections = document.createElement("div");
  sections.className = "home-sections";

  const friendButtons = socialState.friends.slice(0, 4).map((friend) => {
    const email = normalizeEmail(friend.email);
    return createHomeShortcut(
      displayName(friend),
      getPreview("direct", email, friend.email || "Ready to chat"),
      "homeFriend",
      email,
    );
  });

  const groupButtons = groups.slice(0, 4).map((group) =>
    createHomeShortcut(
      group.name || "Study Group",
      getPreview("group", group.id, group.category || "Open room"),
      "homeGroup",
      group.id,
    ),
  );

  sections.append(
    createHomePanel(
      "Recent friends",
      socialState.friends.length + " total",
      friendButtons,
      "Your accepted friends will appear here for quick access.",
    ),
    createHomePanel(
      "Your groups",
      groups.length + " active",
      groupButtons,
      "Join or create a group to see room shortcuts here.",
    ),
  );

  wrap.append(hero, sections);
  el.messagesArea.appendChild(wrap);
  el.messagesArea.scrollTop = 0;
}

function refreshHomeOverviewIfNeeded() {
  if (activeChannel.type === "home") renderHomeOverview();
}

// Message rendering
function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return (size >= 10 || index === 0 ? size.toFixed(0) : size.toFixed(1)) + " " + units[index];
}

function attachmentDataUrl(message) {
  if (message && message.attachmentUrl) return message.attachmentUrl;
  if (!message || !message.attachmentBase64) return "";
  return (
    "data:" +
    (message.attachmentContentType || "application/octet-stream") +
    ";base64," +
    message.attachmentBase64
  );
}

function buildAttachment(message) {
  if (!message || (!message.attachmentBase64 && !message.attachmentUrl)) return null;
  const wrap = document.createElement("div");
  wrap.className = "message-attachment";

  const label = document.createElement("strong");
  label.textContent = message.attachmentName || "attachment";
  wrap.appendChild(label);

  const href = attachmentDataUrl(message);
  const type = String(message.attachmentContentType || "");

  if (type.startsWith("video/")) {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.src = href;
    wrap.appendChild(video);
  } else if (type.startsWith("image/")) {
    const image = document.createElement("img");
    image.loading = "lazy";
    image.alt = message.attachmentName || "Attachment";
    image.src = href;
    wrap.appendChild(image);
  }

  const meta = document.createElement("small");
  meta.textContent =
    (message.attachmentContentType || "application/octet-stream") +
    (message.attachmentSize ? " - " + formatBytes(message.attachmentSize) : "");
  wrap.appendChild(meta);

  const download = document.createElement("a");
  download.href = href;
  download.download = message.attachmentName || "attachment";
  download.target = "_blank";
  download.rel = "noopener noreferrer";
  download.textContent = type.startsWith("video/")
    ? "Download video"
    : type.startsWith("image/")
      ? "Open image"
      : "Download file";
  wrap.appendChild(download);

  return wrap;
}

function messagePreview(message, sent, sender) {
  const prefix = sent ? "You" : sender;
  const text = String((message && message.content) || "").trim();
  if (message && message.attachmentName) {
    const kind = String(message.attachmentContentType || "").startsWith("video/")
      ? "video"
      : "file";
    return prefix + ": " + (text || "[" + kind + "] " + message.attachmentName);
  }
  return prefix + ": " + text;
}

function addMessage(message, sent, sender, timestamp) {
  if (el.messagesArea.querySelector(".empty-state")) el.messagesArea.innerHTML = "";
  const row = document.createElement("div");
  row.className = "message-row" + (sent ? " sent" : "");
  row.innerHTML =
    '<div class="channel-avatar">' +
    initials(sender) +
    '</div><div class="message-stack"><div class="message-meta"><strong>' +
    sender +
    "</strong><span>" +
    formatTime(timestamp) +
    '</span></div><div class="message-bubble"></div></div>';
  const bubble = row.querySelector(".message-bubble");
  const text = String((message && message.content) || "").trim();
  if (text) {
    const copy = document.createElement("div");
    copy.className = "message-copy";
    copy.textContent = text;
    bubble.appendChild(copy);
  }
  const attachment = buildAttachment(message);
  if (attachment) {
    bubble.appendChild(attachment);
  }
  el.messagesArea.appendChild(row);
  el.messagesArea.scrollTop = el.messagesArea.scrollHeight;
}

// Channel selection and sidebar rendering
function selectHome() {
  activeChannel = { type: "home" };
  syncSurfaceMode();
  el.chatKicker.textContent = "Overview";
  el.chatTitle.textContent = currentUser.username || defaultName(currentUser.email);
  el.chatSubtitle.textContent = "Friends, invites, and groups in one place.";
  showBanner("", "info");
  disconnectSubscription();
  highlightSelection();
  renderHomeOverview();
  syncComposer();
}

function selectDirect(friend) {
  activeChannel = {
    type: "direct",
    id: normalizeEmail(friend.email),
    email: friend.email,
    name: displayName(friend),
  };
  syncSurfaceMode();
  el.chatKicker.textContent = "";
  el.chatTitle.textContent = displayName(friend);
  el.chatSubtitle.textContent = friend.email || "";
  showBanner("", "info");
  highlightSelection();
  syncComposer();
  loadDirectHistory(friend.email);
  subscribeToDirect(friend.email);
}

function selectGroup(group) {
  activeChannel = { type: "group", id: group.id, name: group.name || "Study Group" };
  syncSurfaceMode();
  el.chatKicker.textContent = "Group";
  el.chatTitle.textContent = group.name || "Study Group";
  el.chatSubtitle.textContent = group.category || "";
  showBanner("", "info");
  highlightSelection();
  syncComposer();
  loadGroupHistory(group.id);
  subscribeToGroup(group.id);
}

function highlightSelection() {
  document.querySelectorAll(".channel-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.type === activeChannel.type &&
        item.dataset.id === String(activeChannel.id || ""),
    );
  });
  el.homeRailButton.classList.toggle(
    "active",
    activeChannel.type === "home" || activeChannel.type === "direct",
  );
  document.querySelectorAll(".rail-group").forEach((item) => {
    item.classList.toggle(
      "active",
      activeChannel.type === "group" &&
        item.dataset.id === String(activeChannel.id || ""),
    );
  });
}

function renderChannel(type, id, name, preview, role, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "channel-item";
  button.dataset.type = type;
  button.dataset.id = String(id);
  button.innerHTML =
    '<div class="channel-avatar">' +
    initials(name) +
    '</div><div class="channel-main"><div class="channel-name">' +
    name +
    '</div><div class="channel-preview"></div></div>' +
    (role ? '<div class="mini muted">' + role + "</div>" : "");
  button.querySelector(".channel-preview").textContent = preview;
  button.addEventListener("click", onClick);
  return button;
}

function renderFriends() {
  el.friendsList.innerHTML = "";
  el.friendsCount.textContent = String(socialState.friends.length);
  const query = friendSearchQuery.trim().toLowerCase();
  const visibleFriends = socialState.friends.filter((friend) => {
    if (!query) return true;
    const name = displayName(friend).toLowerCase();
    const email = String(friend.email || "").toLowerCase();
    return name.includes(query) || email.includes(query);
  });
  el.friendsEmpty.textContent = socialState.friends.length
    ? "No friends match your search."
    : "No accepted friends yet.";
  el.friendsEmpty.style.display = visibleFriends.length ? "none" : "block";
  visibleFriends.forEach((friend) => {
    const email = normalizeEmail(friend.email);
    el.friendsList.appendChild(
      renderChannel(
        "direct",
        email,
        displayName(friend),
        getPreview("direct", email, friend.email || "Accepted friend"),
        "DM",
        () => selectDirect(friend),
      ),
    );
  });
  highlightSelection();
  refreshHomeOverviewIfNeeded();
}

function renderGroups() {
  if (el.groupRailList) {
    el.groupRailList.innerHTML = "";
  }
  if (el.groupsList) {
    el.groupsList.innerHTML = "";
    groups.forEach((group) => {
      el.groupsList.appendChild(
        renderChannel(
          "group",
          group.id,
          group.name || "Study Group",
          getPreview("group", group.id, group.category || "Accepted room"),
          group.role || "",
          () => selectGroup(group),
        ),
      );
    });
  }
  if (el.groupRailList) {
    groups.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rail-btn rail-group";
      button.dataset.id = String(group.id);
      button.textContent = initials(group.name || "Group");
      button.title = group.name || "Study Group";
      button.addEventListener("click", () => selectGroup(group));
      el.groupRailList.appendChild(button);
    });
  }
  if (el.groupsEmpty) {
    el.groupsEmpty.style.display = groups.length ? "none" : "block";
  }
  el.overviewGroups.textContent = String(groups.length);
  highlightSelection();
  refreshHomeOverviewIfNeeded();
}

function renderNotificationCard(title, body, time, actions) {
  const card = document.createElement("div");
  card.className = "notification-item";
  card.innerHTML =
    "<strong>" +
    title +
    '</strong><div class="mini muted notification-body">' +
    body +
    '</div><div class="mini muted notification-time">' +
    time +
    "</div>";
  if (actions && actions.length) {
    const wrap = document.createElement("div");
    wrap.className = "notification-actions";
    actions.forEach((button) => wrap.appendChild(button));
    card.appendChild(wrap);
  }
  return card;
}

function renderNotifications() {
  const total =
    socialState.incomingFriendRequests.length + socialState.groupInvitations.length;
  el.notificationBadge.hidden = total === 0;
  el.notificationBadge.textContent = total > 9 ? "9+" : String(total);
  el.overviewFriends.textContent = String(socialState.friends.length);
  el.overviewNotifications.textContent = String(total);
  el.incomingFriendRequests.innerHTML = "";
  el.groupInvitations.innerHTML = "";
  el.incomingFriendsCount.textContent = String(
    socialState.incomingFriendRequests.length,
  );
  el.groupInvitationsCount.textContent = String(
    socialState.groupInvitations.length,
  );
  el.incomingFriendsEmpty.style.display = socialState.incomingFriendRequests.length
    ? "none"
    : "block";
  el.groupInvitationsEmpty.style.display = socialState.groupInvitations.length
    ? "none"
    : "block";

  socialState.incomingFriendRequests.forEach((request) => {
    const accept = Object.assign(document.createElement("button"), {
      type: "button",
      className: "tiny-btn accept",
      textContent: "Accept",
    });
    const decline = Object.assign(document.createElement("button"), {
      type: "button",
      className: "tiny-btn decline",
      textContent: "Decline",
    });
    accept.addEventListener("click", () => respondFriendRequest(request.id, "accept"));
    decline.addEventListener("click", () => respondFriendRequest(request.id, "decline"));
    el.incomingFriendRequests.appendChild(
      renderNotificationCard(
        request.requesterName || defaultName(request.requesterEmail),
        "Sent a friend request to unlock chat.",
        formatAgo(request.createdAt),
        [accept, decline],
      ),
    );
  });

  socialState.groupInvitations.forEach((invite) => {
    const accept = Object.assign(document.createElement("button"), {
      type: "button",
      className: "tiny-btn accept",
      textContent: "Join",
    });
    const decline = Object.assign(document.createElement("button"), {
      type: "button",
      className: "tiny-btn decline",
      textContent: "Decline",
    });
    accept.addEventListener("click", () => respondGroupInvitation(invite.id, "accept"));
    decline.addEventListener("click", () => respondGroupInvitation(invite.id, "decline"));
    el.groupInvitations.appendChild(
      renderNotificationCard(
        invite.groupName || "Study Group",
        "Invited by " +
          (invite.invitedByName || defaultName(invite.invitedByEmail)) +
          (invite.groupCategory ? " for " + invite.groupCategory + "." : "."),
        formatAgo(invite.createdAt),
        [accept, decline],
      ),
    );
  });
  refreshHomeOverviewIfNeeded();
}

// Workspace refresh and subscriptions
function disconnectSubscription() {
  if (activeSubscription) activeSubscription.unsubscribe();
  activeSubscription = null;
}

function conversationKey(firstEmail, secondEmail) {
  const pair = [normalizeEmail(firstEmail), normalizeEmail(secondEmail)]
    .sort()
    .join("::");
  return btoa(pair).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function loadSocialState() {
  const previousTotal =
    socialState.incomingFriendRequests.length + socialState.groupInvitations.length;
  const result = await authorizedRequest("/api/social/state");
  if (!result.ok) return;
  socialState = {
    friends: Array.isArray(result.data.friends) ? result.data.friends : [],
    incomingFriendRequests: Array.isArray(result.data.incomingFriendRequests)
      ? result.data.incomingFriendRequests
      : [],
    outgoingFriendRequests: Array.isArray(result.data.outgoingFriendRequests)
      ? result.data.outgoingFriendRequests
      : [],
    groupInvitations: Array.isArray(result.data.groupInvitations)
      ? result.data.groupInvitations
      : [],
  };
  const nextTotal =
    socialState.incomingFriendRequests.length + socialState.groupInvitations.length;
  if (notificationsPrimed && nextTotal > previousTotal) {
    showToast(
      nextTotal - previousTotal === 1
        ? "You have a new invitation."
        : "You have new invitations.",
    );
    openInboxPanel();
  }
  notificationsPrimed = true;
  renderFriends();
  renderNotifications();
}

async function refreshWorkspace() {
  await loadSocialState();
  await loadGroups();
}

async function loadGroups() {
  const result = await authorizedRequest("/api/groups/mine");
  groups = result.ok && Array.isArray(result.data) ? result.data : [];
  renderGroups();
}

async function loadDirectHistory(otherEmail) {
  const directId = normalizeEmail(otherEmail);
  clearMessages("Loading chat", "Pulling the latest messages.", "");
  const result = await authorizedRequest(
    "/api/messages/direct/" + encodeURIComponent(otherEmail),
  );
  if (activeChannel.type !== "direct" || normalizeEmail(activeChannel.email) !== directId) return;
  if (!result.ok) {
    clearMessages(
      "Chat unavailable",
      result.data.error || "Messaging unlocks after a friend request is accepted.",
      "",
    );
    showBanner(
      result.data.error || "Messaging unlocks after a friend request is accepted.",
      "error",
    );
    return;
  }
  showBanner("", "info");
  const messages = Array.isArray(result.data) ? result.data : [];
  if (!messages.length) {
    clearMessages("No messages yet", "Start the conversation here.", "");
    return;
  }
  el.messagesArea.innerHTML = "";
  messages.forEach((message) => {
    const sent = normalizeEmail(message.senderEmail) === normalizeEmail(currentUser.email);
    addMessage(message, sent, message.senderName || message.senderEmail || "User", message.timestamp);
  });
  const last = messages[messages.length - 1];
  if (last) {
    const sender =
      normalizeEmail(last.senderEmail) === normalizeEmail(currentUser.email)
        ? "You"
        : last.senderName || last.senderEmail || "User";
    setPreview("direct", directId, messagePreview(last, sender === "You", sender));
  }
}

async function loadGroupHistory(groupId) {
  const currentGroupId = String(groupId);
  clearMessages("Loading room", "Pulling the latest messages.", "Group");
  const result = await authorizedRequest("/api/messages/groups/" + groupId);
  if (activeChannel.type !== "group" || String(activeChannel.id) !== currentGroupId) return;
  if (!result.ok) {
    clearMessages(
      "Group unavailable",
      result.data.error || "You cannot open this room right now.",
      "Group",
    );
    showBanner(result.data.error || "Group history is unavailable.", "error");
    return;
  }
  showBanner("", "info");
  const messages = Array.isArray(result.data) ? result.data : [];
  if (!messages.length) {
    clearMessages("No messages yet", "Send the first message to this room.", "Group");
    return;
  }
  el.messagesArea.innerHTML = "";
  messages.forEach((message) => {
    const sent = normalizeEmail(message.senderEmail) === normalizeEmail(currentUser.email);
    addMessage(message, sent, message.senderName || message.senderEmail || "User", message.timestamp);
  });
  const last = messages[messages.length - 1];
  if (last) {
    const sender =
      normalizeEmail(last.senderEmail) === normalizeEmail(currentUser.email)
        ? "You"
        : last.senderName || last.senderEmail || "User";
    setPreview("group", groupId, messagePreview(last, sender === "You", sender));
  }
}

// Realtime messaging
function connectWs() {
  if (reconnectTimer) window.clearTimeout(reconnectTimer);
  const socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.connect(
    {},
    () => {
      setConnectionState("Connected", true);
      if (activeChannel.type === "group") subscribeToGroup(activeChannel.id);
      if (activeChannel.type === "direct") subscribeToDirect(activeChannel.email);
    },
    () => {
      setConnectionState("Reconnecting", false);
      reconnectTimer = window.setTimeout(connectWs, 3000);
    },
  );
}

function subscribeToGroup(groupId) {
  if (!stompClient || !stompClient.connected) return;
  disconnectSubscription();
  activeSubscription = stompClient.subscribe("/topic/groups/" + groupId, (payload) => {
    const message = JSON.parse(payload.body || "{}");
    if (!String(message.content || "").trim() && !message.attachmentBase64 && !message.attachmentUrl) return;
    const sent = normalizeEmail(message.senderEmail) === normalizeEmail(currentUser.email);
    const sender = message.senderName || message.senderEmail || "User";
    setPreview("group", groupId, messagePreview(message, sent, sender));
    addMessage(message, sent, sender, message.timestamp);
  });
}

function subscribeToDirect(otherEmail) {
  if (!stompClient || !stompClient.connected) return;
  disconnectSubscription();
  const key = conversationKey(currentUser.email, otherEmail);
  activeSubscription = stompClient.subscribe("/topic/direct/" + key, (payload) => {
    const message = JSON.parse(payload.body || "{}");
    if (!String(message.content || "").trim() && !message.attachmentBase64 && !message.attachmentUrl) return;
    const sent = normalizeEmail(message.senderEmail) === normalizeEmail(currentUser.email);
    const sender = message.senderName || message.senderEmail || "User";
    setPreview("direct", normalizeEmail(otherEmail), messagePreview(message, sent, sender));
    addMessage(message, sent, sender, message.timestamp);
  });
}

function sendGroupMessage(content) {
  stompClient.send(
    "/app/groups/" + activeChannel.id + "/send",
    {},
    JSON.stringify({
      groupId: activeChannel.id,
      senderEmail: currentUser.email,
      senderName: currentUser.username || currentUser.email,
      content,
    }),
  );
}

function sendDirectMessage(content) {
  const key = conversationKey(currentUser.email, activeChannel.email);
  stompClient.send(
    "/app/direct/" + key + "/send",
    {},
    JSON.stringify({
      conversationKey: key,
      senderEmail: currentUser.email,
      senderName: currentUser.username || currentUser.email,
      recipientEmail: activeChannel.email,
      content,
    }),
  );
}

async function uploadDirectAttachment(file) {
  if (!file || activeChannel.type !== "direct") return;
  const formData = new FormData();
  formData.append("file", file);
  const caption = el.messageInput.value.trim();
  if (caption) {
    formData.append("caption", caption);
  }

  el.attachBtn.disabled = true;
  el.attachBtn.textContent = "Uploading...";
  const result = await authorizedRequest(
    "/api/messages/direct/" + encodeURIComponent(activeChannel.email) + "/attachments",
    {
      method: "POST",
      body: formData,
    },
  );
  el.attachBtn.textContent = "Video/File";
  syncComposer();
  el.attachmentInput.value = "";

  if (!result.ok) {
    showToast(result.data.error || "Could not send the file.");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    const sender = result.data.senderName || currentUser.username || currentUser.email;
    setPreview("direct", activeChannel.id, messagePreview(result.data, true, sender));
    addMessage(result.data, true, sender, result.data.timestamp);
  }

  el.messageInput.value = "";
  showToast("Attachment sent.");
}

// User actions and bootstrap
async function respondFriendRequest(id, action) {
  const result = await authorizedRequest(
    "/api/social/friend-requests/" + id + "/" + action,
    { method: "POST" },
  );
  if (!result.ok) return showToast(result.data.error || "Could not update request.");
  showToast(action === "accept" ? "Friend request accepted." : "Friend request declined.");
  await loadSocialState();
}

async function respondGroupInvitation(id, action) {
  const result = await authorizedRequest(
    "/api/social/group-invitations/" + id + "/" + action,
    { method: "POST" },
  );
  if (!result.ok) return showToast(result.data.error || "Could not update invitation.");
  showToast(action === "accept" ? "Group invitation accepted." : "Group invitation declined.");
  await loadSocialState();
  await loadGroups();
}

async function bootstrap() {
  currentUser = requireAuth();
  if (!currentUser) return;
  const name = currentUser.username || defaultName(currentUser.email);
  el.userAvatar.textContent = initials(name);
  el.userName.textContent = name;
  el.userEmail.textContent = currentUser.email;
  el.selfRailLabel.textContent = initials(name);
  setFriendCardCollapsed(loadFriendCardPreference());
  setFriendsCardCollapsed(loadFriendsCardPreference());
  syncInboxToggleState();
  selectHome();
  await refreshWorkspace();
  connectWs();
  if (workspaceRefreshTimer) window.clearInterval(workspaceRefreshTimer);
  workspaceRefreshTimer = window.setInterval(refreshWorkspace, 5000);
}

// Event wiring
if (el.friendCardToggle) {
  el.friendCardToggle.addEventListener("click", () =>
    setFriendCardCollapsed(!el.friendCard.classList.contains("is-collapsed")),
  );
}

if (el.friendsCardToggle) {
  el.friendsCardToggle.addEventListener("click", () =>
    setFriendsCardCollapsed(!el.friendsCard.classList.contains("is-collapsed")),
  );
}

if (el.friendsSearchInput) {
  el.friendsSearchInput.addEventListener("input", (event) => {
    friendSearchQuery = event.target.value || "";
    renderFriends();
  });
}

el.messagesArea.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-home-action]");
  if (actionButton) {
    const action = actionButton.dataset.homeAction;
    if (action === "add-friend") {
      setFriendCardCollapsed(false);
      el.friendCard.scrollIntoView({ behavior: "smooth", block: "start" });
      el.friendEmailInput.focus();
      return;
    }
    if (action === "notifications") {
      openInboxPanel();
      return;
    }
    if (action === "create-group") {
      window.location.href = "/create-group.html";
    }
    return;
  }

  const friendShortcut = event.target.closest("[data-home-friend]");
  if (friendShortcut) {
    const email = normalizeEmail(friendShortcut.dataset.homeFriend || "");
    const friend = socialState.friends.find((item) => normalizeEmail(item.email) === email);
    if (friend) selectDirect(friend);
    return;
  }

  const groupShortcut = event.target.closest("[data-home-group]");
  if (groupShortcut) {
    const groupId = String(groupShortcut.dataset.homeGroup || "");
    const group = groups.find((item) => String(item.id) === groupId);
    if (group) selectGroup(group);
  }
});

el.friendRequestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = el.friendEmailInput.value.trim();
  if (!email) {
    setFriendFeedback("Enter an email before sending the request.", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFriendFeedback("Enter a valid email address.", "error");
    return;
  }
  setFriendFeedback("", "success");
  el.friendSubmitBtn.disabled = true;
  el.friendSubmitBtn.textContent = "Sending...";
  const result = await authorizedRequest("/api/social/friend-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  el.friendSubmitBtn.disabled = false;
  el.friendSubmitBtn.textContent = "Add";
  if (result.ok) {
    el.friendEmailInput.value = "";
    setFriendFeedback("Friend request sent. They can accept it from Thông báo.", "success");
    showToast("Friend request sent.");
    await loadSocialState();
  } else {
    setFriendFeedback(
      result.data.error || "Could not send friend request.",
      "error",
    );
  }
});

el.messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = el.messageInput.value.trim();
  if (!content || !stompClient || !stompClient.connected) return;
  if (activeChannel.type === "group") {
    sendGroupMessage(content);
    setPreview("group", activeChannel.id, "You: " + content);
  } else if (activeChannel.type === "direct") {
    sendDirectMessage(content);
    setPreview("direct", activeChannel.id, "You: " + content);
  } else {
    return;
  }
  el.messageInput.value = "";
});

el.attachBtn.addEventListener("click", () => {
  if (activeChannel.type !== "direct") {
    return showToast("Video/file upload is available in direct chat.");
  }
  el.attachmentInput.click();
});

el.attachmentInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  await uploadDirectAttachment(file);
});

el.homeRailButton.addEventListener("click", selectHome);
if (el.newGroupBtn) {
  el.newGroupBtn.addEventListener("click", () => (window.location.href = "/create-group.html"));
}
if (el.createGroupSidebarBtn) {
  el.createGroupSidebarBtn.addEventListener(
    "click",
    () => (window.location.href = "/create-group.html"),
  );
}
if (el.headerInboxButton) {
  el.headerInboxButton.addEventListener("click", toggleInboxPanel);
}
el.notificationToggleButton.addEventListener("click", toggleInboxPanel);
el.closeInboxButton.addEventListener("click", closeInboxPanel);
el.logoutBtn.addEventListener("click", () => {
  clearSession();
  window.location.href = "/login.html";
});
window.addEventListener("beforeunload", () => {
  try {
    if (workspaceRefreshTimer) window.clearInterval(workspaceRefreshTimer);
    disconnectSubscription();
    if (stompClient && stompClient.connected) stompClient.disconnect();
  } catch (_) {
    // no-op
  }
});
window.addEventListener("focus", refreshWorkspace);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshWorkspace();
});
window.addEventListener("resize", () => {
  if (isWideLayout()) {
    document.body.classList.remove("inbox-open");
  }
  syncInboxToggleState();
});
window.addEventListener("load", bootstrap);

