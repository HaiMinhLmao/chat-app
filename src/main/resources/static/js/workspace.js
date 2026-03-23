// DOM lookups stay centralized so markup changes are easy to track.
const el = {
  homeRailButton: document.getElementById("homeRailButton"),
  selfRailLabel: document.getElementById("selfRailLabel"),
  groupRailList: document.getElementById("groupRailList"),
  notificationToggleButton: document.getElementById("notificationToggleButton"),
  notificationBadge: document.getElementById("notificationBadge"),
  newGroupBtn: document.getElementById("newGroupBtn"),
  settingsToggleButton: document.getElementById("settingsToggleButton"),
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
  settingsPopover: document.getElementById("settingsPopover"),
  settingsCloseButton: document.getElementById("settingsCloseButton"),
  settingsScrim: document.getElementById("settingsScrim"),
  settingsUserName: document.getElementById("settingsUserName"),
  settingsUserEmail: document.getElementById("settingsUserEmail"),
  settingsAvatarPreview: document.getElementById("settingsAvatarPreview"),
  settingsProfileForm: document.getElementById("settingsProfileForm"),
  settingsDisplayNameInput: document.getElementById("settingsDisplayNameInput"),
  settingsAvatarUrlInput: document.getElementById("settingsAvatarUrlInput"),
  settingsBirthDateInput: document.getElementById("settingsBirthDateInput"),
  settingsLanguageSelect: document.getElementById("settingsLanguageSelect"),
  settingsDisplayNameSaveBtn: document.getElementById("settingsDisplayNameSaveBtn"),
  settingsProfileFeedback: document.getElementById("settingsProfileFeedback"),
  settingsThemeLight: document.getElementById("settingsThemeLight"),
  settingsThemeDark: document.getElementById("settingsThemeDark"),
  settingsThemeAuto: document.getElementById("settingsThemeAuto"),
  sidebarLogoutBtn: document.getElementById("sidebarLogoutBtn"),
  createGroupPopover: document.getElementById("createGroupPopover"),
  createGroupCloseButton: document.getElementById("createGroupCloseButton"),
  createGroupForm: document.getElementById("createGroupForm"),
  createGroupNameInput: document.getElementById("createGroupNameInput"),
  createGroupCategoryInput: document.getElementById("createGroupCategoryInput"),
  createGroupDescriptionInput: document.getElementById("createGroupDescriptionInput"),
  createGroupMembersInput: document.getElementById("createGroupMembersInput"),
  createGroupMembersPreview: document.getElementById("createGroupMembersPreview"),
  createGroupFeedback: document.getElementById("createGroupFeedback"),
  createGroupSubmitBtn: document.getElementById("createGroupSubmitBtn"),
  createGroupCancelBtn: document.getElementById("createGroupCancelBtn"),
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
const THEME_STORAGE_KEY = "workspaceTheme";
const INBOX_BREAKPOINT = 1380;
const SETTINGS_DRAWER_BREAKPOINT = 760;

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

function persistCurrentUser(user) {
  currentUser = user;
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function persistSessionUserName(nextName) {
  const session = getSession();
  if (!session || !session.user) return;
  const metadata = {
    ...(session.user.user_metadata || {}),
    full_name: nextName,
    username: nextName,
  };
  sessionStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      ...session,
      user: {
        ...session.user,
        user_metadata: metadata,
      },
    }),
  );
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

function requireAuth() {
  const user = getCurrentUser();
  if (user && user.email) return user;
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = "/login.html?returnTo=" + encodeURIComponent(currentPath || "/index.html");
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

function activeLanguage() {
  return currentUser && currentUser.preferredLanguage === "en" ? "en" : "vi";
}

function activeLocale() {
  return activeLanguage() === "en" ? "en-US" : "vi-VN";
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

function loadStoredFlag(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "1";
  } catch (_) {
    return fallback;
  }
}

function saveStoredFlag(key, value) {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch (_) {
    // no-op
  }
}

function normalizeAvatarUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    return new URL(trimmed, window.location.origin).toString();
  } catch (_) {
    return null;
  }
}

function loadThemePreference() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "dark" || savedTheme === "auto" ? savedTheme : "light";
  } catch (_) {
    return "light";
  }
}

function resolveTheme(nextTheme) {
  if (nextTheme === "auto") {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return nextTheme === "dark" ? "dark" : "light";
}

function syncThemeInputs(preference) {
  if (el.settingsThemeLight) el.settingsThemeLight.checked = preference === "light";
  if (el.settingsThemeDark) el.settingsThemeDark.checked = preference === "dark";
  if (el.settingsThemeAuto) el.settingsThemeAuto.checked = preference === "auto";
}

function applyTheme(nextTheme) {
  const preference = nextTheme === "auto" ? "auto" : nextTheme === "dark" ? "dark" : "light";
  const theme = resolveTheme(preference);
  document.body.classList.toggle("theme-dark", theme === "dark");
  syncThemeInputs(preference);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (_) {
    // no-op
  }
}

function formatAgo(timestamp) {
  const language = activeLanguage();
  if (!timestamp) return language === "en" ? "Just now" : "Vừa xong";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(timestamp)) / 60000));
  if (minutes < 60) return language === "en" ? minutes + "m ago" : minutes + " phút trước";
  const hours = Math.round(minutes / 60);
  if (hours < 24) return language === "en" ? hours + "h ago" : hours + " giờ trước";
  const days = Math.round(hours / 24);
  return language === "en" ? days + "d ago" : days + " ngày trước";
}

function formatTime(timestamp) {
  if (!timestamp) return activeLanguage() === "en" ? "Now" : "Bây giờ";
  return new Intl.DateTimeFormat(activeLocale(), {
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

function setInlineFeedback(node, message, variant) {
  if (!node) return;
  node.textContent = message || "";
  node.className = "mini settings-feedback";
  if (!message) return;
  node.classList.add(variant === "error" ? "error" : "success");
}

function setFriendFeedback(message, variant) {
  el.friendRequestFeedback.textContent = message || "";
  el.friendRequestFeedback.className = "mini friend-feedback";
  if (!message) return;
  el.friendRequestFeedback.classList.add(
    variant === "error" ? "error" : "success",
  );
}

function setSettingsProfileFeedback(message, variant) {
  setInlineFeedback(el.settingsProfileFeedback, message, variant);
}

function setCreateGroupFeedback(message, variant) {
  setInlineFeedback(el.createGroupFeedback, message, variant);
}

function syncAvatarNode(node, name, avatarUrl) {
  if (!node) return;
  const nextUrl = String(avatarUrl || "").trim();
  node.classList.toggle("has-image", Boolean(nextUrl));
  node.style.backgroundImage = nextUrl ? 'url("' + nextUrl.replace(/"/g, '\\"') + '")' : "";
  node.textContent = nextUrl ? "" : initials(name);
}

function refreshSettingsAvatarPreview() {
  const fallbackName = currentUser ? displayName(currentUser) : "User";
  const name =
    (el.settingsDisplayNameInput && el.settingsDisplayNameInput.value.trim()) || fallbackName;
  const avatarUrl =
    (el.settingsAvatarUrlInput && el.settingsAvatarUrlInput.value.trim()) ||
    (currentUser && currentUser.avatarUrl) ||
    "";
  syncAvatarNode(el.settingsAvatarPreview, name, avatarUrl);
}

function syncCurrentUserUi() {
  if (!currentUser) return;
  const name = displayName(currentUser);
  syncAvatarNode(el.userAvatar, name, currentUser.avatarUrl);
  el.userName.textContent = name;
  el.userEmail.textContent = currentUser.email;
  syncAvatarNode(el.selfRailLabel, name, currentUser.avatarUrl);
  syncAvatarNode(el.settingsAvatarPreview, name, currentUser.avatarUrl);
  if (el.settingsUserName) el.settingsUserName.textContent = name;
  if (el.settingsUserEmail) el.settingsUserEmail.textContent = currentUser.email;
  if (el.settingsDisplayNameInput) el.settingsDisplayNameInput.value = currentUser.fullName || name;
  if (el.settingsAvatarUrlInput) el.settingsAvatarUrlInput.value = currentUser.avatarUrl || "";
  if (el.settingsBirthDateInput) {
    el.settingsBirthDateInput.value = currentUser.birthDate || "";
    el.settingsBirthDateInput.max = new Date().toISOString().slice(0, 10);
  }
  if (el.settingsLanguageSelect) {
    el.settingsLanguageSelect.value = currentUser.preferredLanguage || "vi";
  }
  document.documentElement.lang = activeLanguage();
  if (activeChannel.type === "home") {
    el.chatTitle.textContent = name;
    refreshHomeOverviewIfNeeded();
  }
}

function setFriendCardCollapsed(collapsed) {
  if (!el.friendCard || !el.friendCardToggle) return;
  el.friendCard.classList.toggle("is-collapsed", collapsed);
  el.friendCardToggle.setAttribute("aria-expanded", String(!collapsed));
  el.friendCardToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand add friend" : "Collapse add friend",
  );
  saveStoredFlag(FRIEND_CARD_STORAGE_KEY, collapsed);
}

function loadFriendCardPreference() {
  return loadStoredFlag(FRIEND_CARD_STORAGE_KEY, true);
}

function setFriendsCardCollapsed(collapsed) {
  if (!el.friendsCard || !el.friendsCardToggle) return;
  el.friendsCard.classList.toggle("is-collapsed", collapsed);
  el.friendsCardToggle.setAttribute("aria-expanded", String(!collapsed));
  el.friendsCardToggle.setAttribute(
    "aria-label",
    collapsed ? "Expand friends list" : "Collapse friends list",
  );
  saveStoredFlag(FRIENDS_CARD_STORAGE_KEY, collapsed);
}

function loadFriendsCardPreference() {
  return loadStoredFlag(FRIENDS_CARD_STORAGE_KEY, true);
}

function isFlyoutMobile() {
  return window.innerWidth <= SETTINGS_DRAWER_BREAKPOINT;
}

function positionFlyout(panel, trigger) {
  if (!panel || !trigger || isFlyoutMobile()) {
    if (panel) {
      panel.style.top = "";
      panel.style.left = "";
    }
    return;
  }
  const triggerRect = trigger.getBoundingClientRect();
  const popoverWidth = panel.offsetWidth || 380;
  const popoverHeight = panel.offsetHeight || 560;
  const gap = 16;
  const nextLeft = Math.min(
    window.innerWidth - popoverWidth - 16,
    triggerRect.right + gap,
  );
  const centeredTop = triggerRect.top + triggerRect.height / 2 - popoverHeight / 2;
  const nextTop = Math.max(16, Math.min(centeredTop, window.innerHeight - popoverHeight - 16));
  panel.style.left = nextLeft + "px";
  panel.style.top = nextTop + "px";
}

function positionSettingsPopover() {
  positionFlyout(el.settingsPopover, el.settingsToggleButton);
}

function positionCreateGroupPopover() {
  positionFlyout(el.createGroupPopover, el.newGroupBtn);
}

function isSettingsPopoverOpen() {
  return document.body.classList.contains("settings-open");
}

function isCreateGroupPopoverOpen() {
  return document.body.classList.contains("create-group-open");
}

function syncFlyoutScrim() {
  const isOpen = isSettingsPopoverOpen() || isCreateGroupPopoverOpen();
  document.body.classList.toggle("flyout-open", isOpen);
  if (el.settingsScrim) {
    el.settingsScrim.hidden = !isOpen;
  }
}

function setSettingsPopoverOpen(nextOpen) {
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  document.body.classList.toggle("settings-open", nextOpen);
  if (el.settingsPopover) {
    el.settingsPopover.setAttribute("aria-hidden", String(!nextOpen));
  }
  if (el.settingsToggleButton) {
    el.settingsToggleButton.classList.toggle("active", nextOpen);
    el.settingsToggleButton.setAttribute("aria-pressed", String(nextOpen));
  }
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(positionSettingsPopover);
  }
}

function closeSettingsPopover() {
  setSettingsPopoverOpen(false);
}

function toggleSettingsPopover() {
  setSettingsPopoverOpen(!isSettingsPopoverOpen());
}

function setCreateGroupPopoverOpen(nextOpen) {
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  document.body.classList.toggle("create-group-open", nextOpen);
  if (el.createGroupPopover) {
    el.createGroupPopover.setAttribute("aria-hidden", String(!nextOpen));
  }
  if (el.newGroupBtn) {
    el.newGroupBtn.classList.toggle("active", nextOpen);
    el.newGroupBtn.setAttribute("aria-pressed", String(nextOpen));
  }
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(() => {
      positionCreateGroupPopover();
      if (el.createGroupNameInput) el.createGroupNameInput.focus();
    });
  }
}

function closeCreateGroupPopover() {
  setCreateGroupPopoverOpen(false);
}

function openCreateGroupPopover() {
  setCreateGroupPopoverOpen(true);
}

function toggleCreateGroupPopover() {
  setCreateGroupPopoverOpen(!isCreateGroupPopoverOpen());
}

function logout() {
  closeSettingsPopover();
  closeCreateGroupPopover();
  clearSession();
  window.location.href = "/login.html";
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

async function loadCurrentUserProfile() {
  if (!currentUser || !currentUser.email) return;
  const result = await authorizedRequest("/api/users/me");
  if (!result.ok || !result.data) return;
  const nextName =
    result.data.username ||
    result.data.fullName ||
    currentUser.username ||
    defaultName(currentUser.email);
  persistCurrentUser({
    ...currentUser,
    username: nextName,
    fullName: result.data.fullName || "",
    email: result.data.email || currentUser.email,
    avatarUrl: result.data.avatarUrl || "",
    birthDate: result.data.birthDate || "",
    preferredLanguage: result.data.preferredLanguage || "vi",
  });
  persistSessionUserName(nextName);
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
  const canAttach = activeChannel.type === "direct" || activeChannel.type === "group";
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

function parseMemberEmails(value) {
  return Array.from(
    new Set(
      String(value || "")
        .split(",")
        .map((item) => normalizeEmail(item))
        .filter(Boolean),
    ),
  );
}

function renderCreateGroupMembersPreview() {
  if (!el.createGroupMembersPreview) return;
  el.createGroupMembersPreview.innerHTML = "";
  parseMemberEmails(el.createGroupMembersInput && el.createGroupMembersInput.value).forEach((email) => {
    const chip = document.createElement("span");
    chip.className = "settings-chip";
    chip.textContent = email;
    el.createGroupMembersPreview.appendChild(chip);
  });
}

function clearCreateGroupForm() {
  if (el.createGroupForm) el.createGroupForm.reset();
  renderCreateGroupMembersPreview();
  setCreateGroupFeedback("", "success");
}

async function saveProfileSettings(event) {
  event.preventDefault();
  if (!currentUser || !el.settingsDisplayNameInput || !el.settingsDisplayNameSaveBtn) return;
  const fullName = el.settingsDisplayNameInput.value.trim();
  if (!fullName) {
    setSettingsProfileFeedback("Vui lòng nhập họ và tên.", "error");
    return;
  }
  const avatarUrl = normalizeAvatarUrl(el.settingsAvatarUrlInput ? el.settingsAvatarUrlInput.value : "");
  if (avatarUrl === null) {
    setSettingsProfileFeedback("Avatar phải là một đường dẫn hợp lệ.", "error");
    return;
  }
  const birthDate =
    el.settingsBirthDateInput && el.settingsBirthDateInput.value ? el.settingsBirthDateInput.value : null;
  const preferredLanguage = el.settingsLanguageSelect ? el.settingsLanguageSelect.value : "vi";
  el.settingsDisplayNameSaveBtn.disabled = true;
  el.settingsDisplayNameSaveBtn.textContent = "Đang lưu...";
  const result = await authorizedRequest("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, avatarUrl, birthDate, preferredLanguage }),
  });
  el.settingsDisplayNameSaveBtn.disabled = false;
  el.settingsDisplayNameSaveBtn.textContent = "Lưu thay đổi";
  if (!result.ok) {
    setSettingsProfileFeedback(result.data.error || "Không thể cập nhật hồ sơ.", "error");
    return;
  }
  const nextName = result.data.username || result.data.fullName || fullName;
  const nextLanguage = result.data.preferredLanguage || preferredLanguage;
  persistCurrentUser({
    ...currentUser,
    username: nextName,
    fullName: result.data.fullName || nextName,
    avatarUrl: result.data.avatarUrl || "",
    birthDate: result.data.birthDate || "",
    preferredLanguage: nextLanguage,
  });
  persistSessionUserName(nextName);
  syncCurrentUserUi();
  setSettingsProfileFeedback(
    nextLanguage === "en" ? "Profile updated." : "Đã cập nhật hồ sơ.",
    "success",
  );
  showToast(nextLanguage === "en" ? "Profile updated." : "Đã cập nhật hồ sơ.");
}

async function submitCreateGroup(event) {
  event.preventDefault();
  if (!el.createGroupSubmitBtn) return;
  const groupName = String(el.createGroupNameInput && el.createGroupNameInput.value).trim();
  const description = String(
    (el.createGroupDescriptionInput && el.createGroupDescriptionInput.value) || "",
  ).trim();
  const category = String((el.createGroupCategoryInput && el.createGroupCategoryInput.value) || "").trim();
  const members = parseMemberEmails(el.createGroupMembersInput && el.createGroupMembersInput.value);
  if (!groupName) {
    setCreateGroupFeedback("Enter a group name before creating the room.", "error");
    return;
  }
  const invalidEmail = members.find((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  if (invalidEmail) {
    setCreateGroupFeedback("Check the invited emails before creating the room.", "error");
    return;
  }
  setCreateGroupFeedback("", "success");
  el.createGroupSubmitBtn.disabled = true;
  el.createGroupSubmitBtn.textContent = "Creating...";
  const result = await authorizedRequest("/api/groups/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupName, description, category, members }),
  });
  el.createGroupSubmitBtn.disabled = false;
  el.createGroupSubmitBtn.textContent = "Create group";
  if (!result.ok) {
    setCreateGroupFeedback(result.data.error || "Could not create the group.", "error");
    return;
  }
  const createdId = String(result.data.id || "");
  clearCreateGroupForm();
  closeCreateGroupPopover();
  await loadGroups();
  const createdGroup =
    groups.find((group) => String(group.id) === createdId) || {
      id: result.data.id,
      name: result.data.name || groupName,
      category: result.data.category || category,
      role: "ADMIN",
    };
  if (createdGroup.id) {
    selectGroup(createdGroup);
  }
  showToast("Group created.");
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

  const type = String(message.attachmentContentType || "");
  if (type.startsWith("image/")) {
    wrap.classList.add("is-image");
  } else if (type.startsWith("video/")) {
    wrap.classList.add("is-video");
  } else {
    wrap.classList.add("is-file");
  }

  const header = document.createElement("div");
  header.className = "message-attachment-header";

  const label = document.createElement("strong");
  label.className = "message-attachment-title";
  label.textContent = message.attachmentName || "attachment";
  header.appendChild(label);

  const href = attachmentDataUrl(message);

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
  meta.className = "message-attachment-meta";
  meta.textContent =
    (message.attachmentContentType || "application/octet-stream") +
    (message.attachmentSize ? " - " + formatBytes(message.attachmentSize) : "");
  header.appendChild(meta);
  wrap.appendChild(header);

  const download = document.createElement("a");
  download.className = "message-attachment-link";
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
  el.chatTitle.textContent = displayName(currentUser);
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
      senderName: displayName(currentUser),
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
      senderName: displayName(currentUser),
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
    const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
    setPreview("direct", activeChannel.id, messagePreview(result.data, true, sender));
    addMessage(result.data, true, sender, result.data.timestamp);
  }

  el.messageInput.value = "";
  showToast("Attachment sent.");
}

async function uploadGroupAttachment(file) {
  if (!file || activeChannel.type !== "group") return;
  const activeGroupId = String(activeChannel.id);
  const formData = new FormData();
  formData.append("file", file);
  const caption = el.messageInput.value.trim();
  if (caption) {
    formData.append("caption", caption);
  }

  el.attachBtn.disabled = true;
  el.attachBtn.textContent = "Uploading...";
  const result = await authorizedRequest("/api/messages/groups/" + activeGroupId + "/attachments", {
    method: "POST",
    body: formData,
  });
  el.attachBtn.textContent = "Video/File";
  syncComposer();
  el.attachmentInput.value = "";

  if (!result.ok) {
    showToast(result.data.error || "Could not send the file.");
    return;
  }

  if (!stompClient || !stompClient.connected) {
    const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
    setPreview("group", activeGroupId, messagePreview(result.data, true, sender));
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

function handlePanelQuery() {
  const params = new URLSearchParams(window.location.search);
  const panel = params.get("panel");
  if (panel === "create-group") {
    openCreateGroupPopover();
    params.delete("panel");
    const nextSearch = params.toString();
    const nextUrl = window.location.pathname + (nextSearch ? "?" + nextSearch : "");
    window.history.replaceState({}, "", nextUrl);
  }
}

async function bootstrap() {
  currentUser = requireAuth();
  if (!currentUser) return;
  await loadCurrentUserProfile();
  applyTheme(loadThemePreference());
  syncCurrentUserUi();
  setFriendCardCollapsed(loadFriendCardPreference());
  setFriendsCardCollapsed(loadFriendsCardPreference());
  if (el.settingsToggleButton) {
    el.settingsToggleButton.title = "Settings";
    el.settingsToggleButton.setAttribute("aria-label", "Settings");
  }
  closeSettingsPopover();
  closeCreateGroupPopover();
  renderCreateGroupMembersPreview();
  setSettingsProfileFeedback("", "success");
  setCreateGroupFeedback("", "success");
  syncInboxToggleState();
  selectHome();
  await refreshWorkspace();
  handlePanelQuery();
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

[el.settingsThemeLight, el.settingsThemeDark, el.settingsThemeAuto]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.checked) applyTheme(event.target.value);
    });
  });

if (window.matchMedia) {
  const darkSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const syncPreferredTheme = () => {
    if (loadThemePreference() === "auto") applyTheme("auto");
  };
  if (typeof darkSchemeMedia.addEventListener === "function") {
    darkSchemeMedia.addEventListener("change", syncPreferredTheme);
  } else if (typeof darkSchemeMedia.addListener === "function") {
    darkSchemeMedia.addListener(syncPreferredTheme);
  }
}

if (el.settingsProfileForm) {
  el.settingsProfileForm.addEventListener("submit", saveProfileSettings);
}

if (el.settingsDisplayNameInput) {
  el.settingsDisplayNameInput.addEventListener("input", () => {
    setSettingsProfileFeedback("", "success");
    refreshSettingsAvatarPreview();
  });
}

if (el.settingsAvatarUrlInput) {
  el.settingsAvatarUrlInput.addEventListener("input", () => {
    setSettingsProfileFeedback("", "success");
    refreshSettingsAvatarPreview();
  });
}

if (el.settingsBirthDateInput) {
  el.settingsBirthDateInput.addEventListener("input", () => {
    setSettingsProfileFeedback("", "success");
  });
}

if (el.settingsLanguageSelect) {
  el.settingsLanguageSelect.addEventListener("change", () => {
    setSettingsProfileFeedback("", "success");
  });
}

if (el.createGroupMembersInput) {
  el.createGroupMembersInput.addEventListener("input", () => {
    renderCreateGroupMembersPreview();
    setCreateGroupFeedback("", "success");
  });
}

if (el.createGroupForm) {
  el.createGroupForm.addEventListener("submit", submitCreateGroup);
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
      openCreateGroupPopover();
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
  if (activeChannel.type === "home") {
    return showToast("Pick a chat before sending a file.");
  }
  el.attachmentInput.click();
});

el.attachmentInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (activeChannel.type === "direct") {
    await uploadDirectAttachment(file);
    return;
  }
  if (activeChannel.type === "group") {
    await uploadGroupAttachment(file);
  }
});

el.homeRailButton.addEventListener("click", selectHome);
if (el.newGroupBtn) {
  el.newGroupBtn.addEventListener("click", toggleCreateGroupPopover);
}
if (el.settingsToggleButton) {
  el.settingsToggleButton.addEventListener("click", toggleSettingsPopover);
}
if (el.settingsCloseButton) {
  el.settingsCloseButton.addEventListener("click", closeSettingsPopover);
}
if (el.createGroupCloseButton) {
  el.createGroupCloseButton.addEventListener("click", closeCreateGroupPopover);
}
if (el.createGroupCancelBtn) {
  el.createGroupCancelBtn.addEventListener("click", closeCreateGroupPopover);
}
if (el.settingsScrim) {
  el.settingsScrim.addEventListener("click", () => {
    closeSettingsPopover();
    closeCreateGroupPopover();
  });
}
if (el.createGroupSidebarBtn) {
  el.createGroupSidebarBtn.addEventListener("click", openCreateGroupPopover);
}
if (el.headerInboxButton) {
  el.headerInboxButton.addEventListener("click", toggleInboxPanel);
}
el.notificationToggleButton.addEventListener("click", toggleInboxPanel);
el.closeInboxButton.addEventListener("click", closeInboxPanel);
if (el.sidebarLogoutBtn) {
  el.sidebarLogoutBtn.addEventListener("click", logout);
}
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
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (isCreateGroupPopoverOpen()) {
    closeCreateGroupPopover();
    return;
  }
  if (isSettingsPopoverOpen()) {
    closeSettingsPopover();
  }
});
window.addEventListener("resize", () => {
  if (isWideLayout()) {
    document.body.classList.remove("inbox-open");
  }
  syncInboxToggleState();
  if (isSettingsPopoverOpen()) {
    positionSettingsPopover();
  }
  if (isCreateGroupPopoverOpen()) {
    positionCreateGroupPopover();
  }
  syncInboxToggleState();
});
window.addEventListener(
  "scroll",
  () => {
    if (isSettingsPopoverOpen()) {
      positionSettingsPopover();
    }
    if (isCreateGroupPopoverOpen()) {
      positionCreateGroupPopover();
    }
  },
  true,
);
window.addEventListener("load", bootstrap);

