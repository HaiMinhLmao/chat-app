/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function mustGetElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error('Missing required element #' + id);
  }
  return element;
}

/**
 * @param {string} id
 * @returns {HTMLButtonElement}
 */
function mustGetButton(id) {
  return /** @type {HTMLButtonElement} */ (mustGetElement(id));
}

/**
 * @param {string} id
 * @returns {HTMLInputElement}
 */
function mustGetInput(id) {
  return /** @type {HTMLInputElement} */ (mustGetElement(id));
}

/**
 * @param {string} id
 * @returns {HTMLFormElement}
 */
function mustGetForm(id) {
  return /** @type {HTMLFormElement} */ (mustGetElement(id));
}

/**
 *
 */
function mustGetSelect(id) {
  return /** @type {HTMLSelectElement} */ (mustGetElement(id));
}

/**
 * @param {string} id
 * @returns {HTMLTextAreaElement}
 */
function mustGetTextarea(id) {
  return /** @type {HTMLTextAreaElement} */ (mustGetElement(id));
}

/**
 * @param {string} id
 * @returns {HTMLElement | null}
 */
function getOptionalElement(id) {
  return document.getElementById(id);
}

/**
 * @param {string} id
 * @returns {HTMLButtonElement | null}
 */
function getOptionalButton(id) {
  return /** @type {HTMLButtonElement | null} */ (document.getElementById(id));
}

/**
 * @param {string} id
 * @returns {HTMLInputElement | null}
 */
function getOptionalInput(id) {
  return /** @type {HTMLInputElement | null} */ (document.getElementById(id));
}

/**
 * @param {EventTarget | null} target
 * @returns {HTMLElement | null}
 */
function asElement(target) {
  return target instanceof HTMLElement ? target : null;
}

// DOM lookups stay centralized so markup changes are easy to track.
const el = {
  homeRailButton: mustGetButton("homeRailButton"),
  selfRailLabel: mustGetElement("selfRailLabel"),
  groupRailList: mustGetElement("groupRailList"),
  notificationToggleButton: mustGetButton("notificationToggleButton"),
  notificationBadge: mustGetElement("notificationBadge"),
  newGroupBtn: mustGetElement("newGroupBtn"),
  newGroupToggleInput: mustGetInput("newGroupToggleInput"),
  studyTimerToggleButton: mustGetButton("studyTimerToggleButton"),
  studyNotesToggleButton: getOptionalButton("studyNotesToggleButton"),
  profileToggleButton: getOptionalButton("profileToggleButton"),
  settingsToggleButton: mustGetButton("settingsToggleButton"),
  dashboardNavButton: getOptionalButton("dashboardNavButton"),
  friendsNavButton: getOptionalButton("friendsNavButton"),
  groupNavButton: getOptionalButton("groupNavButton"),
  userAvatar: mustGetElement("userAvatar"),
  userName: mustGetElement("userName"),
  userEmail: mustGetElement("userEmail"),
  friendCard: mustGetElement("friendCard"),
  friendCardToggle: mustGetElement("friendCardToggle"),
  friendCardToggleInput: mustGetInput("friendCardToggleInput"),
  previewSocialActionIdle: mustGetInput("previewSocialActionIdle"),
  friendsCard: mustGetElement("friendsCard"),
  friendsCardToggle: mustGetButton("friendsCardToggle"),
  friendRequestForm: mustGetForm("friendRequestForm"),
  friendEmailInput: mustGetInput("friendEmailInput"),
  friendSubmitBtn: mustGetButton("friendSubmitBtn"),
  friendRequestFeedback: mustGetElement("friendRequestFeedback"),
  friendsSearchInput: getOptionalInput("friendsSearchInput"),
  settingsPopover: mustGetElement("settingsPopover"),
  settingsCloseButton: mustGetButton("settingsCloseButton"),
  settingsScrim: mustGetElement("settingsScrim"),
  studyTimerPopover: mustGetElement("studyTimerPopover"),
  studyTimerCloseButton: mustGetButton("studyTimerCloseButton"),
  studyTimerPanelMount: mustGetElement("studyTimerPanelMount"),
  studyNotesPopover: getOptionalElement("studyNotesPopover"),
  studyNotesCloseButton: getOptionalButton("studyNotesCloseButton"),
  studyNotesPanelMount: getOptionalElement("studyNotesPanelMount"),
  settingsUserName: mustGetElement("settingsUserName"),
  settingsUserEmail: mustGetElement("settingsUserEmail"),
  settingsAvatarPreview: mustGetElement("settingsAvatarPreview"),
  settingsProfileForm: mustGetForm("settingsProfileForm"),
  settingsDisplayNameInput: mustGetInput("settingsDisplayNameInput"),
  settingsAvatarUrlInput: mustGetInput("settingsAvatarUrlInput"),
  settingsBirthDateInput: mustGetInput("settingsBirthDateInput"),
  settingsLanguageSelect: mustGetSelect("settingsLanguageSelect"),
  settingsDisplayNameSaveBtn: mustGetButton("settingsDisplayNameSaveBtn"),
  settingsProfileFeedback: mustGetElement("settingsProfileFeedback"),
  settingsThemeLight: mustGetInput("settingsThemeLight"),
  settingsThemeDark: mustGetInput("settingsThemeDark"),
  settingsThemeAuto: mustGetInput("settingsThemeAuto"),
  sidebarLogoutBtn: mustGetButton("sidebarLogoutBtn"),
  createGroupPopover: mustGetElement("createGroupPopover"),
  createGroupCloseButton: mustGetButton("createGroupCloseButton"),
  createGroupForm: mustGetForm("createGroupForm"),
  createGroupNameInput: mustGetInput("createGroupNameInput"),
  createGroupCategoryInput: mustGetSelect("createGroupCategoryInput"),
  createGroupDescriptionInput: mustGetTextarea("createGroupDescriptionInput"),
  createGroupMembersInput: mustGetInput("createGroupMembersInput"),
  createGroupMembersPreview: mustGetElement("createGroupMembersPreview"),
  createGroupFeedback: mustGetElement("createGroupFeedback"),
  createGroupSubmitBtn: mustGetButton("createGroupSubmitBtn"),
  createGroupCancelBtn: mustGetButton("createGroupCancelBtn"),
  attachmentInput: mustGetInput("attachmentInput"),
  attachBtn: mustGetButton("attachBtn"),
  friendsList: mustGetElement("friendsList"),
  friendsCount: mustGetElement("friendsCount"),
  friendsEmpty: mustGetElement("friendsEmpty"),
  friendsSection: getOptionalElement("friendsSection"),
  favoriteAvatars: getOptionalElement("favoriteAvatars"),
  favoritesEmpty: getOptionalElement("favoritesEmpty"),
  favoritesCount: getOptionalElement("favoritesCount"),
  groupsList: getOptionalElement("groupsList"),
  groupsEmpty: getOptionalElement("groupsEmpty"),
  groupsSection: getOptionalElement("groupsSection"),
  createGroupSidebarBtn: getOptionalButton("createGroupSidebarBtn"),
  filterAllButton: getOptionalButton("filterAllButton"),
  filterPersonalButton: getOptionalButton("filterPersonalButton"),
  filterGroupsButton: getOptionalButton("filterGroupsButton"),
  previewRosterBadge: getOptionalElement("previewRosterBadge"),
  chatKicker: mustGetElement("chatKicker"),
  chatTitle: mustGetElement("chatTitle"),
  chatSubtitle: mustGetElement("chatSubtitle"),
  chatAvatar: getOptionalElement("chatAvatar"),
  connectionState: mustGetElement("connectionState"),
  headerInboxButton: getOptionalButton("headerInboxButton"),
  pinnedMessageStrip: getOptionalElement("pinnedMessageStrip"),
  overviewFriends: mustGetElement("overviewFriends"),
  overviewNotifications: mustGetElement("overviewNotifications"),
  overviewGroups: mustGetElement("overviewGroups"),
  surfaceBanner: mustGetElement("surfaceBanner"),
  messagesArea: mustGetElement("messagesArea"),
  messageForm: mustGetForm("messageForm"),
  messageInput: mustGetInput("messageInput"),
  sendBtn: mustGetButton("sendBtn"),
  utilityPanel: mustGetElement("utilityPanel"),
  closeInboxButton: mustGetButton("closeInboxButton"),
  incomingFriendRequests: mustGetElement("incomingFriendRequests"),
  incomingFriendsCount: mustGetElement("incomingFriendsCount"),
  incomingFriendsEmpty: mustGetElement("incomingFriendsEmpty"),
  groupInvitations: mustGetElement("groupInvitations"),
  groupInvitationsCount: mustGetElement("groupInvitationsCount"),
  groupInvitationsEmpty: mustGetElement("groupInvitationsEmpty"),
  toast: mustGetElement("toast"),
  workspaceBootLoader: getOptionalElement("workspaceBootLoader"),
  previewApp: getOptionalElement("previewApp"),
  previewSidebarAvatar: getOptionalElement("previewSidebarAvatar"),
  previewDetails: getOptionalElement("previewDetails"),
  previewDetailsTitle: getOptionalElement("previewDetailsTitle"),
  previewCloseProfile: getOptionalButton("previewCloseProfile"),
  previewProfileAvatar: getOptionalElement("previewProfileAvatar"),
  previewProfileName: getOptionalElement("previewProfileName"),
  previewProfileEmail: getOptionalElement("previewProfileEmail"),
  previewProfilePhone: getOptionalElement("previewProfilePhone"),
  previewProfileStatus: getOptionalElement("previewProfileStatus"),
  previewMutualCount: getOptionalElement("previewMutualCount"),
  previewAddFriendBtn: getOptionalButton("previewAddFriendBtn"),
  previewGroupInfoBtn: getOptionalButton("previewGroupInfoBtn"),
  previewGroupPanel: getOptionalElement("previewGroupPanel"),
  previewGroupMembersCount: getOptionalElement("previewGroupMembersCount"),
  previewGroupMembersList: getOptionalElement("previewGroupMembersList"),
  previewGroupMembersEmpty: getOptionalElement("previewGroupMembersEmpty"),
  previewGroupOwnerTools: getOptionalElement("previewGroupOwnerTools"),
  previewGroupRenameInput: getOptionalInput("previewGroupRenameInput"),
  previewGroupRenameBtn: getOptionalButton("previewGroupRenameBtn"),
  previewGroupManageFeedback: getOptionalElement("previewGroupManageFeedback"),
  previewGroupLeaveTools: getOptionalElement("previewGroupLeaveTools"),
  previewGroupLeaveBtn: getOptionalButton("previewGroupLeaveBtn"),
  previewGroupLeaveFeedback: getOptionalElement("previewGroupLeaveFeedback"),
  previewPinnedPanel: getOptionalElement("previewPinnedPanel"),
  previewSharedPanel: getOptionalElement("previewSharedPanel"),
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
let rosterFilter = "all";
let previewDetailsMode = "self";
const groupDetailsCache = new Map();
const previews = new Map();
const AUTH_SESSION_KEY = "authSession";
const LEGACY_SESSION_KEY = "supabaseSession";
const WORKSPACE_BOOT_LOADER_KEY = "workspaceBootLoader";
const FRIEND_CARD_STORAGE_KEY = "workspaceFriendCardCollapsed";
const FRIENDS_CARD_STORAGE_KEY = "workspaceFriendsCardCollapsed";
const THEME_STORAGE_KEY = "workspaceTheme";
const STUDY_TIMER_STORAGE_KEY = "workspaceStudyTimer";
const DASHBOARD_PROGRESS_STORAGE_KEY = "workspaceDashboardProgress";
const PLANNER_STORAGE_KEY = "workspacePlannerDesk";
const DEFAULT_PLANNER_REMOTE_ENDPOINT = "/api/users/me/planner";
const PLANNER_REMOTE_SAVE_DEBOUNCE_MS = 700;
const SETTINGS_DRAWER_BREAKPOINT = 760;
const MINUTE_MS = 60000;
const REQUEST_TIMEOUT_MS = 10000;
const WORKSPACE_BOOT_MIN_MS = 650;
const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const PLANNER_STATUS_OPTIONS = ["todo", "progress", "done"];
const PLANNER_PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];
const PLANNER_NOTE_COLOR_OPTIONS = ["amber", "sky", "mint", "rose", "violet", "slate"];
let studyTimerTicker = null;
const conversationHistoryCache = new Map();
const pinnedMessagesCache = new Map();
let messageActionMenuState = null;
let plannerFloatingLayer = null;
let plannerNoteDragState = null;
let plannerLiveSecond = -1;
let plannerDraggedTaskId = "";
let plannerRemoteSaveTimer = null;
let plannerPendingRemoteSnapshot = null;
let plannerRemoteSaveInFlight = null;
const workspaceBootStartedAt = Date.now();

if (hasWorkspaceBootLoader() && el.workspaceBootLoader) {
  el.workspaceBootLoader.setAttribute("aria-hidden", "false");
}

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

function requestFailureMessage(error) {
  return error && error.name === "AbortError"
    ? "Máy chủ phản hồi quá lâu. Vui lòng thử lại."
    : "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  if (typeof AbortController !== "function" || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return fetch(url, options);
  }
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function refreshSession() {
  const session = getSession();
  const refreshToken = session && session.refresh_token;
  if (!refreshToken) return null;
  let response;
  try {
    response = await fetchWithTimeout("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (_) {
    return null;
  }
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
  let response;
  try {
    response = await fetchWithTimeout(url, buildOptions(token));
  } catch (error) {
    return { ok: false, data: { error: requestFailureMessage(error) } };
  }
  if (response.status === 401) {
    token = await refreshSession();
    if (!token) {
      clearSession();
      return { ok: false, data: { error: "Sign in again." } };
    }
    try {
      response = await fetchWithTimeout(url, buildOptions(token));
    } catch (error) {
      return { ok: false, data: { error: requestFailureMessage(error) } };
    }
  }
  const data = await parseResponsePayload(response);
  return { ok: response.ok, data };
}

function hasWorkspaceBootLoader() {
  return document.documentElement.classList.contains("workspace-booting");
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, ms)));
}

function nextFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

async function finishWorkspaceBoot() {
  if (!hasWorkspaceBootLoader()) {
    try {
      sessionStorage.removeItem(WORKSPACE_BOOT_LOADER_KEY);
    } catch (error) {
      console.warn("Could not clear workspace boot flag.", error);
    }
    return;
  }

  const waiters = [nextFrame(), nextFrame()];
  const remainingMs = WORKSPACE_BOOT_MIN_MS - (Date.now() - workspaceBootStartedAt);
  if (remainingMs > 0) {
    waiters.push(wait(remainingMs));
  }
  if (document.fonts && document.fonts.ready) {
    waiters.push(document.fonts.ready.catch(() => undefined));
  }
  await Promise.all(waiters);

  document.documentElement.classList.remove("workspace-booting");
  if (el.workspaceBootLoader) {
    el.workspaceBootLoader.setAttribute("aria-hidden", "true");
  }
  try {
    sessionStorage.removeItem(WORKSPACE_BOOT_LOADER_KEY);
  } catch (error) {
    console.warn("Could not clear workspace boot flag.", error);
  }
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

function localizeText(vi, en) {
  return activeLanguage() === "en" ? en : vi;
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
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (_) {
    // no-op
  }
  return "light";
}

function syncThemeInputs(preference) {
  el.settingsThemeLight.checked = preference === "light";
  el.settingsThemeDark.checked = preference === "dark";
  el.settingsThemeAuto.checked = preference === "auto";
}

function applyTheme(nextTheme) {
  void nextTheme;
  document.body.classList.remove("theme-dark");
  syncThemeInputs("light");
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
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
  refreshHomeOverviewIfNeeded();
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

function setPreviewGroupManageFeedback(message, variant) {
  setInlineFeedback(el.previewGroupManageFeedback, message, variant);
}

function setPreviewGroupLeaveFeedback(message, variant) {
  setInlineFeedback(el.previewGroupLeaveFeedback, message, variant);
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
  const name = el.settingsDisplayNameInput.value.trim() || fallbackName;
  const avatarUrl = el.settingsAvatarUrlInput.value.trim() || (currentUser && currentUser.avatarUrl) || "";
  syncAvatarNode(el.settingsAvatarPreview, name, avatarUrl);
}

function removeLanguageSettingsField() {
  const field = el.settingsLanguageSelect.closest("label");
  if (field) field.remove();
}

function syncCurrentUserUi() {
  if (!currentUser) return;
  const name = displayName(currentUser);
  syncAvatarNode(el.userAvatar, name, currentUser.avatarUrl);
  syncAvatarNode(el.previewSidebarAvatar, name, currentUser.avatarUrl);
  el.userName.textContent = name;
  el.userEmail.textContent = currentUser.email;
  syncAvatarNode(el.selfRailLabel, name, currentUser.avatarUrl);
  syncAvatarNode(el.settingsAvatarPreview, name, currentUser.avatarUrl);
  el.settingsUserName.textContent = name;
  el.settingsUserEmail.textContent = currentUser.email;
  el.settingsDisplayNameInput.value = currentUser.fullName || name;
  el.settingsAvatarUrlInput.value = currentUser.avatarUrl || "";
  el.settingsBirthDateInput.value = currentUser.birthDate || "";
  el.settingsBirthDateInput.max = new Date().toISOString().slice(0, 10);
  if (el.settingsLanguageSelect.isConnected) {
    el.settingsLanguageSelect.value = currentUser.preferredLanguage || "vi";
  }
  document.documentElement.lang = activeLanguage();
  if (activeChannel.type === "home") {
    el.chatKicker.textContent = "Inbox";
    el.chatTitle.textContent = localizeText("Hộp chat", "Inbox");
    el.chatSubtitle.textContent = localizeText(
      "Chọn một cuộc trò chuyện hoặc nhóm để bắt đầu.",
      "Pick a conversation or group to get started.",
    );
    syncAvatarNode(el.chatAvatar, name, currentUser.avatarUrl);
    refreshHomeOverviewIfNeeded();
  }
  syncPreviewProfilePanel();
  renderFavoritesStrip();
}

function setPreviewDetailsOpen(nextOpen) {
  if (!el.previewApp || !el.previewDetails) return;
  el.previewApp.classList.toggle("details-open", nextOpen);
  if (el.profileToggleButton) {
    const selfOpen = nextOpen && previewDetailsMode === "self";
    el.profileToggleButton.classList.toggle("active", selfOpen);
    el.profileToggleButton.setAttribute("aria-pressed", String(selfOpen));
  }
  if (el.headerInboxButton) {
    const channelOpen = nextOpen && previewDetailsMode === "channel";
    el.headerInboxButton.classList.toggle("active", channelOpen);
    el.headerInboxButton.setAttribute("aria-pressed", String(channelOpen));
  }
  if (nextOpen) {
    el.previewDetails.scrollTop = 0;
    if (previewDetailsMode === "channel" && activeChannel.type === "group") {
      void ensureGroupDetails(activeChannel.id);
    }
  }
}

function closePreviewDetails() {
  setPreviewDetailsOpen(false);
}

function openCurrentUserProfile() {
  previewDetailsMode = "self";
  syncPreviewProfilePanel();
  setPreviewDetailsOpen(true);
}

function openActiveChannelDetails() {
  previewDetailsMode = "channel";
  syncPreviewProfilePanel();
  setPreviewDetailsOpen(true);
}

function showPreviewAction(button, visible, label, disabled) {
  if (!button) return;
  button.hidden = !visible;
  button.disabled = Boolean(disabled);
  if (visible && label) {
    button.textContent = label;
  }
}

function activeGroupRecord() {
  return groups.find((group) => String(group.id) === String(activeChannel.id || ""));
}

function activeFriendRecord() {
  return socialState.friends.find(
    (friend) => normalizeEmail(friend.email) === String(activeChannel.id || ""),
  );
}

function workspaceIdentityByEmail(email) {
  const normalized = normalizeEmail(email);
  if (currentUser && normalizeEmail(currentUser.email) === normalized) {
    return {
      name: displayName(currentUser),
      email: currentUser.email || email,
      avatarUrl: currentUser.avatarUrl || "",
    };
  }
  const friend = socialState.friends.find((item) => normalizeEmail(item.email) === normalized);
  if (friend) {
    return {
      name: displayName(friend),
      email: friend.email || email,
      avatarUrl: friend.avatarUrl || "",
    };
  }
  return {
    name: defaultName(email),
    email,
    avatarUrl: "",
  };
}

function resolveMessageIdentity(message, sent, fallbackSender) {
  const senderEmail = normalizeEmail(message && message.senderEmail);
  if (senderEmail) {
    const info = workspaceIdentityByEmail(senderEmail);
    if (info && (info.name || info.avatarUrl)) {
      return {
        name: info.name || fallbackSender || defaultName(senderEmail),
        email: info.email || senderEmail,
        avatarUrl: info.avatarUrl || "",
      };
    }
  }

  if (sent && currentUser) {
    return {
      name: displayName(currentUser),
      email: currentUser.email || senderEmail || "",
      avatarUrl: currentUser.avatarUrl || "",
    };
  }

  if (activeChannel.type === "direct") {
    const friend = activeFriendRecord();
    if (friend) {
      return {
        name: displayName(friend),
        email: friend.email || senderEmail || "",
        avatarUrl: friend.avatarUrl || "",
      };
    }
  }

  return {
    name: fallbackSender || defaultName(senderEmail),
    email: senderEmail || "",
    avatarUrl: "",
  };
}

function mergeGroupDetails(detail) {
  if (!detail || !detail.id) return null;
  const group = groups.find((item) => String(item.id) === String(detail.id));
  if (group) {
    Object.assign(group, detail);
    group.membersLoading = false;
    return group;
  }
  return detail;
}

function isGroupCreator(group) {
  const creatorEmail = normalizeEmail(group && group.createdByEmail);
  return Boolean(creatorEmail && currentUser && creatorEmail === normalizeEmail(currentUser.email));
}

function syncPreviewGroupOwnerTools(groupRecord) {
  if (!el.previewGroupOwnerTools || !el.previewGroupRenameInput || !el.previewGroupRenameBtn) return;
  const visible = Boolean(groupRecord) && activeChannel.type === "group" && isGroupCreator(groupRecord);
  el.previewGroupOwnerTools.hidden = !visible;
  if (!visible) {
    el.previewGroupRenameBtn.disabled = false;
    setPreviewGroupManageFeedback("", "success");
    return;
  }
  if (document.activeElement !== el.previewGroupRenameInput) {
    el.previewGroupRenameInput.value = groupRecord.name || "";
  }
}

function syncPreviewGroupLeaveTools(groupRecord) {
  if (!el.previewGroupLeaveTools || !el.previewGroupLeaveBtn) return;
  const visible =
    Boolean(groupRecord) &&
    activeChannel.type === "group" &&
    !isGroupCreator(groupRecord);
  el.previewGroupLeaveTools.hidden = !visible;
  if (!visible) {
    el.previewGroupLeaveBtn.disabled = false;
    setPreviewGroupLeaveFeedback("", "success");
  }
}

function applyGroupDetails(detail) {
  if (!detail || !detail.id) return null;
  const groupId = String(detail.id);
  groupDetailsCache.set(groupId, detail);
  const groupRecord = mergeGroupDetails(detail) || detail;
  if (activeChannel.type === "group" && String(activeChannel.id) === groupId) {
    activeChannel.name = groupRecord.name || "Study Group";
    el.chatTitle.textContent = groupRecord.name || "Study Group";
    el.chatSubtitle.textContent = groupRecord.category || "";
    syncAvatarNode(el.chatAvatar, groupRecord.name || "Study Group", "");
  }
  renderGroups();
  syncPreviewProfilePanel();
  renderFavoritesStrip();
  return groupRecord;
}

function channelHistoryKey(type, id) {
  return String(type || "") + ":" + String(id || "");
}

function setConversationHistory(type, id, messages) {
  conversationHistoryCache.set(
    channelHistoryKey(type, id),
    Array.isArray(messages) ? messages.slice() : [],
  );
  if (isSameChannel(type, id)) {
    renderConversationHistoryList(activeConversationHistory(), true);
    renderPinnedMessageStrip();
    renderPreviewPinnedPanel();
    renderPreviewSharedPanel();
  }
}

function upsertConversationHistory(type, id, message) {
  if (!message) return;
  const key = channelHistoryKey(type, id);
  const history = (conversationHistoryCache.get(key) || []).slice();
  const messageId = String((message && message.id) || "");
  const existingIndex = messageId
    ? history.findIndex((item) => String((item && item.id) || "") === messageId)
    : -1;
  if (existingIndex >= 0) {
    history.splice(existingIndex, 1, { ...history[existingIndex], ...message });
  } else {
    history.push(message);
  }
  conversationHistoryCache.set(key, history.slice(-120));
  mergePinnedMessage(type, id, message);
  if (isSameChannel(type, id)) {
    renderConversationHistoryList(activeConversationHistory(), existingIndex < 0);
    renderPinnedMessageStrip();
    renderPreviewPinnedPanel();
    renderPreviewSharedPanel();
  }
}

function activeConversationHistory() {
  if (activeChannel.type !== "direct" && activeChannel.type !== "group") {
    return [];
  }
  return conversationHistoryCache.get(channelHistoryKey(activeChannel.type, activeChannel.id)) || [];
}

function renderConversationHistoryList(messages, stickToBottom) {
  const history = Array.isArray(messages) ? messages : [];
  const previousScrollTop = el.messagesArea.scrollTop;
  const previousScrollHeight = el.messagesArea.scrollHeight;
  closeMessageActionMenu();
  setMessagesSurfaceMode("conversation");
  el.messagesArea.innerHTML = "";
  history.forEach((message) => {
    const sent = normalizeEmail(message.senderEmail) === normalizeEmail(currentUser && currentUser.email);
    addMessage(message, sent, message.senderName || message.senderEmail || "User", message.timestamp, false);
  });
  if (stickToBottom) {
    el.messagesArea.scrollTop = el.messagesArea.scrollHeight;
    return;
  }
  const delta = el.messagesArea.scrollHeight - previousScrollHeight;
  el.messagesArea.scrollTop = Math.max(0, previousScrollTop + delta);
}

function setPinnedMessages(type, id, messages) {
  pinnedMessagesCache.set(
    channelHistoryKey(type, id),
    Array.isArray(messages) ? sortPinnedMessages(messages) : [],
  );
  if (isSameChannel(type, id)) {
    renderPinnedMessageStrip();
    renderPreviewPinnedPanel();
  }
}

function mergePinnedMessage(type, id, message) {
  if (!message || !message.id) return;
  const key = channelHistoryKey(type, id);
  const next = (pinnedMessagesCache.get(key) || []).slice();
  const messageId = String(message.id);
  const existingIndex = next.findIndex((item) => String((item && item.id) || "") === messageId);
  if (message.pinned) {
    if (existingIndex >= 0) {
      next.splice(existingIndex, 1, { ...next[existingIndex], ...message });
    } else {
      next.push(message);
    }
  } else if (existingIndex >= 0) {
    next.splice(existingIndex, 1);
  }
  pinnedMessagesCache.set(key, sortPinnedMessages(next));
}

function activePinnedMessages() {
  if (activeChannel.type !== "direct" && activeChannel.type !== "group") {
    return [];
  }
  return pinnedMessagesCache.get(channelHistoryKey(activeChannel.type, activeChannel.id)) || [];
}

function sortPinnedMessages(messages) {
  return messages
    .slice()
    .filter((message) => Boolean(message && message.id && message.pinned))
    .sort((left, right) => {
      const leftTime = Date.parse(left.pinnedAt || left.timestamp || 0) || 0;
      const rightTime = Date.parse(right.pinnedAt || right.timestamp || 0) || 0;
      return rightTime - leftTime;
    });
}

function recalledMessageCopy() {
  return "Tin nhắn đã được thu hồi";
}

function messageSummaryText(message) {
  if (!message) return "";
  if (message.recalled) return recalledMessageCopy();
  const text = String(message.content || "").trim();
  if (text) return text;
  if (message.attachmentName) {
    const kind = String(message.attachmentContentType || "").startsWith("image/")
      ? "Ảnh"
      : "Tệp";
    return "[" + kind + "] " + message.attachmentName;
  }
  return "Tin nhắn";
}

function scrollToMessage(messageId) {
  const id = String(messageId || "");
  if (!id) return;
  const row = el.messagesArea.querySelector('.message-row[data-message-id="' + id + '"]');
  if (!row) return;
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  row.classList.add("message-row-flash");
  window.setTimeout(() => row.classList.remove("message-row-flash"), 1200);
}

function conversationHistoryContainsMessage(type, id, messageId) {
  const key = channelHistoryKey(type, id);
  return (conversationHistoryCache.get(key) || []).some(
    (message) => String((message && message.id) || "") === String(messageId || ""),
  );
}

function refreshConversationPreviewFromHistory(type, id) {
  const history = conversationHistoryCache.get(channelHistoryKey(type, id)) || [];
  const last = history[history.length - 1];
  if (!last) return;
  const sent = normalizeEmail(last.senderEmail) === normalizeEmail(currentUser && currentUser.email);
  const sender = sent ? "You" : last.senderName || last.senderEmail || "User";
  setPreview(type, id, messagePreview(last, sent, sender));
}

function applyRealtimeConversationUpdate(type, id, message, updateOnly) {
  if (!message) return;
  const existsInHistory = conversationHistoryContainsMessage(type, id, message.id);
  if (!updateOnly || existsInHistory) {
    upsertConversationHistory(type, id, message);
  } else {
    mergePinnedMessage(type, id, message);
    if (isSameChannel(type, id)) {
      renderPinnedMessageStrip();
      renderPreviewPinnedPanel();
      renderPreviewSharedPanel();
    }
  }
  refreshConversationPreviewFromHistory(type, id);
}

function applyMessageUpdate(type, id, message) {
  if (!message) return;
  upsertConversationHistory(type, id, message);
  refreshConversationPreviewFromHistory(type, id);
}

function normalizeSharedUrl(url) {
  return String(url || "").trim().replace(/[),.;!?]+$/, "");
}

function extractMessageLinks(message) {
  const text = String((message && message.content) || "");
  return Array.from(text.matchAll(URL_PATTERN), (match) => normalizeSharedUrl(match[0])).filter(Boolean);
}

function summarizeSharedContent(messages) {
  const images = [];
  const files = [];
  const links = [];
  const seenImages = new Set();
  const seenFiles = new Set();
  const seenLinks = new Set();

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    const href = attachmentDataUrl(message);
    const type = String((message && message.attachmentContentType) || "");
    const attachmentName = String((message && message.attachmentName) || "").trim();
    const timestamp = message && message.timestamp ? message.timestamp : "";
    const sender = message && (message.senderName || message.senderEmail || "User");

    if (href && attachmentName) {
      const baseItem = {
        href,
        name: attachmentName,
        sender,
        timestamp,
        meta:
          (message.attachmentContentType || "application/octet-stream") +
          (message.attachmentSize ? " - " + formatBytes(message.attachmentSize) : ""),
      };
      if (type.startsWith("image/")) {
        if (!seenImages.has(href)) {
          seenImages.add(href);
          images.push(baseItem);
        }
      } else if (!seenFiles.has(href)) {
        seenFiles.add(href);
        files.push(baseItem);
      }
    }

    extractMessageLinks(message).forEach((url) => {
      if (seenLinks.has(url)) return;
      seenLinks.add(url);
      let host = url;
      try {
        host = new URL(url).hostname.replace(/^www\./, "");
      } catch (_) {
        // Keep the raw url if parsing fails.
      }
      links.push({
        href: url,
        label: host,
        meta: url,
        sender,
        timestamp,
      });
    });
  }

  return { images, files, links };
}

function renderPreviewSharedSection(title, items, kind) {
  const section = document.createElement("section");
  section.className = "preview-shared-section";

  const head = document.createElement("div");
  head.className = "preview-group-panel-head preview-shared-section-head";
  head.innerHTML =
    "<span>" +
    title +
    '</span><strong>' +
    String(items.length) +
    "</strong>";
  section.appendChild(head);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "mini muted preview-shared-empty";
    empty.textContent = "Nothing shared yet.";
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement("div");
  list.className =
    kind === "images"
      ? "preview-shared-image-grid"
      : kind === "files"
        ? "preview-shared-file-list"
        : "preview-shared-link-list";

  items.slice(0, kind === "images" ? 6 : 5).forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (kind === "images") {
      link.className = "preview-shared-image-item";
      const image = document.createElement("img");
      image.loading = "lazy";
      image.src = item.href;
      image.alt = item.name || "Shared image";
      const caption = document.createElement("span");
      caption.textContent = item.name || "Image";
      link.append(image, caption);
    } else {
      link.className = kind === "files" ? "preview-shared-file-item" : "preview-shared-link-item";
      const primary = document.createElement("strong");
      primary.textContent = kind === "files" ? item.name : item.label;
      const meta = document.createElement("span");
      meta.textContent = kind === "files" ? item.meta : item.meta;
      link.append(primary, meta);
    }

    list.appendChild(link);
  });

  section.appendChild(list);
  return section;
}

function renderPinnedMessageStrip() {
  if (!el.pinnedMessageStrip) return;
  const inConversation = activeChannel.type === "direct" || activeChannel.type === "group";
  if (!inConversation) {
    el.pinnedMessageStrip.hidden = true;
    el.pinnedMessageStrip.innerHTML = "";
    return;
  }

  const pins = activePinnedMessages();
  if (!pins.length) {
    el.pinnedMessageStrip.hidden = true;
    el.pinnedMessageStrip.innerHTML = "";
    return;
  }

  const latest = pins[0];
  el.pinnedMessageStrip.hidden = false;
  el.pinnedMessageStrip.innerHTML = "";

  const head = document.createElement("div");
  head.className = "preview-pinned-strip-head";

  const label = document.createElement("strong");
  label.textContent = pins.length > 1 ? "Tin ghim • " + String(pins.length) : "Tin ghim";

  const meta = document.createElement("span");
  meta.textContent = latest.senderName || latest.senderEmail || "User";
  head.append(label, meta);

  const body = document.createElement("button");
  body.type = "button";
  body.className = "preview-pinned-strip-body";
  body.innerHTML =
    '<span class="preview-pinned-strip-copy"></span><span class="preview-pinned-strip-hint">Xem</span>';
  body.querySelector(".preview-pinned-strip-copy").textContent = messageSummaryText(latest);
  body.addEventListener("click", () => scrollToMessage(latest.id));

  el.pinnedMessageStrip.append(head, body);
}

function renderPreviewPinnedPanel() {
  if (!el.previewPinnedPanel) return;
  const inConversation = activeChannel.type === "direct" || activeChannel.type === "group";
  if (!inConversation) {
    el.previewPinnedPanel.hidden = true;
    el.previewPinnedPanel.innerHTML = "";
    return;
  }

  const pins = activePinnedMessages();
  if (!pins.length) {
    el.previewPinnedPanel.hidden = true;
    el.previewPinnedPanel.innerHTML = "";
    return;
  }

  el.previewPinnedPanel.hidden = false;
  el.previewPinnedPanel.innerHTML = "";

  const title = document.createElement("div");
  title.className = "preview-group-panel-head";
  title.innerHTML = "<span>Tin ghim</span><strong>" + String(pins.length) + "</strong>";
  el.previewPinnedPanel.appendChild(title);

  const list = document.createElement("div");
  list.className = "preview-pinned-list";

  pins.forEach((message) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "preview-pinned-item";

    const sender = document.createElement("strong");
    sender.textContent = message.senderName || message.senderEmail || "User";

    const copy = document.createElement("span");
    copy.textContent = messageSummaryText(message);

    const time = document.createElement("small");
    time.textContent = formatTime(message.pinnedAt || message.timestamp);

    item.append(sender, copy, time);
    item.addEventListener("click", () => scrollToMessage(message.id));
    list.appendChild(item);
  });

  el.previewPinnedPanel.appendChild(list);
}

function renderPreviewSharedPanel() {
  if (!el.previewSharedPanel) return;
  const inConversation =
    previewDetailsMode === "channel" &&
    (activeChannel.type === "direct" || activeChannel.type === "group");
  if (!inConversation) {
    el.previewSharedPanel.hidden = true;
    el.previewSharedPanel.innerHTML = "";
    return;
  }

  const shared = summarizeSharedContent(activeConversationHistory());
  el.previewSharedPanel.hidden = false;
  el.previewSharedPanel.innerHTML = "";

  const title = document.createElement("div");
  title.className = "preview-group-panel-head";
  title.innerHTML = "<span>Shared</span><strong>" + String(
    shared.images.length + shared.files.length + shared.links.length,
  ) + "</strong>";

  el.previewSharedPanel.appendChild(title);
  el.previewSharedPanel.appendChild(renderPreviewSharedSection("Images", shared.images, "images"));
  el.previewSharedPanel.appendChild(renderPreviewSharedSection("Files", shared.files, "files"));
  el.previewSharedPanel.appendChild(renderPreviewSharedSection("Links", shared.links, "links"));
}

function renderPreviewGroupMembers(group) {
  if (
    !el.previewGroupPanel ||
    !el.previewGroupMembersCount ||
    !el.previewGroupMembersList ||
    !el.previewGroupMembersEmpty
  ) {
    return;
  }

  if (!group || activeChannel.type !== "group") {
    el.previewGroupPanel.hidden = true;
    el.previewGroupMembersList.innerHTML = "";
    el.previewGroupMembersEmpty.hidden = false;
    el.previewGroupMembersEmpty.textContent = "Open a group to see its members.";
    el.previewGroupMembersCount.textContent = "0";
    return;
  }

  const members = Array.isArray(group.members) ? group.members : [];
  const creatorView = isGroupCreator(group);
  const currentEmail = normalizeEmail(currentUser && currentUser.email);
  const creatorEmail = normalizeEmail(group.createdByEmail);
  el.previewGroupPanel.hidden = false;
  el.previewGroupMembersCount.textContent = String(members.length);
  el.previewGroupMembersList.innerHTML = "";

  if (!members.length) {
    el.previewGroupMembersEmpty.hidden = false;
    el.previewGroupMembersEmpty.textContent = group.membersLoading
      ? "Loading members..."
      : "No member details yet.";
    return;
  }

  el.previewGroupMembersEmpty.hidden = true;
  members.forEach((member) => {
    const info = workspaceIdentityByEmail(member.email || "");
    const row = document.createElement("div");
    row.className = "preview-group-member";

    const avatar = document.createElement("div");
    avatar.className = "preview-group-member-avatar";
    syncAvatarNode(avatar, info.name, info.avatarUrl || "");

    const copy = document.createElement("div");
    copy.className = "preview-group-member-copy";

    const name = document.createElement("strong");
    name.textContent = info.name;

    const email = document.createElement("span");
    email.textContent = info.email || member.email || "";

    const role = document.createElement("span");
    role.className = "preview-group-member-role";
    role.textContent = String(member.role || "MEMBER").replace(/_/g, " ");

    const tools = document.createElement("div");
    tools.className = "preview-group-member-tools";
    tools.appendChild(role);

    const memberEmail = normalizeEmail(info.email || member.email || "");
    const canKick =
      creatorView &&
      memberEmail &&
      memberEmail !== currentEmail &&
      memberEmail !== creatorEmail;
    if (canKick) {
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "preview-group-member-remove";
      removeButton.textContent = "Kick";
      removeButton.addEventListener("click", () => {
        void removeGroupMember(group.id, info.email || member.email || "", info.name);
      });
      tools.appendChild(removeButton);
    }

    copy.appendChild(name);
    copy.appendChild(email);
    row.appendChild(avatar);
    row.appendChild(copy);
    row.appendChild(tools);
    el.previewGroupMembersList.appendChild(row);
  });
}

async function ensureGroupDetails(groupId) {
  const id = String(groupId || "");
  if (!id) return null;

  const cached = groupDetailsCache.get(id);
  if (cached && Array.isArray(cached.members)) {
    return mergeGroupDetails(cached);
  }

  const group = groups.find((item) => String(item.id) === id);
  if (group) {
    group.membersLoading = true;
    renderPreviewGroupMembers(group);
  }

  const result = await authorizedRequest("/api/groups/" + encodeURIComponent(id));
  if (group) {
    group.membersLoading = false;
  }
  if (!result.ok || !result.data) {
    syncPreviewProfilePanel();
    return null;
  }

  return applyGroupDetails(result.data);
}

function syncPreviewProfilePanel() {
  if (
    !el.previewDetailsTitle ||
    !el.previewProfileAvatar ||
    !el.previewProfileName ||
    !el.previewProfileEmail ||
    !el.previewProfilePhone ||
    !el.previewProfileStatus ||
    !el.previewMutualCount
  ) {
    return;
  }

  let name = displayName(currentUser);
  let avatarUrl = currentUser && currentUser.avatarUrl;
  let contact = currentUser && currentUser.email ? currentUser.email : "workspace@myclassroom.app";
  let detail = currentUser && currentUser.birthDate ? "Birthday: " + currentUser.birthDate : "Workspace owner";
  let status = "Your workspace";
  let meta = String(socialState.friends.length) + " active friends";
  let emailHref = currentUser && currentUser.email ? "mailto:" + currentUser.email : "#";
  let detailsTitle = "My profile";
  let groupRecord = null;

  if (previewDetailsMode === "channel" && activeChannel.type === "direct") {
    const friend = activeFriendRecord();
    if (friend) {
      name = displayName(friend);
      avatarUrl = friend.avatarUrl || "";
      contact = friend.email || "friend@myclassroom.app";
      detail = "Direct message";
      status = "Accepted friend";
      meta = groups.length ? String(groups.length) + " active groups in workspace" : "Ready to chat";
      emailHref = friend.email ? "mailto:" + friend.email : "#";
      detailsTitle = "Profile";
    }
  } else if (previewDetailsMode === "channel" && activeChannel.type === "group") {
    const group = activeGroupRecord();
    if (group) {
      groupRecord = group;
      name = group.name || "Study Group";
      avatarUrl = "";
      contact = group.category || "Study group";
      detail = group.description || "Shared space for classmates to chat, review, and coordinate.";
      status = "Group conversation";
      meta = Array.isArray(group.members)
        ? String(group.members.length) + " members"
        : "Open details to load members";
      emailHref = "#";
      detailsTitle = "Group info";
    }
  }

  el.previewDetailsTitle.textContent = detailsTitle;
  syncAvatarNode(el.previewProfileAvatar, name, avatarUrl || "");
  el.previewProfileName.textContent = name;
  el.previewProfileEmail.textContent = contact;
  if ("href" in el.previewProfileEmail) {
    el.previewProfileEmail.href = emailHref;
  }
  el.previewProfilePhone.textContent = detail;
  el.previewProfileStatus.textContent = status;
  el.previewMutualCount.textContent = meta;

  showPreviewAction(
    el.previewAddFriendBtn,
    previewDetailsMode === "channel" && activeChannel.type === "direct",
    "Pinned Contact",
    previewDetailsMode === "channel" && activeChannel.type === "direct",
  );
  showPreviewAction(
    el.previewGroupInfoBtn,
    previewDetailsMode === "channel" && activeChannel.type === "group",
    "Refresh Members",
    false,
  );
  syncPreviewGroupOwnerTools(groupRecord);
  syncPreviewGroupLeaveTools(groupRecord);
  renderPreviewGroupMembers(groupRecord);
  renderPreviewSharedPanel();
}

async function renameActiveGroup() {
  if (!el.previewGroupRenameBtn || !el.previewGroupRenameInput) return;
  const group = activeGroupRecord();
  if (!group || activeChannel.type !== "group") {
    setPreviewGroupManageFeedback("Open a group before renaming it.", "error");
    return;
  }
  if (!isGroupCreator(group)) {
    setPreviewGroupManageFeedback("Only the group creator can rename this group.", "error");
    return;
  }

  const nextName = String(el.previewGroupRenameInput.value || "").trim();
  if (!nextName) {
    setPreviewGroupManageFeedback("Group name is required.", "error");
    return;
  }

  const previousLabel = el.previewGroupRenameBtn.textContent;
  el.previewGroupRenameBtn.disabled = true;
  el.previewGroupRenameBtn.textContent = "Saving...";
  setPreviewGroupManageFeedback("", "success");

  const result = await authorizedRequest(
    "/api/groups/" + encodeURIComponent(group.id) + "/name",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupName: nextName }),
    },
  );

  el.previewGroupRenameBtn.disabled = false;
  el.previewGroupRenameBtn.textContent = previousLabel;

  if (!result.ok || !result.data) {
    setPreviewGroupManageFeedback(
      (result.data && result.data.error) || "Could not rename the group.",
      "error",
    );
    return;
  }

  applyGroupDetails(result.data);
  setPreviewGroupManageFeedback("Group name updated.", "success");
  showToast("Group name updated.");
}

async function removeGroupMember(groupId, memberEmail, memberName) {
  const normalizedEmail = normalizeEmail(memberEmail);
  if (!groupId || !normalizedEmail) return;
  const group = groups.find((item) => String(item.id) === String(groupId));
  if (!group || !isGroupCreator(group)) {
    showToast("Only the group creator can remove members.");
    return;
  }

  const name = memberName || defaultName(normalizedEmail);
  const confirmed = window.confirm(
    'Kick "' + name + '" out of this group?',
  );
  if (!confirmed) return;

  const result = await authorizedRequest(
    "/api/groups/" +
      encodeURIComponent(groupId) +
      "/members/" +
      encodeURIComponent(normalizedEmail),
    { method: "DELETE" },
  );

  if (!result.ok || !result.data) {
    const message =
      (result.data && result.data.error) || "Could not remove this member.";
    setPreviewGroupManageFeedback(message, "error");
    showToast(message);
    return;
  }

  applyGroupDetails(result.data);
  setPreviewGroupManageFeedback(name + " was removed from the group.", "success");
  showToast(name + " was removed from the group.");
}

async function leaveActiveGroup() {
  if (!el.previewGroupLeaveBtn) return;
  const group = activeGroupRecord();
  if (!group || activeChannel.type !== "group") {
    setPreviewGroupLeaveFeedback("Open a group before leaving it.", "error");
    return;
  }
  if (isGroupCreator(group)) {
    setPreviewGroupLeaveFeedback("The group creator cannot leave this group.", "error");
    return;
  }

  const confirmed = window.confirm(
    'Leave "' + (group.name || "this group") + '"?',
  );
  if (!confirmed) return;

  const previousLabel = el.previewGroupLeaveBtn.textContent;
  el.previewGroupLeaveBtn.disabled = true;
  el.previewGroupLeaveBtn.textContent = "Leaving...";
  setPreviewGroupLeaveFeedback("", "success");

  const result = await authorizedRequest(
    "/api/groups/" + encodeURIComponent(group.id) + "/leave",
    { method: "POST" },
  );

  el.previewGroupLeaveBtn.disabled = false;
  el.previewGroupLeaveBtn.textContent = previousLabel;

  if (!result.ok) {
    const message =
      (result.data && result.data.error) || "Could not leave this group.";
    setPreviewGroupLeaveFeedback(message, "error");
    showToast(message);
    return;
  }

  const groupId = String(group.id);
  groups = groups.filter((item) => String(item.id) !== groupId);
  groupDetailsCache.delete(groupId);
  conversationHistoryCache.delete(channelHistoryKey("group", groupId));
  setPreview("group", groupId, "");
  selectDefaultConversation();
  renderGroups();
  setPreviewGroupLeaveFeedback("", "success");
  showToast("You left the group.");
}

function normalizeStudyMinutes(value, fallback, maximum) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(maximum || 180, Math.max(1, Math.round(numeric)));
}

function normalizeStudyNotebookText(value) {
  return String(value || "").slice(0, 4000);
}

function normalizeStudyTodoText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function sanitizeStudyTodos(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => ({
      id: String((item && item.id) || "todo-" + index),
      text: normalizeStudyTodoText(item && item.text),
      done: Boolean(item && item.done),
    }))
    .filter((item) => item.text);
}

function buildStudyTodoId() {
  return "todo-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function loadStudyTimerState() {
  const defaults = {
    mode: "stopwatch",
    isRunning: false,
    startedAt: null,
    stopwatchElapsedMs: 0,
    stopwatchLaps: [],
    countdownMinutes: 25,
    countdownElapsedMs: 0,
    pomodoroFocusMinutes: 25,
    pomodoroBreakMinutes: 5,
    pomodoroPhase: "focus",
    pomodoroPhaseElapsedMs: 0,
    pomodoroCompletedCycles: 0,
    noteText: "",
    todos: [],
  };
  try {
    const parsed = parseJson(window.localStorage.getItem(STUDY_TIMER_STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") return defaults;
    return {
      mode: ["stopwatch", "countdown", "pomodoro"].includes(parsed.mode) ? parsed.mode : defaults.mode,
      isRunning: Boolean(parsed.isRunning && parsed.startedAt),
      startedAt: Number.isFinite(Number(parsed.startedAt)) ? Number(parsed.startedAt) : null,
      stopwatchElapsedMs: Math.max(0, Number(parsed.stopwatchElapsedMs) || 0),
      stopwatchLaps: Array.isArray(parsed.stopwatchLaps)
        ? parsed.stopwatchLaps
            .map((item) => ({
              elapsedMs: Math.max(0, Number(item && item.elapsedMs) || 0),
              splitMs: Math.max(0, Number(item && item.splitMs) || 0),
            }))
            .filter((item) => item.elapsedMs > 0)
        : [],
      countdownMinutes: normalizeStudyMinutes(parsed.countdownMinutes, defaults.countdownMinutes, 240),
      countdownElapsedMs: Math.max(0, Number(parsed.countdownElapsedMs) || 0),
      pomodoroFocusMinutes: normalizeStudyMinutes(parsed.pomodoroFocusMinutes, defaults.pomodoroFocusMinutes, 180),
      pomodoroBreakMinutes: normalizeStudyMinutes(parsed.pomodoroBreakMinutes, defaults.pomodoroBreakMinutes, 60),
      pomodoroPhase: parsed.pomodoroPhase === "break" ? "break" : "focus",
      pomodoroPhaseElapsedMs: Math.max(0, Number(parsed.pomodoroPhaseElapsedMs) || 0),
      pomodoroCompletedCycles: Math.max(0, Math.round(Number(parsed.pomodoroCompletedCycles) || 0)),
      noteText: normalizeStudyNotebookText(parsed.noteText),
      todos: sanitizeStudyTodos(parsed.todos),
    };
  } catch (_) {
    return defaults;
  }
}

const studyTimerState = loadStudyTimerState();

function persistStudyTimerState() {
  try {
    window.localStorage.setItem(STUDY_TIMER_STORAGE_KEY, JSON.stringify(studyTimerState));
  } catch (_) {
    // no-op
  }
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => {
    if (character === "&") return "&amp;";
    if (character === "<") return "&lt;";
    if (character === ">") return "&gt;";
    if (character === '"') return "&quot;";
    return "&#39;";
  });
}

function normalizePlannerSingleLine(value, limit = 120) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function normalizePlannerTextBlock(value, limit = 4000) {
  return String(value || "")
    .replace(/\r/g, "")
    .slice(0, limit);
}

function normalizePlannerDateTimeValue(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return Number.isFinite(Date.parse(trimmed)) ? trimmed.slice(0, 16) : "";
}

function normalizePlannerMinutesValue(value, fallback, maximum = 1440) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(maximum, Math.round(numeric)));
}

function normalizePlannerStatus(value) {
  return PLANNER_STATUS_OPTIONS.includes(value) ? value : "todo";
}

function normalizePlannerPriority(value) {
  return PLANNER_PRIORITY_OPTIONS.includes(value) ? value : "medium";
}

function normalizePlannerNoteColor(value) {
  return PLANNER_NOTE_COLOR_OPTIONS.includes(value) ? value : "amber";
}

function buildPlannerId(prefix) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function plannerDayKey(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function plannerDateTimeLabel(value) {
  const parsed = Date.parse(value || "");
  if (!Number.isFinite(parsed)) return localizeText("Chưa đặt", "Not set");
  return new Intl.DateTimeFormat(activeLocale(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(parsed));
}

function formatPlannerDurationMinutes(minutes) {
  const safe = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(safe / 60);
  const remainder = safe % 60;
  if (hours && remainder) return hours + "h " + remainder + "m";
  if (hours) return hours + "h";
  return remainder + "m";
}

function formatPlannerTrackedMs(ms) {
  return formatPlannerDurationMinutes(Math.round(Math.max(0, Number(ms) || 0) / 60000));
}

function createPlannerTask(seed = {}) {
  const createdAt = Number(seed.createdAt) || Date.now();
  return {
    id: String(seed.id || buildPlannerId("task")),
    title: normalizePlannerSingleLine(seed.title, 120),
    description: normalizePlannerTextBlock(seed.description, 600),
    deadline: normalizePlannerDateTimeValue(seed.deadline),
    scheduledAt: normalizePlannerDateTimeValue(seed.scheduledAt),
    priority: normalizePlannerPriority(seed.priority),
    status: normalizePlannerStatus(seed.status),
    tag: normalizePlannerSingleLine(seed.tag, 48),
    project: normalizePlannerSingleLine(seed.project, 64),
    estimateMinutes: normalizePlannerMinutesValue(seed.estimateMinutes, 30, 720),
    trackedMs: Math.max(0, Number(seed.trackedMs) || 0),
    createdAt,
    updatedAt: Number(seed.updatedAt) || createdAt,
  };
}

function createPlannerNote(seed = {}) {
  const createdAt = Number(seed.createdAt) || Date.now();
  return {
    id: String(seed.id || buildPlannerId("note")),
    title: normalizePlannerSingleLine(seed.title, 80) || localizeText("Ghi chú mới", "New note"),
    content: normalizePlannerTextBlock(seed.content, 5000),
    color: normalizePlannerNoteColor(seed.color),
    pinned: Boolean(seed.pinned),
    minimized: Boolean(seed.minimized),
    isOpen: Boolean(seed.isOpen),
    x: Number.isFinite(Number(seed.x)) ? Number(seed.x) : 0,
    y: Number.isFinite(Number(seed.y)) ? Number(seed.y) : 0,
    z: Math.max(1, Math.round(Number(seed.z) || 1)),
    createdAt,
    updatedAt: Number(seed.updatedAt) || createdAt,
  };
}

function sanitizePlannerTasks(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => createPlannerTask(item))
    .filter((item) => item.title);
}

function sanitizePlannerNotes(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => createPlannerNote(item))
    .filter((item) => item.title || item.content);
}

function buildLegacyPlannerSeed() {
  const tasks = sanitizeStudyTodos(studyTimerState.todos).map((item) =>
    createPlannerTask({
      title: item.text,
      status: item.done ? "done" : "todo",
      priority: item.done ? "low" : "medium",
      project: localizeText("Workspace", "Workspace"),
      tag: localizeText("Legacy", "Legacy"),
      estimateMinutes: 25,
      createdAt: Date.now(),
    }),
  );
  const notes = [];
  if (String(studyTimerState.noteText || "").trim()) {
    notes.push(
      createPlannerNote({
        title: localizeText("Ghi chú cũ", "Legacy note"),
        content: studyTimerState.noteText,
        color: "amber",
        isOpen: false,
        x: 96,
        y: 96,
        z: 1,
      }),
    );
  }
  return { tasks, notes };
}

function buildDefaultPlannerState() {
  const legacy = buildLegacyPlannerSeed();
  const zCounter = Math.max(
    6,
    ...legacy.notes.map((note) => Math.max(1, Number(note.z) || 1)),
  );
  return {
    viewMode: "board",
    searchText: "",
    priorityFilter: "all",
    statusFilter: "all",
    deadlineFilter: "all",
    projectFilter: "all",
    quickNote: "",
    selectedTaskId: legacy.tasks[0] ? legacy.tasks[0].id : "",
    activeTaskId: "",
    activeTaskStartedAt: null,
    noteZCounter: zCounter,
    tasks: legacy.tasks,
    notes: legacy.notes,
  };
}

function plannerStateSnapshot(source = buildDefaultPlannerState()) {
  const tasks = sanitizePlannerTasks(source.tasks);
  const notes = sanitizePlannerNotes(source.notes);
  const zCounter = Math.max(
    Number(source.noteZCounter) || 1,
    ...notes.map((note) => Math.max(1, Number(note.z) || 1)),
    1,
  );
  return {
    viewMode: source.viewMode === "list" ? "list" : "board",
    searchText: normalizePlannerSingleLine(source.searchText, 80),
    priorityFilter:
      source.priorityFilter === "all" || PLANNER_PRIORITY_OPTIONS.includes(source.priorityFilter)
        ? source.priorityFilter
        : "all",
    statusFilter:
      source.statusFilter === "all" || PLANNER_STATUS_OPTIONS.includes(source.statusFilter)
        ? source.statusFilter
        : "all",
    deadlineFilter: ["all", "today", "upcoming", "overdue"].includes(source.deadlineFilter)
      ? source.deadlineFilter
      : "all",
    projectFilter: source.projectFilter === "all"
      ? "all"
      : normalizePlannerSingleLine(source.projectFilter, 64),
    quickNote: normalizePlannerTextBlock(source.quickNote, 1200),
    selectedTaskId: String(source.selectedTaskId || ""),
    activeTaskId: String(source.activeTaskId || ""),
    activeTaskStartedAt: Number.isFinite(Number(source.activeTaskStartedAt))
      ? Number(source.activeTaskStartedAt)
      : null,
    noteZCounter: zCounter,
    tasks,
    notes,
  };
}

function sanitizePlannerStatePayload(value, defaults = buildDefaultPlannerState()) {
  if (!value || typeof value !== "object") return plannerStateSnapshot(defaults);
  const parsed = value;
  const tasks = sanitizePlannerTasks(parsed.tasks);
  const notes = sanitizePlannerNotes(parsed.notes);
  const zCounter = Math.max(
    Number(parsed.noteZCounter) || defaults.noteZCounter,
    ...notes.map((note) => Math.max(1, Number(note.z) || 1)),
    1,
  );
  return {
    viewMode: parsed.viewMode === "list" ? "list" : "board",
    searchText: normalizePlannerSingleLine(parsed.searchText, 80),
    priorityFilter:
      parsed.priorityFilter === "all" || PLANNER_PRIORITY_OPTIONS.includes(parsed.priorityFilter)
        ? parsed.priorityFilter
        : "all",
    statusFilter:
      parsed.statusFilter === "all" || PLANNER_STATUS_OPTIONS.includes(parsed.statusFilter)
        ? parsed.statusFilter
        : "all",
    deadlineFilter: ["all", "today", "upcoming", "overdue"].includes(parsed.deadlineFilter)
      ? parsed.deadlineFilter
      : "all",
    projectFilter: parsed.projectFilter === "all"
      ? "all"
      : normalizePlannerSingleLine(parsed.projectFilter, 64),
    quickNote: normalizePlannerTextBlock(parsed.quickNote, 1200),
    selectedTaskId: String(parsed.selectedTaskId || ""),
    activeTaskId: String(parsed.activeTaskId || ""),
    activeTaskStartedAt: Number.isFinite(Number(parsed.activeTaskStartedAt))
      ? Number(parsed.activeTaskStartedAt)
      : null,
    noteZCounter: zCounter,
    tasks: tasks.length ? tasks : defaults.tasks,
    notes: notes.length ? notes : defaults.notes,
  };
}

function readPlannerLocalSnapshot() {
  try {
    return parseJson(window.localStorage.getItem(PLANNER_STORAGE_KEY));
  } catch (_) {
    return null;
  }
}

function writePlannerLocalSnapshot(snapshot) {
  try {
    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (_) {
    // no-op
  }
}

function getPlannerPersistenceConfig() {
  const raw = window.__WORKSPACE_PLANNER_PERSISTENCE__;
  const config = raw && typeof raw === "object" ? raw : {};
  const endpoint = normalizePlannerSingleLine(config.endpoint, 240) || DEFAULT_PLANNER_REMOTE_ENDPOINT;
  const debounceMs = Number(config.debounceMs);
  return {
    endpoint,
    hydrateFromRemote: Boolean(config.hydrateFromRemote),
    saveToRemote: Boolean(config.saveToRemote),
    debounceMs:
      Number.isFinite(debounceMs) && debounceMs >= 0
        ? debounceMs
        : PLANNER_REMOTE_SAVE_DEBOUNCE_MS,
  };
}

function extractPlannerPersistencePayload(data) {
  const looksLikePlannerState = (value) => Boolean(
    value &&
    typeof value === "object" &&
    ("tasks" in value || "notes" in value || "selectedTaskId" in value || "viewMode" in value),
  );
  if (looksLikePlannerState(data)) return data;
  if (!data || typeof data !== "object") return null;
  if (looksLikePlannerState(data.planner)) return data.planner;
  if (looksLikePlannerState(data.state)) return data.state;
  if (looksLikePlannerState(data.snapshot)) return data.snapshot;
  return null;
}

function loadPlannerState() {
  return sanitizePlannerStatePayload(readPlannerLocalSnapshot(), buildDefaultPlannerState());
}

const plannerState = loadPlannerState();

function persistPlannerState() {
  const snapshot = plannerStateSnapshot(plannerState);
  writePlannerLocalSnapshot(snapshot);
  schedulePlannerRemoteSave(snapshot);
}

function applyPlannerState(nextState) {
  Object.assign(plannerState, plannerStateSnapshot(nextState));
}

function schedulePlannerRemoteSave(snapshot = plannerStateSnapshot(plannerState)) {
  const config = getPlannerPersistenceConfig();
  if (!config.saveToRemote || !config.endpoint) return;
  plannerPendingRemoteSnapshot = snapshot;
  if (plannerRemoteSaveTimer) {
    window.clearTimeout(plannerRemoteSaveTimer);
  }
  plannerRemoteSaveTimer = window.setTimeout(() => {
    plannerRemoteSaveTimer = null;
    void flushPlannerRemoteSave();
  }, config.debounceMs);
}

async function flushPlannerRemoteSave() {
  const config = getPlannerPersistenceConfig();
  if (!config.saveToRemote || !config.endpoint || plannerRemoteSaveInFlight || !plannerPendingRemoteSnapshot) {
    return false;
  }
  const snapshot = plannerPendingRemoteSnapshot;
  plannerPendingRemoteSnapshot = null;
  plannerRemoteSaveInFlight = authorizedRequest(config.endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planner: snapshot }),
  });
  const result = await plannerRemoteSaveInFlight;
  plannerRemoteSaveInFlight = null;
  if (!result.ok) {
    console.warn("Could not sync planner state to remote persistence.", result.data);
  }
  if (plannerPendingRemoteSnapshot) {
    void flushPlannerRemoteSave();
  }
  return result.ok;
}

async function hydratePlannerStateFromPersistence() {
  const config = getPlannerPersistenceConfig();
  if (!config.hydrateFromRemote || !config.endpoint) return false;
  const result = await authorizedRequest(config.endpoint);
  if (!result.ok) {
    console.warn("Could not load planner state from remote persistence.", result.data);
    return false;
  }
  const payload = extractPlannerPersistencePayload(result.data);
  if (!payload) return false;
  applyPlannerState(sanitizePlannerStatePayload(payload, buildDefaultPlannerState()));
  writePlannerLocalSnapshot(plannerStateSnapshot(plannerState));
  refreshPlannerStudioUi();
  renderPlannerFloatingNotes();
  refreshPlannerLiveUi();
  refreshHomeOverviewIfNeeded();
  return true;
}

window.workspacePlannerPersistence = {
  getConfig: () => ({ ...getPlannerPersistenceConfig() }),
  getSnapshot: () => plannerStateSnapshot(plannerState),
  hydrate: () => hydratePlannerStateFromPersistence(),
  flush: () => flushPlannerRemoteSave(),
};

function sanitizeDashboardStudyByDay(value) {
  const safe = {};
  if (!value || typeof value !== "object") return safe;
  Object.entries(value).forEach(([key, amount]) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(Number(amount)) && Number(amount) > 0) {
      safe[key] = Math.max(0, Number(amount));
    }
  });
  return safe;
}

function loadDashboardProgressState() {
  try {
    const parsed = parseJson(window.localStorage.getItem(DASHBOARD_PROGRESS_STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") {
      return { studyByDay: {}, lastSampleAt: Date.now() };
    }
    return {
      studyByDay: sanitizeDashboardStudyByDay(parsed.studyByDay),
      lastSampleAt: Number.isFinite(Number(parsed.lastSampleAt))
        ? Number(parsed.lastSampleAt)
        : Date.now(),
    };
  } catch (_) {
    return { studyByDay: {}, lastSampleAt: Date.now() };
  }
}

const dashboardProgressState = loadDashboardProgressState();

function persistDashboardProgressState() {
  try {
    window.localStorage.setItem(DASHBOARD_PROGRESS_STORAGE_KEY, JSON.stringify(dashboardProgressState));
  } catch (_) {
    // no-op
  }
}

function pruneDashboardStudyByDay(limit = 84) {
  const keys = Object.keys(dashboardProgressState.studyByDay).sort();
  if (keys.length <= limit) return;
  keys.slice(0, keys.length - limit).forEach((key) => delete dashboardProgressState.studyByDay[key]);
}

function syncDashboardStudyProgress(now = Date.now()) {
  const previous = Number(dashboardProgressState.lastSampleAt) || now;
  dashboardProgressState.lastSampleAt = now;
  const isActive = Boolean(studyTimerState.isRunning || plannerState.activeTaskId);
  if (!isActive) {
    persistDashboardProgressState();
    return;
  }
  const delta = Math.max(0, Math.min(5000, now - previous));
  if (!delta) return;
  const dayKey = plannerDayKey(now);
  dashboardProgressState.studyByDay[dayKey] =
    Math.max(0, Number(dashboardProgressState.studyByDay[dayKey]) || 0) + delta;
  pruneDashboardStudyByDay();
  persistDashboardProgressState();
}

function dashboardStudyMsForDay(dayKey = plannerDayKey()) {
  return Math.max(0, Number(dashboardProgressState.studyByDay[dayKey]) || 0);
}

function dashboardStudyMsForRecentDays(days = 7) {
  let total = 0;
  for (let index = 0; index < days; index += 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    total += dashboardStudyMsForDay(plannerDayKey(date));
  }
  return total;
}

function dashboardStudyStreak() {
  let streak = 0;
  for (let index = 0; index < 84; index += 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    if (dashboardStudyMsForDay(plannerDayKey(date)) > 0) {
      streak += 1;
      continue;
    }
    break;
  }
  return streak;
}

function dashboardStudyHeatmapCells(days = 21) {
  const cells = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    const key = plannerDayKey(date);
    const studyMs = dashboardStudyMsForDay(key);
    let level = 0;
    if (studyMs >= 3600000) {
      level = 4;
    } else if (studyMs >= 1800000) {
      level = 3;
    } else if (studyMs >= 900000) {
      level = 2;
    } else if (studyMs > 0) {
      level = 1;
    }
    cells.push({
      key,
      label: new Intl.DateTimeFormat(activeLocale(), { month: "short", day: "numeric" }).format(date),
      studyMs,
      level,
    });
  }
  return cells;
}

function getPlannerStudioPanel() {
  return document.querySelector("[data-planner-studio]");
}

function getPlannerTaskById(id) {
  const taskId = String(id || "");
  return plannerState.tasks.find((item) => item.id === taskId) || null;
}

function getPlannerNoteById(id) {
  const noteId = String(id || "");
  return plannerState.notes.find((item) => item.id === noteId) || null;
}

function getPlannerTaskTrackedMs(task, now = Date.now()) {
  if (!task) return 0;
  const base = Math.max(0, Number(task.trackedMs) || 0);
  if (
    plannerState.activeTaskId &&
    plannerState.activeTaskId === task.id &&
    Number.isFinite(Number(plannerState.activeTaskStartedAt))
  ) {
    return base + Math.max(0, now - Number(plannerState.activeTaskStartedAt));
  }
  return base;
}

function getPlannerTaskProgressRatio(task, now = Date.now()) {
  if (!task) return 0;
  if (task.status === "done") return 1;
  const estimateMs = Math.max(1, (Number(task.estimateMinutes) || 0) * MINUTE_MS);
  return Math.max(0, Math.min(1, getPlannerTaskTrackedMs(task, now) / estimateMs));
}

function plannerDeadlineState(task, now = Date.now()) {
  const parsed = Date.parse(task && task.deadline);
  if (!Number.isFinite(parsed)) {
    return {
      kind: "none",
      copy: localizeText("Không có deadline", "No deadline"),
      msLeft: null,
    };
  }
  const diff = parsed - now;
  if (diff < 0) {
    return {
      kind: "overdue",
      copy: localizeText("Trễ " + formatAgo(parsed), "Overdue"),
      msLeft: diff,
    };
  }
  const hoursLeft = diff / 3600000;
  return {
    kind: hoursLeft <= 18 ? "soon" : "upcoming",
    copy: localizeText("Còn " + formatAgo(now + diff), "Due " + formatAgo(now + diff)),
    msLeft: diff,
  };
}

function plannerTaskMatchesFilters(task) {
  if (!task) return false;
  const query = plannerState.searchText.trim().toLowerCase();
  if (query) {
    const haystack = [
      task.title,
      task.description,
      task.tag,
      task.project,
      task.priority,
      task.status,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (plannerState.priorityFilter !== "all" && task.priority !== plannerState.priorityFilter) return false;
  if (plannerState.statusFilter !== "all" && task.status !== plannerState.statusFilter) return false;
  if (plannerState.projectFilter !== "all" && task.project !== plannerState.projectFilter) return false;
  if (plannerState.deadlineFilter !== "all") {
    const state = plannerDeadlineState(task);
    if (plannerState.deadlineFilter === "overdue" && state.kind !== "overdue") return false;
    if (plannerState.deadlineFilter === "upcoming" && !["soon", "upcoming"].includes(state.kind)) return false;
    if (plannerState.deadlineFilter === "today") {
      const deadlineKey = plannerDayKey(task.deadline);
      const scheduledKey = plannerDayKey(task.scheduledAt);
      const todayKey = plannerDayKey();
      if (deadlineKey !== todayKey && scheduledKey !== todayKey) return false;
    }
  }
  return true;
}

function plannerVisibleTasks() {
  return plannerState.tasks
    .filter((task) => plannerTaskMatchesFilters(task))
    .sort((left, right) => {
      const leftDeadline = Date.parse(left.deadline || "") || Number.MAX_SAFE_INTEGER;
      const rightDeadline = Date.parse(right.deadline || "") || Number.MAX_SAFE_INTEGER;
      if (left.status !== right.status) {
        return PLANNER_STATUS_OPTIONS.indexOf(left.status) - PLANNER_STATUS_OPTIONS.indexOf(right.status);
      }
      if (leftDeadline !== rightDeadline) return leftDeadline - rightDeadline;
      return Number(right.updatedAt || 0) - Number(left.updatedAt || 0);
    });
}

function plannerProjectOptions() {
  return plannerState.tasks
    .map((task) => task.project)
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index)
    .sort((left, right) => left.localeCompare(right));
}

function plannerTodayTasks() {
  const todayKey = plannerDayKey();
  const matches = plannerVisibleTasks().filter((task) => {
    if (task.status === "done") return false;
    return plannerDayKey(task.scheduledAt) === todayKey || plannerDayKey(task.deadline) === todayKey;
  });
  return matches.length ? matches : plannerVisibleTasks().filter((task) => task.status !== "done").slice(0, 4);
}

function plannerUpcomingTasks(limit = 4) {
  const now = Date.now();
  return plannerVisibleTasks()
    .filter((task) => task.status !== "done" && plannerDeadlineState(task, now).kind !== "none")
    .sort((left, right) => (Date.parse(left.deadline || "") || 0) - (Date.parse(right.deadline || "") || 0))
    .slice(0, limit);
}

function plannerTimelineTasks() {
  const todayKey = plannerDayKey();
  return plannerVisibleTasks()
    .filter((task) => {
      if (task.status === "done") return false;
      return plannerDayKey(task.scheduledAt) === todayKey || plannerDayKey(task.deadline) === todayKey;
    })
    .sort((left, right) => {
      const leftTime = Date.parse(left.scheduledAt || left.deadline || "") || Number.MAX_SAFE_INTEGER;
      const rightTime = Date.parse(right.scheduledAt || right.deadline || "") || Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    })
    .slice(0, 6);
}

function plannerOverviewSnapshot(now = Date.now()) {
  const total = plannerState.tasks.length;
  const done = plannerState.tasks.filter((task) => task.status === "done").length;
  const active = plannerState.tasks.filter((task) => task.status === "progress").length;
  const dueSoon = plannerState.tasks.filter((task) => plannerDeadlineState(task, now).kind === "soon").length;
  return {
    total,
    done,
    active,
    dueSoon,
    completionRatio: total ? done / total : 0,
  };
}

function ensurePlannerFloatingLayer() {
  if (plannerFloatingLayer && document.body.contains(plannerFloatingLayer)) return plannerFloatingLayer;
  plannerFloatingLayer = document.createElement("div");
  plannerFloatingLayer.className = "planner-floating-layer";
  document.body.appendChild(plannerFloatingLayer);
  return plannerFloatingLayer;
}

function nextPlannerNotePosition() {
  const openCount = plannerState.notes.filter((note) => note.isOpen).length;
  const baseX = window.innerWidth <= 900 ? 16 : 96;
  const baseY = window.innerWidth <= 900 ? 88 : 104;
  const step = window.innerWidth <= 900 ? 18 : 28;
  return {
    x: Math.max(16, Math.min(window.innerWidth - 336, baseX + openCount * step)),
    y: Math.max(72, Math.min(window.innerHeight - 220, baseY + openCount * step)),
  };
}

function bringPlannerNoteToFront(noteId, persist = true) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  plannerState.noteZCounter = Math.max(1, Number(plannerState.noteZCounter) || 1) + 1;
  note.z = plannerState.noteZCounter;
  note.updatedAt = Date.now();
  if (persist) persistPlannerState();
}

function stopPlannerTaskTimer(now = Date.now()) {
  if (!plannerState.activeTaskId || !plannerState.activeTaskStartedAt) {
    plannerState.activeTaskId = "";
    plannerState.activeTaskStartedAt = null;
    return;
  }
  const task = getPlannerTaskById(plannerState.activeTaskId);
  if (task) {
    task.trackedMs = getPlannerTaskTrackedMs(task, now);
    task.updatedAt = now;
  }
  plannerState.activeTaskId = "";
  plannerState.activeTaskStartedAt = null;
}

function togglePlannerTaskTimer(taskId) {
  const target = getPlannerTaskById(taskId);
  if (!target) return;
  const now = Date.now();
  if (plannerState.activeTaskId === target.id) {
    stopPlannerTaskTimer(now);
  } else {
    stopPlannerTaskTimer(now);
    plannerState.activeTaskId = target.id;
    plannerState.activeTaskStartedAt = now;
    target.status = target.status === "done" ? "progress" : target.status;
    target.updatedAt = now;
  }
  persistPlannerState();
  refreshHomeOverviewIfNeeded();
}

function resetPlannerFilters() {
  plannerState.searchText = "";
  plannerState.priorityFilter = "all";
  plannerState.statusFilter = "all";
  plannerState.deadlineFilter = "all";
  plannerState.projectFilter = "all";
  persistPlannerState();
}

function getStudyTimerPanel() {
  return document.querySelector("[data-study-timer]");
}

function getStudyNotesPanel() {
  return document.querySelector("[data-study-notebook-panel]");
}

function studyTodoSummary() {
  const total = studyTimerState.todos.length;
  const completed = studyTimerState.todos.filter((item) => item.done).length;
  const open = total - completed;
  if (!total) {
    return localizeText("Chưa có mục nào", "No items yet");
  }
  return localizeText(
    open + " việc mở • " + completed + " xong",
    open + " open • " + completed + " done",
  );
}

function refreshStudyNotebookUi(panel = getStudyNotesPanel()) {
  if (!panel) return;

  const noteInput = panel.querySelector("[data-study-note-input]");
  if (noteInput && document.activeElement !== noteInput) {
    noteInput.value = studyTimerState.noteText;
  }

  const summary = panel.querySelector("[data-study-todo-summary]");
  if (summary) {
    summary.textContent = studyTodoSummary();
  }

  const clearButton = panel.querySelector("[data-study-todo-clear]");
  if (clearButton) {
    clearButton.hidden = !studyTimerState.todos.some((item) => item.done);
  }

  const list = panel.querySelector("[data-study-todo-list]");
  if (!list) return;
  list.innerHTML = "";

  if (!studyTimerState.todos.length) {
    const empty = document.createElement("div");
    empty.className = "study-timer-todo-empty";
    empty.textContent = localizeText(
      "Chưa có việc nào. Thêm một dòng nhỏ để bám nhịp học như trong Notion.",
      "No tasks yet. Add a small line item to keep the session moving like Notion.",
    );
    list.appendChild(empty);
    return;
  }

  studyTimerState.todos.forEach((item) => {
    const row = document.createElement("div");
    row.className = "study-timer-todo-item" + (item.done ? " is-done" : "");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "study-timer-todo-toggle";
    toggle.dataset.studyTodoToggle = item.id;
    toggle.setAttribute("aria-pressed", String(item.done));
    toggle.setAttribute(
      "aria-label",
      item.done
        ? localizeText("Đánh dấu chưa xong", "Mark as not done")
        : localizeText("Đánh dấu hoàn thành", "Mark as done"),
    );
    toggle.innerHTML = '<span class="study-timer-todo-check" aria-hidden="true"></span>';

    const copy = document.createElement("div");
    copy.className = "study-timer-todo-copy";
    copy.textContent = item.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "study-timer-todo-remove";
    remove.dataset.studyTodoRemove = item.id;
    remove.setAttribute(
      "aria-label",
      localizeText("Xóa việc này", "Remove this task"),
    );
    remove.textContent = "×";

    row.append(toggle, copy, remove);
    list.appendChild(row);
  });
}

function updateStudyNotebookText(value) {
  studyTimerState.noteText = normalizeStudyNotebookText(value);
  persistStudyTimerState();
}

function addStudyTodo() {
  const panel = getStudyNotesPanel();
  if (!panel) return;
  const input = panel.querySelector("[data-study-todo-input]");
  if (!input) return;

  const text = normalizeStudyTodoText(input.value);
  if (!text) return;

  studyTimerState.todos.unshift({
    id: buildStudyTodoId(),
    text,
    done: false,
  });
  persistStudyTimerState();
  input.value = "";
  refreshStudyNotebookUi(panel);
  input.focus();
}

function toggleStudyTodo(id) {
  const targetId = String(id || "");
  const todo = studyTimerState.todos.find((item) => item.id === targetId);
  if (!todo) return;
  todo.done = !todo.done;
  persistStudyTimerState();
  refreshStudyNotebookUi();
}

function removeStudyTodo(id) {
  const targetId = String(id || "");
  const next = studyTimerState.todos.filter((item) => item.id !== targetId);
  if (next.length === studyTimerState.todos.length) return;
  studyTimerState.todos = next;
  persistStudyTimerState();
  refreshStudyNotebookUi();
}

function clearCompletedStudyTodos() {
  if (!studyTimerState.todos.some((item) => item.done)) return;
  studyTimerState.todos = studyTimerState.todos.filter((item) => !item.done);
  persistStudyTimerState();
  refreshStudyNotebookUi();
}

function getPomodoroDurationMs(phase) {
  return (phase === "break" ? studyTimerState.pomodoroBreakMinutes : studyTimerState.pomodoroFocusMinutes) * MINUTE_MS;
}

function getStudyTimerDisplayMs(snapshot) {
  if (snapshot.mode === "stopwatch") return snapshot.elapsedMs;
  return snapshot.remainingMs;
}

function formatStudyTimerClock(ms) {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function getStudyTimerClockParts(ms) {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function getStudyTimerDisplayProgress(snapshot) {
  if (snapshot.mode === "countdown" || snapshot.mode === "pomodoro") {
    return Math.max(0, Math.min(1, snapshot.progress || 0));
  }
  return ((snapshot.elapsedMs || 0) % MINUTE_MS) / MINUTE_MS;
}

function deriveStudyTimerSnapshot(now) {
  const currentTime = now || Date.now();
  const runningDelta =
    studyTimerState.isRunning && studyTimerState.startedAt ? Math.max(0, currentTime - studyTimerState.startedAt) : 0;

  if (studyTimerState.mode === "countdown") {
    const durationMs = studyTimerState.countdownMinutes * MINUTE_MS;
    const elapsedMs = Math.min(durationMs, studyTimerState.countdownElapsedMs + runningDelta);
    return {
      mode: "countdown",
      isRunning: studyTimerState.isRunning,
      durationMs,
      elapsedMs,
      remainingMs: Math.max(0, durationMs - elapsedMs),
      progress: durationMs ? elapsedMs / durationMs : 0,
    };
  }

  if (studyTimerState.mode === "pomodoro") {
    const phase = studyTimerState.pomodoroPhase === "break" ? "break" : "focus";
    const durationMs = getPomodoroDurationMs(phase);
    const elapsedMs = Math.min(durationMs, studyTimerState.pomodoroPhaseElapsedMs + runningDelta);
    return {
      mode: "pomodoro",
      phase,
      isRunning: studyTimerState.isRunning,
      durationMs,
      elapsedMs,
      remainingMs: Math.max(0, durationMs - elapsedMs),
      completedCycles: studyTimerState.pomodoroCompletedCycles,
      progress: durationMs ? elapsedMs / durationMs : 0,
    };
  }

  return {
    mode: "stopwatch",
    isRunning: studyTimerState.isRunning,
    elapsedMs: studyTimerState.stopwatchElapsedMs + runningDelta,
    remainingMs: 0,
    progress: 0,
  };
}

function refreshStudyTimerConfig(panel) {
  if (!panel) return;
  const config = panel.querySelector("[data-study-config]");
  if (!config) return;
  if (config.dataset.mode === studyTimerState.mode) {
    const countdownInput = config.querySelector("[data-study-field='countdownMinutes']");
    if (countdownInput) countdownInput.value = String(studyTimerState.countdownMinutes);
    const pomodoroFocusInput = config.querySelector("[data-study-field='pomodoroFocusMinutes']");
    if (pomodoroFocusInput) pomodoroFocusInput.value = String(studyTimerState.pomodoroFocusMinutes);
    const pomodoroBreakInput = config.querySelector("[data-study-field='pomodoroBreakMinutes']");
    if (pomodoroBreakInput) pomodoroBreakInput.value = String(studyTimerState.pomodoroBreakMinutes);
    return;
  }

  config.dataset.mode = studyTimerState.mode;
  config.innerHTML = "";

  if (studyTimerState.mode === "stopwatch") {
    const note = document.createElement("div");
    note.className = "study-timer-note";
    note.textContent = localizeText(
      "Bật lên để theo dõi tổng thời gian bạn tập trung học trong phiên này.",
      "Start it to track how long you stay focused in this study session.",
    );
    config.appendChild(note);
    return;
  }

  const fields = document.createElement("div");
  fields.className = "study-timer-field-grid";

  if (studyTimerState.mode === "countdown") {
    fields.innerHTML =
      '<label class="settings-field">' +
      '<span class="settings-field-label">' +
      localizeText("Thời lượng (phút)", "Duration (minutes)") +
      "</span>" +
      '<input class="settings-text-input study-timer-input" type="number" min="1" max="240" step="1" data-study-field="countdownMinutes" />' +
      "</label>";
  } else {
    fields.innerHTML =
      '<label class="settings-field">' +
      '<span class="settings-field-label">' +
      localizeText("Phiên học (phút)", "Focus (minutes)") +
      "</span>" +
      '<input class="settings-text-input study-timer-input" type="number" min="1" max="180" step="1" data-study-field="pomodoroFocusMinutes" />' +
      "</label>" +
      '<label class="settings-field">' +
      '<span class="settings-field-label">' +
      localizeText("Nghỉ ngắn (phút)", "Break (minutes)") +
      "</span>" +
      '<input class="settings-text-input study-timer-input" type="number" min="1" max="60" step="1" data-study-field="pomodoroBreakMinutes" />' +
      "</label>";
  }

  config.appendChild(fields);
  refreshStudyTimerConfig(panel);
}

function refreshStudyTimerUi(now) {
  const panel = getStudyTimerPanel();
  if (!panel) return;
  const snapshot = deriveStudyTimerSnapshot(now);
  refreshStudyTimerConfig(panel);

  panel.querySelectorAll("[data-study-mode]").forEach((button) => {
    const active = button.dataset.studyMode === studyTimerState.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const display = panel.querySelector("[data-study-display]");
  if (display) {
    const displayMs = getStudyTimerDisplayMs(snapshot);
    const parts = getStudyTimerClockParts(displayMs);
    display.setAttribute("aria-label", formatStudyTimerClock(displayMs));

    const hours = panel.querySelector("[data-study-hours]");
    const minutes = panel.querySelector("[data-study-minutes]");
    const seconds = panel.querySelector("[data-study-seconds]");
    if (hours) hours.textContent = parts.hours;
    if (minutes) minutes.textContent = parts.minutes;
    if (seconds) seconds.textContent = parts.seconds;

    const displayLabel = panel.querySelector("[data-study-display-label]");
    if (displayLabel) {
      displayLabel.textContent =
        snapshot.mode === "stopwatch"
          ? localizeText("Buổi học hiện tại", "Current study session")
          : snapshot.mode === "countdown"
            ? localizeText("Mục tiêu đếm ngược", "Countdown target")
            : localizeText("Nhịp Pomodoro", "Pomodoro cycle");
    }

    const displayPhase = panel.querySelector("[data-study-display-phase]");
    if (displayPhase) {
      displayPhase.textContent =
        snapshot.mode === "stopwatch"
          ? localizeText("Đang đếm", "Live")
          : snapshot.mode === "countdown"
            ? localizeText("Còn lại", "Remaining")
            : snapshot.phase === "break"
              ? localizeText("Pha nghỉ", "Break phase")
              : localizeText("Pha tập trung", "Focus phase");
    }

    const progressBar = panel.querySelector("[data-study-progress-bar]");
    if (progressBar) progressBar.style.width = Math.round(getStudyTimerDisplayProgress(snapshot) * 100) + "%";
  }

  const helper = panel.querySelector("[data-study-helper]");
  if (helper) {
    if (snapshot.mode === "stopwatch") {
      helper.textContent = localizeText(
        "Đếm thời gian kể từ lúc bạn bắt đầu phiên học.",
        "Keeps counting from the moment you begin studying.",
      );
    } else if (snapshot.mode === "countdown") {
      helper.textContent = localizeText(
        "Đếm ngược cho một mục tiêu học cố định.",
        "Counts down toward a fixed study target.",
      );
    } else {
      helper.textContent =
        snapshot.phase === "break"
          ? localizeText("Đang ở nhịp nghỉ ngắn để lấy lại tập trung.", "You are currently in a short recovery break.")
          : localizeText("Đang ở nhịp tập trung sâu của Pomodoro.", "You are currently in the Pomodoro focus block.");
    }
  }

  const badge = panel.querySelector("[data-study-badge]");
  if (badge) {
    badge.textContent =
      snapshot.mode === "stopwatch"
        ? localizeText("Bấm giờ", "Stopwatch")
        : snapshot.mode === "countdown"
          ? localizeText("Đếm ngược", "Countdown")
          : snapshot.phase === "break"
            ? localizeText("Nghỉ", "Break")
            : localizeText("Tập trung", "Focus");
    badge.dataset.variant =
      snapshot.mode === "pomodoro" && snapshot.phase === "break"
        ? "break"
        : snapshot.mode === "countdown"
          ? "countdown"
          : "focus";
  }

  const toggleButton = panel.querySelector("[data-study-action='toggle']");
  if (toggleButton) {
    toggleButton.textContent = snapshot.isRunning
      ? localizeText("Tạm dừng", "Pause")
      : localizeText("Bắt đầu", "Start");
  }

  const meta = panel.querySelector("[data-study-meta]");
  if (meta) {
    if (snapshot.mode === "stopwatch") {
      meta.textContent = localizeText("Theo dõi thời gian học tự do.", "Track free-form study time.");
    } else if (snapshot.mode === "countdown") {
      meta.textContent = localizeText(
        "Mục tiêu " + studyTimerState.countdownMinutes + " phút.",
        studyTimerState.countdownMinutes + " minute target.",
      );
    } else {
      meta.textContent = localizeText(
        studyTimerState.pomodoroFocusMinutes +
          "/" +
          studyTimerState.pomodoroBreakMinutes +
          " phút mỗi vòng.",
        studyTimerState.pomodoroFocusMinutes +
          "/" +
          studyTimerState.pomodoroBreakMinutes +
          " minutes per cycle.",
      );
    }
  }

  const primaryStat = panel.querySelector("[data-study-stat-primary]");
  if (primaryStat) {
    primaryStat.textContent =
      snapshot.mode === "stopwatch"
        ? localizeText("Đã học", "Studied")
        : snapshot.mode === "countdown"
          ? localizeText("Còn lại", "Remaining")
          : localizeText("Đang học", "In focus");
  }

  const primaryValue = panel.querySelector("[data-study-value-primary]");
  if (primaryValue) primaryValue.textContent = formatStudyTimerClock(getStudyTimerDisplayMs(snapshot));

  const secondaryStat = panel.querySelector("[data-study-stat-secondary]");
  if (secondaryStat) {
    secondaryStat.textContent =
      snapshot.mode === "stopwatch"
        ? localizeText("Số vòng", "Laps")
        : snapshot.mode === "pomodoro"
          ? localizeText("Hoàn thành", "Completed")
          : localizeText("Tiến độ", "Progress");
  }

  const secondaryValue = panel.querySelector("[data-study-value-secondary]");
  if (secondaryValue) {
    secondaryValue.textContent =
      snapshot.mode === "stopwatch"
        ? String(studyTimerState.stopwatchLaps.length)
        : snapshot.mode === "pomodoro"
          ? snapshot.completedCycles + " " + localizeText("vòng", "cycles")
          : Math.round((snapshot.progress || 0) * 100) + "%";
  }

  const shortcutButton = panel.querySelector("[data-study-shortcut='aux']");
  if (shortcutButton) {
    const label = shortcutButton.querySelector("[data-study-shortcut-label]");
    const hint = shortcutButton.querySelector("[data-study-shortcut-hint]");
    shortcutButton.disabled = snapshot.mode === "countdown";
    if (label) {
      label.textContent =
        snapshot.mode === "pomodoro" ? localizeText("Đổi pha", "Switch phase") : localizeText("Vòng", "Lap");
    }
    if (hint) {
      hint.textContent =
        snapshot.mode === "pomodoro"
          ? localizeText("Nhảy nhanh giữa học và nghỉ", "Jump between focus and break")
          : localizeText("Lưu mốc thời gian hiện tại", "Save the current split");
    }
  }

  const lapList = panel.querySelector("[data-study-laps]");
  if (lapList) {
    lapList.innerHTML = "";
    if (snapshot.mode !== "stopwatch") {
      const item = document.createElement("div");
      item.className = "study-timer-lap-empty";
      item.textContent =
        snapshot.mode === "pomodoro"
          ? localizeText("Pomodoro sẽ tự chuyển nhịp học và nghỉ theo thiết lập của bạn.", "Pomodoro will cycle focus and break blocks for you.")
          : localizeText("Đếm ngược không cần ghi vòng.", "Countdown does not use lap checkpoints.");
      lapList.appendChild(item);
    } else if (!studyTimerState.stopwatchLaps.length) {
      const item = document.createElement("div");
      item.className = "study-timer-lap-empty";
      item.textContent = localizeText(
        "Bấm Vòng để lưu các mốc học quan trọng trong khi bấm giờ.",
        "Use Lap to save important checkpoints while the stopwatch is running.",
      );
      lapList.appendChild(item);
    } else {
      studyTimerState.stopwatchLaps
        .slice()
        .reverse()
        .forEach((lap, index) => {
          const row = document.createElement("div");
          row.className = "study-timer-lap-row";
          const order = studyTimerState.stopwatchLaps.length - index;
          row.innerHTML =
            '<span class="study-timer-lap-name">' +
            localizeText("Vòng ", "Lap ") +
            order +
            "</span>" +
            '<strong class="study-timer-lap-time">' +
            formatStudyTimerClock(lap.elapsedMs) +
            "</strong>" +
            '<span class="study-timer-lap-split">' +
            localizeText("Chặng ", "Split ") +
            formatStudyTimerClock(lap.splitMs) +
            "</span>";
          lapList.appendChild(row);
        });
    }
  }
}

function syncStudyTimerState(now) {
  const currentTime = now || Date.now();
  if (!studyTimerState.isRunning || !studyTimerState.startedAt) return false;

  if (studyTimerState.mode === "stopwatch") return false;

  if (studyTimerState.mode === "countdown") {
    const durationMs = studyTimerState.countdownMinutes * MINUTE_MS;
    const elapsedMs = studyTimerState.countdownElapsedMs + Math.max(0, currentTime - studyTimerState.startedAt);
    if (elapsedMs < durationMs) return false;
    studyTimerState.countdownElapsedMs = durationMs;
    studyTimerState.isRunning = false;
    studyTimerState.startedAt = null;
    persistStudyTimerState();
    refreshStudyTimerUi(currentTime);
    showToast(localizeText("Hết giờ học rồi.", "Countdown finished."));
    return true;
  }

  let elapsedMs = studyTimerState.pomodoroPhaseElapsedMs + Math.max(0, currentTime - studyTimerState.startedAt);
  let phaseChanged = false;
  let nextToast = "";

  for (let index = 0; index < 4; index += 1) {
    const durationMs = getPomodoroDurationMs(studyTimerState.pomodoroPhase);
    if (elapsedMs < durationMs) break;
    elapsedMs -= durationMs;
    if (studyTimerState.pomodoroPhase === "focus") {
      studyTimerState.pomodoroPhase = "break";
      studyTimerState.pomodoroCompletedCycles += 1;
      nextToast = localizeText("Xong một phiên tập trung, chuyển sang nghỉ ngắn nhé.", "Focus block complete. Time for a short break.");
    } else {
      studyTimerState.pomodoroPhase = "focus";
      nextToast = localizeText("Nghỉ xong rồi, quay lại học tiếp thôi.", "Break is over. Back to your focus block.");
    }
    phaseChanged = true;
  }

  if (!phaseChanged) return false;

  studyTimerState.pomodoroPhaseElapsedMs = elapsedMs;
  studyTimerState.startedAt = currentTime;
  persistStudyTimerState();
  refreshStudyTimerUi(currentTime);
  if (nextToast) showToast(nextToast);
  return true;
}

function startStudyTimerTicker() {
  if (studyTimerTicker) window.clearInterval(studyTimerTicker);
  studyTimerTicker = window.setInterval(() => {
    const now = Date.now();
    syncStudyTimerState();
    refreshStudyTimerUi(now);
    const liveSecond = Math.floor(now / 1000);
    if (plannerLiveSecond !== liveSecond) {
      plannerLiveSecond = liveSecond;
      syncDashboardStudyProgress(now);
      if (isStudyNotesPopoverOpen() || document.body.classList.contains("planner-note-layer-open")) {
        refreshPlannerLiveUi(now);
      }
      refreshHomeOverviewIfNeeded();
    }
  }, 250);
}

function stopStudyTimer(now) {
  const snapshot = deriveStudyTimerSnapshot(now);
  if (studyTimerState.mode === "stopwatch") {
    studyTimerState.stopwatchElapsedMs = snapshot.elapsedMs;
  } else if (studyTimerState.mode === "countdown") {
    studyTimerState.countdownElapsedMs = snapshot.elapsedMs;
  } else {
    studyTimerState.pomodoroPhaseElapsedMs = snapshot.elapsedMs;
  }
  studyTimerState.isRunning = false;
  studyTimerState.startedAt = null;
  persistStudyTimerState();
  refreshStudyTimerUi(now);
}

function startStudyTimer(now) {
  if (studyTimerState.mode === "countdown") {
    const durationMs = studyTimerState.countdownMinutes * MINUTE_MS;
    if (studyTimerState.countdownElapsedMs >= durationMs) studyTimerState.countdownElapsedMs = 0;
  }
  if (studyTimerState.mode === "pomodoro") {
    const durationMs = getPomodoroDurationMs(studyTimerState.pomodoroPhase);
    if (studyTimerState.pomodoroPhaseElapsedMs >= durationMs) studyTimerState.pomodoroPhaseElapsedMs = 0;
  }
  studyTimerState.isRunning = true;
  studyTimerState.startedAt = now || Date.now();
  persistStudyTimerState();
  refreshStudyTimerUi(now);
}

function setStudyTimerMode(mode) {
  if (!["stopwatch", "countdown", "pomodoro"].includes(mode)) return;
  syncStudyTimerState();
  if (studyTimerState.isRunning) stopStudyTimer();
  studyTimerState.mode = mode;
  if (mode === "countdown") {
    const durationMs = studyTimerState.countdownMinutes * MINUTE_MS;
    studyTimerState.countdownElapsedMs = Math.min(studyTimerState.countdownElapsedMs, durationMs);
  }
  if (mode === "pomodoro") {
    studyTimerState.pomodoroPhase = studyTimerState.pomodoroPhase === "break" ? "break" : "focus";
  }
  persistStudyTimerState();
  refreshStudyTimerUi();
}

function resetStudyTimer() {
  syncStudyTimerState();
  studyTimerState.isRunning = false;
  studyTimerState.startedAt = null;
  if (studyTimerState.mode === "stopwatch") {
    studyTimerState.stopwatchElapsedMs = 0;
    studyTimerState.stopwatchLaps = [];
  } else if (studyTimerState.mode === "countdown") {
    studyTimerState.countdownElapsedMs = 0;
  } else {
    studyTimerState.pomodoroPhase = "focus";
    studyTimerState.pomodoroPhaseElapsedMs = 0;
    studyTimerState.pomodoroCompletedCycles = 0;
  }
  persistStudyTimerState();
  refreshStudyTimerUi();
}

function toggleStudyTimer() {
  const now = Date.now();
  syncStudyTimerState(now);
  if (studyTimerState.isRunning) {
    stopStudyTimer(now);
    return;
  }
  startStudyTimer(now);
}

function updateStudyTimerField(field, value) {
  if (field === "countdownMinutes") {
    studyTimerState.countdownMinutes = normalizeStudyMinutes(value, 25, 240);
    studyTimerState.countdownElapsedMs = 0;
  }
  if (field === "pomodoroFocusMinutes") {
    studyTimerState.pomodoroFocusMinutes = normalizeStudyMinutes(value, 25, 180);
    studyTimerState.pomodoroPhase = "focus";
    studyTimerState.pomodoroPhaseElapsedMs = 0;
    studyTimerState.pomodoroCompletedCycles = 0;
  }
  if (field === "pomodoroBreakMinutes") {
    studyTimerState.pomodoroBreakMinutes = normalizeStudyMinutes(value, 5, 60);
    studyTimerState.pomodoroPhase = "focus";
    studyTimerState.pomodoroPhaseElapsedMs = 0;
    studyTimerState.pomodoroCompletedCycles = 0;
  }
  studyTimerState.isRunning = false;
  studyTimerState.startedAt = null;
  persistStudyTimerState();
  refreshStudyTimerUi();
}

function captureStudyTimerLap() {
  if (studyTimerState.mode !== "stopwatch") return;
  const snapshot = deriveStudyTimerSnapshot();
  if (!snapshot.elapsedMs) return;
  const previous = studyTimerState.stopwatchLaps[studyTimerState.stopwatchLaps.length - 1];
  studyTimerState.stopwatchLaps.push({
    elapsedMs: snapshot.elapsedMs,
    splitMs: snapshot.elapsedMs - (previous ? previous.elapsedMs : 0),
  });
  persistStudyTimerState();
  refreshStudyTimerUi();
}

function advancePomodoroPhase() {
  if (studyTimerState.mode !== "pomodoro") return;
  const running = studyTimerState.isRunning;
  studyTimerState.pomodoroPhase = studyTimerState.pomodoroPhase === "break" ? "focus" : "break";
  studyTimerState.pomodoroPhaseElapsedMs = 0;
  studyTimerState.startedAt = running ? Date.now() : null;
  persistStudyTimerState();
  refreshStudyTimerUi();
}

function triggerStudyTimerAuxAction() {
  if (studyTimerState.mode === "stopwatch") {
    captureStudyTimerLap();
    return;
  }
  if (studyTimerState.mode === "pomodoro") {
    advancePomodoroPhase();
  }
}

function toggleStudyTimerFullscreen() {
  if (!el.studyTimerPopover || !document.fullscreenEnabled) return;
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
    return;
  }
  el.studyTimerPopover.requestFullscreen().catch(() => {});
}

function createStudyNotebookSection() {
  const notebook = document.createElement("section");
  notebook.className = "study-timer-notebook";
  notebook.innerHTML =
    '<div class="study-timer-section-head">' +
    '<div><strong>' +
    localizeText("Notes & To-do", "Notes & To-do") +
    '</strong><span data-study-todo-summary="true"></span></div>' +
    '<button type="button" class="study-timer-clear-btn" data-study-todo-clear="true">' +
    localizeText("Xóa xong", "Clear done") +
    "</button></div>" +
    '<label class="study-timer-note-editor">' +
    '<span class="study-timer-note-editor-label">' +
    localizeText("Ghi chú nhanh", "Quick note") +
    "</span>" +
    '<textarea class="study-timer-note-input" data-study-note-input="true" rows="4" maxlength="4000" placeholder="' +
    localizeText(
      "Ghi mục tiêu, ý tưởng hoặc tài nguyên cho phiên học này...",
      "Capture goals, ideas, or resources for this study block...",
    ) +
    '"></textarea></label>' +
    '<form class="study-timer-todo-form" data-study-todo-form="true">' +
    '<input class="settings-text-input study-timer-todo-input" data-study-todo-input="true" type="text" maxlength="160" placeholder="' +
    localizeText("Thêm một việc cần làm...", "Add a task...") +
    '">' +
    '<button type="submit" class="btn secondary study-timer-todo-add">' +
    localizeText("Thêm", "Add") +
    '</button></form><div class="study-timer-todo-list" data-study-todo-list="true"></div>';
  return notebook;
}

function createStudyTimerPanel() {
  const panel = document.createElement("section");
  panel.className = "study-timer-panel";
  panel.dataset.studyTimer = "true";

  const head = document.createElement("div");
  head.className = "study-timer-head";

  const headingGroup = document.createElement("div");
  const meta = document.createElement("span");
  meta.className = "mini muted";
  meta.dataset.studyMeta = "true";
  headingGroup.append(meta);

  const badge = document.createElement("span");
  badge.className = "study-timer-badge";
  badge.dataset.studyBadge = "true";

  head.append(headingGroup, badge);

  const modes = document.createElement("div");
  modes.className = "study-timer-modes";
  [
    ["stopwatch", localizeText("Bấm giờ", "Stopwatch")],
    ["countdown", localizeText("Đếm ngược", "Countdown")],
    ["pomodoro", "Pomodoro"],
  ].forEach(([mode, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn secondary study-timer-mode";
    button.dataset.studyMode = mode;
    button.textContent = label;
    modes.appendChild(button);
  });

  const display = document.createElement("div");
  display.className = "study-timer-display";

  const displayMeta = document.createElement("div");
  displayMeta.className = "study-timer-display-meta";

  const displayLabel = document.createElement("span");
  displayLabel.className = "study-timer-display-label";
  displayLabel.dataset.studyDisplayLabel = "true";

  const displayPhase = document.createElement("span");
  displayPhase.className = "study-timer-display-phase";
  displayPhase.dataset.studyDisplayPhase = "true";

  displayMeta.append(displayLabel, displayPhase);

  const time = document.createElement("div");
  time.className = "study-timer-time";
  time.dataset.studyDisplay = "true";
  time.innerHTML =
    '<div class="study-timer-time-part"><strong class="study-timer-time-value" data-study-hours="true">00</strong><span class="study-timer-time-caption">' +
    localizeText("Giờ", "Hours") +
    '</span></div><span class="study-timer-time-separator" aria-hidden="true">:</span><div class="study-timer-time-part"><strong class="study-timer-time-value" data-study-minutes="true">00</strong><span class="study-timer-time-caption">' +
    localizeText("Phút", "Minutes") +
    '</span></div><span class="study-timer-time-separator" aria-hidden="true">:</span><div class="study-timer-time-part"><strong class="study-timer-time-value" data-study-seconds="true">00</strong><span class="study-timer-time-caption">' +
    localizeText("Giây", "Seconds") +
    "</span></div>";

  const progress = document.createElement("div");
  progress.className = "study-timer-progress";
  progress.innerHTML = '<span class="study-timer-progress-bar" data-study-progress-bar="true"></span>';

  const helper = document.createElement("p");
  helper.className = "study-timer-helper";
  helper.dataset.studyHelper = "true";

  display.append(displayMeta, time, progress, helper);

  const config = document.createElement("div");
  config.className = "study-timer-config";
  config.dataset.studyConfig = "true";

  const actions = document.createElement("div");
  actions.className = "study-timer-actions";
  actions.innerHTML =
    '<button type="button" class="btn" data-study-action="toggle"></button>' +
    '<button type="button" class="btn secondary" data-study-action="reset">' +
    localizeText("Đặt lại", "Reset") +
    "</button>";

  const shortcuts = document.createElement("div");
  shortcuts.className = "study-timer-shortcuts";
  shortcuts.innerHTML =
    '<button type="button" class="study-timer-shortcut" data-study-action="toggle">' +
    '<span class="study-timer-shortcut-key">' + localizeText("Dau cach", "Space") + "</span>" +
    '<span class="study-timer-shortcut-copy"><strong>' +
    localizeText("Bắt đầu/Tạm dừng", "Start/Pause") +
    "</strong><span>" +
    localizeText("Điều khiển nhanh khi popup đang mở", "Quick control while the popup is open") +
    "</span></span></button>" +
    '<button type="button" class="study-timer-shortcut" data-study-shortcut="aux">' +
    '<span class="study-timer-shortcut-key">L</span>' +
    '<span class="study-timer-shortcut-copy"><strong data-study-shortcut-label="true"></strong><span data-study-shortcut-hint="true"></span></span></button>' +
    '<button type="button" class="study-timer-shortcut" data-study-action="reset">' +
    '<span class="study-timer-shortcut-key">R</span>' +
    '<span class="study-timer-shortcut-copy"><strong>' +
    localizeText("Đặt lại", "Reset") +
    "</strong><span>" +
    localizeText("Quay về phần đầu của phần đang chạy", "Return the current mode to its start") +
    "</span></span></button>" +
    '<button type="button" class="study-timer-shortcut" data-study-action="fullscreen">' +
    '<span class="study-timer-shortcut-key">F</span>' +
    '<span class="study-timer-shortcut-copy"><strong>' +
    localizeText("Toàn màn hình", "Fullscreen") +
    "</strong><span>" +
    localizeText("Phóng to popup để tập trung hơn", "Expand the timer for a cleaner focus view") +
    "</span></span></button>";

  const stats = document.createElement("div");
  stats.className = "study-timer-stats";
  stats.innerHTML =
    '<div class="study-timer-stat"><span data-study-stat-primary="true"></span><strong data-study-value-primary="true"></strong></div>' +
    '<div class="study-timer-stat"><span data-study-stat-secondary="true"></span><strong data-study-value-secondary="true"></strong></div>';

  const laps = document.createElement("div");
  laps.className = "study-timer-laps";
  laps.dataset.studyLaps = "true";

  const layout = document.createElement("div");
  layout.className = "study-timer-layout";

  const stage = document.createElement("div");
  stage.className = "study-timer-stage";
  stage.append(display, actions, shortcuts);

  const side = document.createElement("div");
  side.className = "study-timer-side";
  side.append(config, stats, laps);

  layout.append(stage, side);

  panel.append(head, modes, layout);
  refreshStudyTimerUi();
  return panel;
}

function plannerPriorityLabel(priority) {
  if (priority === "low") return localizeText("Thấp", "Low");
  if (priority === "high") return localizeText("Cao", "High");
  if (priority === "urgent") return localizeText("Gấp", "Urgent");
  return localizeText("Vừa", "Medium");
}

function plannerStatusLabel(status) {
  if (status === "progress") return localizeText("Đang làm", "In progress");
  if (status === "done") return localizeText("Hoàn thành", "Done");
  return "Todo";
}

function plannerTaskBadgeHtml(task, now = Date.now()) {
  const deadline = plannerDeadlineState(task, now);
  const tracked = formatPlannerTrackedMs(getPlannerTaskTrackedMs(task, now));
  const estimate = formatPlannerDurationMinutes(task.estimateMinutes);
  return (
    '<div class="planner-task-meta">' +
    '<span class="planner-pill" data-tone="' + escapeHtml(task.priority) + '">' +
    escapeHtml(plannerPriorityLabel(task.priority)) +
    "</span>" +
    (task.project
      ? '<span class="planner-pill subtle">' + escapeHtml(task.project) + "</span>"
      : "") +
    (task.tag
      ? '<span class="planner-pill subtle">' + escapeHtml(task.tag) + "</span>"
      : "") +
    "</div>" +
    '<div class="planner-task-stats">' +
    '<span data-planner-task-deadline="' + escapeHtml(task.id) + '">' + escapeHtml(deadline.copy) + "</span>" +
    '<span data-planner-task-tracked="' + escapeHtml(task.id) + '">' +
    escapeHtml(localizeText("Đã track ", "Tracked ") + tracked) +
    "</span>" +
    '<span>' + escapeHtml(localizeText("Ước tính ", "Estimate ") + estimate) + "</span>" +
    "</div>"
  );
}

function plannerTaskCardHtml(task, viewMode) {
  const now = Date.now();
  const progress = Math.round(getPlannerTaskProgressRatio(task, now) * 100);
  const deadline = plannerDeadlineState(task, now);
  return (
    '<article class="planner-task-card' +
    (deadline.kind === "overdue" ? " is-overdue" : deadline.kind === "soon" ? " is-due-soon" : "") +
    '" draggable="true" data-planner-task-drag="' + escapeHtml(task.id) + '">' +
    '<div class="planner-task-card-head">' +
    '<button type="button" class="planner-task-check' + (task.status === "done" ? " is-done" : "") +
    '" data-planner-task-toggle="' + escapeHtml(task.id) + '" aria-pressed="' +
    String(task.status === "done") +
    '">' +
    '<span aria-hidden="true"></span></button>' +
    '<div class="planner-task-card-copy">' +
    '<strong>' + escapeHtml(task.title) + "</strong>" +
    (task.description ? '<p>' + escapeHtml(task.description) + "</p>" : "") +
    "</div>" +
    "</div>" +
    plannerTaskBadgeHtml(task, now) +
    '<div class="planner-task-progress"><span style="width:' + String(progress) +
    '%" data-planner-task-progress="' + escapeHtml(task.id) + '"></span></div>' +
    '<div class="planner-task-actions">' +
    '<button type="button" class="planner-mini-btn" data-planner-task-track="' + escapeHtml(task.id) + '">' +
    escapeHtml(plannerState.activeTaskId === task.id ? localizeText("Dừng", "Stop") : localizeText("Track", "Track")) +
    "</button>" +
    '<button type="button" class="planner-mini-btn" data-planner-task-select="' + escapeHtml(task.id) + '">' +
    escapeHtml(viewMode === "list" ? localizeText("Sửa", "Edit") : localizeText("Chi tiết", "Details")) +
    "</button>" +
    '<button type="button" class="planner-mini-btn danger" data-planner-task-remove="' + escapeHtml(task.id) + '">' +
    escapeHtml(localizeText("Xóa", "Delete")) +
    "</button>" +
    "</div>" +
    "</article>"
  );
}

function plannerBoardHtml(tasks) {
  return PLANNER_STATUS_OPTIONS.map((status) => {
    const items = tasks.filter((task) => task.status === status);
    return (
      '<section class="planner-board-column" data-planner-drop-zone="' + escapeHtml(status) + '">' +
      '<div class="planner-board-head"><strong>' + escapeHtml(plannerStatusLabel(status)) + "</strong><span>" +
      String(items.length) +
      "</span></div>" +
      '<div class="planner-board-list">' +
      (items.length
        ? items.map((task) => plannerTaskCardHtml(task, "board")).join("")
        : '<div class="planner-empty-mini">' +
          escapeHtml(localizeText("Kéo task vào đây", "Drop tasks here")) +
          "</div>") +
      "</div></section>"
    );
  }).join("");
}

function plannerListHtml(tasks) {
  if (!tasks.length) {
    return (
      '<div class="planner-empty-block">' +
      '<strong>' + escapeHtml(localizeText("Chưa có task phù hợp", "No matching tasks")) + "</strong>" +
      '<span>' +
      escapeHtml(localizeText("Thử đổi filter hoặc tạo nhanh một task mới từ ô Quick Add.", "Try changing the filters or create a new task from Quick Add.")) +
      "</span></div>"
    );
  }
  return '<div class="planner-task-list">' + tasks.map((task) => plannerTaskCardHtml(task, "list")).join("") + "</div>";
}

function plannerTimelineHtml() {
  const items = plannerTimelineTasks();
  return (
    '<section class="planner-panel timeline">' +
    '<div class="planner-panel-head"><strong>' + escapeHtml(localizeText("Timeline hôm nay", "Today timeline")) +
    "</strong><span>" + escapeHtml(localizeText("Theo giờ", "By hour")) + "</span></div>" +
    '<div class="planner-timeline">' +
    (items.length
      ? items.map((task) => {
          const stamp = task.scheduledAt || task.deadline;
          return (
            '<div class="planner-timeline-item">' +
            '<div class="planner-timeline-time">' + escapeHtml(plannerDateTimeLabel(stamp)) + "</div>" +
            '<div class="planner-timeline-card">' +
            '<strong>' + escapeHtml(task.title) + "</strong>" +
            '<span>' + escapeHtml(task.project || plannerStatusLabel(task.status)) + "</span>" +
            "</div></div>"
          );
        }).join("")
      : '<div class="planner-empty-mini">' +
        escapeHtml(localizeText("Chưa có mốc giờ nào cho hôm nay.", "No scheduled slots for today yet.")) +
        "</div>") +
    "</div></section>"
  );
}

function plannerUpcomingHtml() {
  const items = plannerUpcomingTasks(4);
  return (
    '<section class="planner-panel due">' +
    '<div class="planner-panel-head"><strong>' + escapeHtml(localizeText("Sắp đến hạn", "Due soon")) +
    "</strong><span>" + escapeHtml(localizeText("Ưu tiên", "Priority")) + "</span></div>" +
    '<div class="planner-due-list">' +
    (items.length
      ? items.map((task) => {
          const deadline = plannerDeadlineState(task);
          return (
            '<button type="button" class="planner-due-item" data-planner-task-select="' + escapeHtml(task.id) + '">' +
            '<strong>' + escapeHtml(task.title) + "</strong>" +
            '<span>' + escapeHtml(deadline.copy) + "</span></button>"
          );
        }).join("")
      : '<div class="planner-empty-mini">' +
        escapeHtml(localizeText("Không có task sát deadline.", "Nothing urgent is coming up.")) +
        "</div>") +
    "</div></section>"
  );
}

function plannerNotesLibraryHtml() {
  return (
    '<section class="planner-panel notes">' +
    '<div class="planner-panel-head"><strong>' + escapeHtml(localizeText("Sticky notes", "Sticky notes")) +
    "</strong><button type=\"button\" class=\"planner-mini-btn\" data-planner-note-new=\"true\">" +
    escapeHtml(localizeText("Sticky note mới", "New sticky note")) +
    "</button></div>" +
    '<div class="planner-note-library">' +
    (plannerState.notes.length
      ? plannerState.notes
          .slice()
          .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
          .map((note) => {
            return (
              '<article class="planner-note-library-card" data-color="' + escapeHtml(note.color) + '">' +
              '<div class="planner-note-library-head"><strong>' + escapeHtml(note.title) + "</strong>" +
              (note.pinned ? '<span class="planner-pill subtle">' + escapeHtml(localizeText("Ghim", "Pinned")) + "</span>" : "") +
              "</div>" +
              '<p>' + escapeHtml(note.content || localizeText("Note trống, bấm Open để bắt đầu viết.", "Empty note, open it to start writing.")) + "</p>" +
              '<div class="planner-note-library-actions">' +
              '<button type="button" class="planner-mini-btn" data-planner-note-open="' + escapeHtml(note.id) + '">' +
              escapeHtml(note.isOpen ? localizeText("Đang mở", "Open now") : localizeText("Mở", "Open")) +
              "</button>" +
              '<button type="button" class="planner-mini-btn" data-planner-note-pin="' + escapeHtml(note.id) + '">' +
              escapeHtml(note.pinned ? localizeText("Bỏ ghim", "Unpin") : localizeText("Ghim", "Pin")) +
              "</button>" +
              '<button type="button" class="planner-mini-btn" data-planner-note-convert="' + escapeHtml(note.id) + '">' +
              escapeHtml(localizeText("Ra task", "To task")) +
              "</button>" +
              '<button type="button" class="planner-mini-btn danger" data-planner-note-delete="' + escapeHtml(note.id) + '">' +
              escapeHtml(localizeText("Xóa", "Delete")) +
              "</button>" +
              "</div></article>"
            );
          }).join("")
      : '<div class="planner-empty-block compact">' +
        '<strong>' + escapeHtml(localizeText("Chưa có sticky note", "No sticky notes yet")) + "</strong>" +
        '<span>' + escapeHtml(localizeText("Tạo note để mở nhiều cửa sổ ghi chú kéo-thả trên màn hình.", "Create a note to open draggable sticky windows on the screen.")) + "</span></div>") +
    "</div></section>"
  );
}

function plannerTaskFormHtml() {
  const selected = getPlannerTaskById(plannerState.selectedTaskId);
  return (
    '<section class="planner-panel editor">' +
    '<div class="planner-panel-head"><strong>' + escapeHtml(selected ? localizeText("Chi tiết task", "Task details") : localizeText("Tạo task", "Create task")) +
    "</strong><button type=\"button\" class=\"planner-mini-btn\" data-planner-task-reset=\"true\">" +
    escapeHtml(localizeText("Task mới", "New task")) +
    "</button></div>" +
    '<form class="planner-task-form" data-planner-task-form="true">' +
    '<input type="hidden" name="taskId" value="' + escapeHtml(selected ? selected.id : "") + '">' +
    '<label><span>' + escapeHtml(localizeText("Tên công việc", "Task name")) +
    '</span><input class="settings-text-input" name="title" maxlength="120" value="' + escapeHtml(selected ? selected.title : "") +
    '" placeholder="' + escapeHtml(localizeText("Ví dụ: soạn báo cáo sprint", "Example: draft sprint report")) + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Mô tả ngắn", "Short description")) +
    '</span><textarea class="settings-textarea-input" name="description" rows="3" maxlength="600" placeholder="' +
    escapeHtml(localizeText("Thêm ngữ cảnh, checklist hoặc link tham chiếu...", "Add context, checklist, or reference links...")) +
    '">' + escapeHtml(selected ? selected.description : "") + '</textarea></label>' +
    '<div class="planner-task-grid">' +
    '<label><span>Deadline</span><input class="settings-text-input" type="datetime-local" name="deadline" value="' +
    escapeHtml(selected ? selected.deadline : "") + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Lên lịch", "Schedule")) + '</span><input class="settings-text-input" type="datetime-local" name="scheduledAt" value="' +
    escapeHtml(selected ? selected.scheduledAt : "") + '"></label>' +
    '<label><span>Priority</span><select class="settings-select-input" name="priority">' +
    PLANNER_PRIORITY_OPTIONS.map((priority) =>
      '<option value="' + priority + '"' + ((selected ? selected.priority : "medium") === priority ? " selected" : "") + ">" +
      escapeHtml(plannerPriorityLabel(priority)) + "</option>"
    ).join("") + '</select></label>' +
    '<label><span>Status</span><select class="settings-select-input" name="status">' +
    PLANNER_STATUS_OPTIONS.map((status) =>
      '<option value="' + status + '"' + ((selected ? selected.status : "todo") === status ? " selected" : "") + ">" +
      escapeHtml(plannerStatusLabel(status)) + "</option>"
    ).join("") + '</select></label>' +
    '<label><span>Project</span><input class="settings-text-input" name="project" maxlength="64" value="' +
    escapeHtml(selected ? selected.project : "") + '" placeholder="' +
    escapeHtml(localizeText("Ví dụ: Marketing", "Example: Marketing")) + '"></label>' +
    '<label><span>Tag</span><input class="settings-text-input" name="tag" maxlength="48" value="' +
    escapeHtml(selected ? selected.tag : "") + '" placeholder="' +
    escapeHtml(localizeText("Ví dụ: nội bộ", "Example: internal")) + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Ước tính (phút)", "Estimate (minutes)")) +
    '</span><input class="settings-text-input" type="number" min="0" max="720" step="5" name="estimateMinutes" value="' +
    escapeHtml(String(selected ? selected.estimateMinutes : 30)) + '"></label>' +
    '<div class="planner-live-card"><span>' + escapeHtml(localizeText("Đã track", "Tracked")) + '</span><strong data-planner-task-tracked="' +
    escapeHtml(selected ? selected.id : "") + '">' + escapeHtml(selected ? localizeText("Đã track ", "Tracked ") + formatPlannerTrackedMs(getPlannerTaskTrackedMs(selected)) : localizeText("Chưa có", "No data")) +
    "</strong></div></div>" +
    '<div class="planner-form-actions">' +
    '<button type="submit" class="btn">' + escapeHtml(selected ? localizeText("Lưu task", "Save task") : localizeText("Tạo task", "Create task")) + "</button>" +
    '<button type="button" class="btn secondary" data-planner-task-reset="true">' + escapeHtml(localizeText("Reset", "Reset")) + "</button>" +
    "</div></form></section>"
  );
}

function plannerWorkspaceHtml() {
  const visibleTasks = plannerVisibleTasks();
  return (
    '<div class="planner-workspace-grid">' +
    '<section class="planner-main-panel">' +
    '<div class="planner-view-surface">' +
    (plannerState.viewMode === "list" ? plannerListHtml(visibleTasks) : '<div class="planner-board">' + plannerBoardHtml(visibleTasks) + "</div>") +
    "</div></section>" +
    '<aside class="planner-side-panel">' + plannerTaskFormHtml() + plannerNotesLibraryHtml() + "</aside>" +
    "</div>"
  );
}

function plannerOverviewHtml() {
  const snapshot = plannerOverviewSnapshot();
  return (
    '<div class="planner-overview-grid">' +
    '<section class="planner-panel stats">' +
    '<div class="planner-stat-card"><span>' + escapeHtml(localizeText("Tiến độ", "Progress")) + "</span><strong>" +
    String(Math.round(snapshot.completionRatio * 100)) + '%</strong><small>' +
    escapeHtml(localizeText(snapshot.done + " / " + snapshot.total + " task xong", snapshot.done + " / " + snapshot.total + " tasks done")) +
    "</small></div>" +
    '<div class="planner-stat-card"><span>' + escapeHtml(localizeText("Hôm nay", "Today")) + "</span><strong>" +
    String(plannerTodayTasks().length) + "</strong><small>" +
    escapeHtml(localizeText("task cần xử lý", "tasks in focus")) + "</small></div>" +
    '<div class="planner-stat-card"><span>' + escapeHtml(localizeText("Sắp tới hạn", "Due soon")) + "</span><strong>" +
    String(snapshot.dueSoon) + "</strong><small>" +
    escapeHtml(localizeText("cần ưu tiên", "need attention")) + "</small></div>" +
    '<div class="planner-stat-card"><span>' + escapeHtml(localizeText("Đang chạy", "Active")) + "</span><strong>" +
    String(snapshot.active) + "</strong><small>" +
    escapeHtml(localizeText("task đang làm", "tasks in progress")) + "</small></div>" +
    "</section>" +
    plannerUpcomingHtml() +
    plannerTimelineHtml() +
    "</div>"
  );
}

function plannerDashboardSortedTasks() {
  return plannerState.tasks
    .slice()
    .sort((left, right) => {
      const leftStatus = PLANNER_STATUS_OPTIONS.indexOf(left.status);
      const rightStatus = PLANNER_STATUS_OPTIONS.indexOf(right.status);
      if (leftStatus !== rightStatus) return leftStatus - rightStatus;
      const leftDeadline = Date.parse(left.deadline || left.scheduledAt || "") || Number.MAX_SAFE_INTEGER;
      const rightDeadline = Date.parse(right.deadline || right.scheduledAt || "") || Number.MAX_SAFE_INTEGER;
      if (leftDeadline !== rightDeadline) return leftDeadline - rightDeadline;
      return Number(right.updatedAt || 0) - Number(left.updatedAt || 0);
    });
}

function plannerDashboardTasksByStatus(status) {
  return plannerDashboardSortedTasks().filter((task) => task.status === status);
}

function plannerDashboardUpcomingTasks(limit = 4) {
  const now = Date.now();
  return plannerDashboardSortedTasks()
    .filter((task) => task.status !== "done" && plannerDeadlineState(task, now).kind !== "none")
    .sort((left, right) => (Date.parse(left.deadline || "") || 0) - (Date.parse(right.deadline || "") || 0))
    .slice(0, limit);
}

function plannerDashboardTimelineTasks(limit = 6) {
  const todayKey = plannerDayKey();
  return plannerDashboardSortedTasks()
    .filter((task) => {
      if (task.status === "done") return false;
      return plannerDayKey(task.scheduledAt) === todayKey || plannerDayKey(task.deadline) === todayKey;
    })
    .sort((left, right) => {
      const leftTime = Date.parse(left.scheduledAt || left.deadline || "") || Number.MAX_SAFE_INTEGER;
      const rightTime = Date.parse(right.scheduledAt || right.deadline || "") || Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    })
    .slice(0, limit);
}

function plannerActiveNote() {
  const sortedNotes = plannerState.notes
    .slice()
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
  const openNotes = sortedNotes
    .filter((note) => note.isOpen)
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
  return openNotes[0] || sortedNotes[0] || null;
}

function plannerDashboardTaskRowHtml(task) {
  const now = Date.now();
  const deadline = plannerDeadlineState(task, now);
  const taskId = escapeHtml(task.id);
  const isSelected = plannerState.selectedTaskId === task.id;
  const meta = [task.project, task.tag].filter(Boolean).join(" • ") || plannerStatusLabel(task.status);
  return (
    '<article class="home-task-item planner-dashboard-task' +
    (task.status === "done" ? " is-done" : "") +
    (isSelected ? " is-active" : "") +
    '" draggable="true" data-planner-task-drag="' + taskId + '">' +
    '<button type="button" class="home-task-check' + (task.status === "done" ? " is-done" : "") +
    '" data-planner-task-toggle="' + taskId + '" aria-pressed="' + String(task.status === "done") + '">' +
    "<span></span></button>" +
    '<button type="button" class="planner-dashboard-task-open" data-planner-task-select="' + taskId + '">' +
    '<div class="home-task-copy"><strong>' + escapeHtml(task.title) + "</strong>" +
    "<span>" + escapeHtml(meta) + "</span>" +
    '<span data-planner-task-deadline="' + taskId + '">' + escapeHtml(deadline.copy) + "</span></div></button>" +
    '<button type="button" class="home-inline-btn" data-planner-task-select="' + taskId + '">' +
    escapeHtml(localizeText("Chi tiết", "Details")) +
    "</button></article>"
  );
}

function plannerDashboardStatusColumnHtml(status) {
  const items = plannerDashboardTasksByStatus(status);
  return (
    '<section class="planner-dashboard-status-column" data-planner-drop-zone="' + escapeHtml(status) + '">' +
    '<div class="home-mini-head"><strong>' + escapeHtml(plannerStatusLabel(status)) + "</strong><span>" +
    String(items.length) + "</span></div>" +
    (items.length
      ? '<div class="planner-dashboard-task-list">' + items.map((task) => plannerDashboardTaskRowHtml(task)).join("") + "</div>"
      : '<div class="home-note-empty planner-dashboard-empty">' +
        escapeHtml(localizeText("Chưa có task ở cột này.", "No tasks in this column yet.")) +
        "</div>") +
    "</section>"
  );
}

function plannerDashboardDueSoonHtml() {
  const items = plannerDashboardUpcomingTasks(4);
  return (
    '<div class="planner-dashboard-support-card">' +
    '<div class="home-mini-head"><strong>' + escapeHtml(localizeText("Sắp đến hạn", "Due soon")) + "</strong><span>" +
    escapeHtml(localizeText("Ưu tiên", "Priority")) + "</span></div>" +
    (items.length
      ? '<div class="home-note-list">' + items.map((task) =>
        '<button type="button" class="home-note-chip" data-planner-task-select="' + escapeHtml(task.id) + '">' +
        '<strong>' + escapeHtml(task.title) + "</strong>" +
        "<span>" + escapeHtml(plannerDeadlineState(task).copy) + "</span></button>"
      ).join("") + "</div>"
      : '<div class="home-note-empty">' +
        escapeHtml(localizeText("Không có task nào cần ưu tiên gấp.", "Nothing urgent is coming up.")) +
        "</div>") +
    "</div>"
  );
}

function plannerDashboardTimelineHtml() {
  const items = plannerDashboardTimelineTasks(6);
  return (
    '<div class="planner-dashboard-support-card">' +
    '<div class="home-mini-head"><strong>' + escapeHtml(localizeText("Timeline hôm nay", "Today timeline")) + "</strong><span>" +
    escapeHtml(localizeText("Theo giờ", "By hour")) + "</span></div>" +
    (items.length
      ? '<div class="home-timeline-list">' + items.map((task) => {
        const stamp = task.scheduledAt || task.deadline;
        return (
          '<button type="button" class="home-timeline-item" data-planner-task-select="' + escapeHtml(task.id) + '">' +
          "<span>" + escapeHtml(plannerDateTimeLabel(stamp)) + "</span>" +
          "<strong>" + escapeHtml(task.title) + "</strong>" +
          "<small>" + escapeHtml(task.project || plannerStatusLabel(task.status)) + "</small>" +
          "</button>"
        );
      }).join("") + "</div>"
      : '<div class="home-note-empty">' +
        escapeHtml(localizeText("Chưa có mốc giờ nào cho hôm nay.", "No scheduled slots for today yet.")) +
        "</div>") +
    "</div>"
  );
}

function plannerDashboardTaskFormHtml() {
  const selected = getPlannerTaskById(plannerState.selectedTaskId);
  const tracked = selected
    ? formatPlannerTrackedMs(getPlannerTaskTrackedMs(selected))
    : localizeText("Chưa có", "No data");
  return (
    '<form class="planner-dashboard-form" data-planner-task-form="true">' +
    '<input type="hidden" name="taskId" value="' + escapeHtml(selected ? selected.id : "") + '">' +
    '<label><span>' + escapeHtml(localizeText("Tên task", "Task name")) + '</span>' +
    '<input class="settings-text-input" type="text" name="title" maxlength="120" value="' +
    escapeHtml(selected ? selected.title : "") + '" placeholder="' +
    escapeHtml(localizeText("Ví dụ: soạn báo cáo sprint", "Example: draft sprint report")) + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Mô tả ngắn", "Short description")) + '</span>' +
    '<textarea class="settings-text-input" name="description" rows="4" maxlength="600" placeholder="' +
    escapeHtml(localizeText("Thêm context, checklist hoặc link liên quan...", "Add context, checklist, or reference links...")) +
    '">' + escapeHtml(selected ? selected.description : "") + "</textarea></label>" +
    '<div class="planner-dashboard-form-grid">' +
    '<label><span>Deadline</span><input class="settings-text-input" type="datetime-local" name="deadline" value="' +
    escapeHtml(selected ? selected.deadline : "") + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Lịch làm", "Schedule")) + '</span><input class="settings-text-input" type="datetime-local" name="scheduledAt" value="' +
    escapeHtml(selected ? selected.scheduledAt : "") + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Ưu tiên", "Priority")) + '</span><select class="settings-select-input" name="priority">' +
    PLANNER_PRIORITY_OPTIONS.map((priority) =>
      '<option value="' + priority + '"' + ((selected ? selected.priority : "medium") === priority ? " selected" : "") + ">" +
      escapeHtml(plannerPriorityLabel(priority)) + "</option>"
    ).join("") + "</select></label>" +
    '<label><span>Status</span><select class="settings-select-input" name="status">' +
    PLANNER_STATUS_OPTIONS.map((status) =>
      '<option value="' + status + '"' + ((selected ? selected.status : "todo") === status ? " selected" : "") + ">" +
      escapeHtml(plannerStatusLabel(status)) + "</option>"
    ).join("") + "</select></label>" +
    '<label><span>Project</span><input class="settings-text-input" type="text" name="project" maxlength="64" value="' +
    escapeHtml(selected ? selected.project : "") + '" placeholder="' +
    escapeHtml(localizeText("Ví dụ: Marketing", "Example: Marketing")) + '"></label>' +
    '<label><span>Tag</span><input class="settings-text-input" type="text" name="tag" maxlength="48" value="' +
    escapeHtml(selected ? selected.tag : "") + '" placeholder="' +
    escapeHtml(localizeText("Ví dụ: nội bộ", "Example: internal")) + '"></label>' +
    '<label><span>' + escapeHtml(localizeText("Ước tính (phút)", "Estimate (minutes)")) + '</span><input class="settings-text-input" type="number" name="estimateMinutes" min="5" max="720" step="5" value="' +
    escapeHtml(String(selected ? selected.estimateMinutes : 30)) + '"></label>' +
    '<div class="planner-dashboard-inline-cards">' +
    '<article class="home-progress-card"><span>' + escapeHtml(localizeText("Đã track", "Tracked")) + '</span><strong data-planner-task-tracked="' +
    escapeHtml(selected ? selected.id : "") + '">' + escapeHtml(tracked) + "</strong></article>" +
    '<article class="home-progress-card"><span>' + escapeHtml(localizeText("Tiến độ", "Status")) + "</span><strong>" +
    escapeHtml(selected ? plannerStatusLabel(selected.status) : plannerStatusLabel("todo")) + "</strong></article>" +
    "</div></div>" +
    '<div class="planner-dashboard-inline-actions">' +
    (selected
      ? '<button type="button" class="home-inline-btn" data-planner-task-track="' + escapeHtml(selected.id) + '">' +
        escapeHtml(plannerState.activeTaskId === selected.id ? localizeText("Dừng track", "Stop tracking") : localizeText("Track task", "Track task")) +
        "</button>"
      : "") +
    '<button type="button" class="home-inline-btn" data-planner-task-reset="true">' + escapeHtml(localizeText("Task mới", "New task")) + "</button>" +
    (selected
      ? '<button type="button" class="home-inline-btn" data-planner-task-remove="' + escapeHtml(selected.id) + '">' +
        escapeHtml(localizeText("Xoa task", "Delete task")) +
        "</button>"
      : "") +
    '<button type="submit" class="home-quick-btn primary">' +
    escapeHtml(selected ? localizeText("Lưu task", "Save task") : localizeText("Tạo task", "Create task")) +
    "</button></div></form>"
  );
}

function plannerDashboardNotesListHtml() {
  const activeNote = plannerActiveNote();
  if (!plannerState.notes.length) {
    return (
      '<div class="home-note-empty">' +
      escapeHtml(localizeText("Chưa có note nào. Tạo note mới để bắt đầu.", "No notes yet. Create one to start writing.")) +
      "</div>"
    );
  }
  return (
    '<div class="home-note-list planner-dashboard-note-list">' +
    plannerState.notes
      .slice()
      .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
      .map((note) =>
        '<button type="button" class="home-note-chip' + (activeNote && activeNote.id === note.id ? " is-active" : "") + '" data-planner-note-open="' + escapeHtml(note.id) + '">' +
        '<strong>' + escapeHtml(note.title) + "</strong>" +
        '<span>' + escapeHtml((note.content || localizeText("Note trống, bấm để viết.", "Empty note, click to edit.")).slice(0, 96)) + "</span>" +
        "</button>"
      ).join("") +
    "</div>"
  );
}

function plannerDashboardNoteEditorHtml() {
  const note = plannerActiveNote();
  if (!note) {
    return (
      '<div class="home-note-empty">' +
      escapeHtml(localizeText("Chọn một note để chỉnh sửa hoặc tạo note mới.", "Pick a note to edit or create a new one.")) +
      "</div>"
    );
  }
  return (
    '<div class="planner-dashboard-note-editor">' +
    '<div class="home-mini-head"><strong>' + escapeHtml(localizeText("Đang chỉnh note", "Editing note")) + "</strong><span>" +
    escapeHtml(note.pinned ? localizeText("Đã ghim", "Pinned") : localizeText("Bản nháp", "Draft")) + "</span></div>" +
    '<input class="settings-text-input planner-dashboard-note-title" data-planner-note-title="' + escapeHtml(note.id) +
    '" maxlength="80" value="' + escapeHtml(note.title) + '" placeholder="' +
    escapeHtml(localizeText("Tiêu đề note", "Note title")) + '">' +
    '<textarea class="home-quick-note-input planner-dashboard-note-body" data-planner-note-content="' + escapeHtml(note.id) +
    '" rows="8" maxlength="5000" placeholder="' +
    escapeHtml(localizeText("Viết note, checklist hoặc ý tưởng ở đây...", "Write notes, checklists, or ideas here...")) +
    '">' + escapeHtml(note.content) + "</textarea>" +
    '<div class="planner-dashboard-inline-actions">' +
    '<button type="button" class="home-inline-btn" data-planner-note-new="true">' + escapeHtml(localizeText("Note mới", "New note")) + "</button>" +
    '<button type="button" class="home-inline-btn" data-planner-note-pin="' + escapeHtml(note.id) + '">' +
    escapeHtml(note.pinned ? localizeText("Bỏ ghim", "Unpin") : localizeText("Ghim note", "Pin note")) + "</button>" +
    '<button type="button" class="home-inline-btn" data-planner-note-convert="' + escapeHtml(note.id) + '">' +
    escapeHtml(localizeText("Ra task", "To task")) + "</button>" +
    '<button type="button" class="home-inline-btn" data-planner-note-delete="' + escapeHtml(note.id) + '">' +
    escapeHtml(localizeText("Xóa", "Delete")) + "</button>" +
    "</div></div>"
  );
}

function plannerDashboardMarkup() {
  const snapshot = plannerOverviewSnapshot();
  return (
    '<section class="home-overview home-dashboard planner-dashboard" data-planner-studio="true">' +
    '<section class="home-welcome planner-dashboard-hero">' +
    '<div class="home-welcome-copy"><div class="eyebrow">Dashboard</div>' +
    '<h2>' + escapeHtml(localizeText("Task và note gọn theo kiểu dashboard", "Tasks and notes in the dashboard style")) + "</h2>" +
    '<p>' + escapeHtml(localizeText(
      "Bỏ Flow Desk riêng lẻ để phần ghi chú, task và timeline đi cùng một ngôn ngữ giao diện với dashboard.",
      "The old Flow Desk module is replaced so notes, tasks, and timeline follow the same visual language as the dashboard.",
    )) + "</p></div>" +
    '<div class="planner-dashboard-hero-actions">' +
    '<form class="planner-quick-add-form planner-dashboard-quick-add" data-planner-quick-add-form="true">' +
    '<input class="settings-text-input planner-quick-add-input" name="quickAdd" maxlength="160" placeholder="' +
    escapeHtml(localizeText("Nhập nhanh tên task để tạo mới", "Type a task title for quick capture")) + '">' +
    '<button type="submit" class="home-quick-btn primary">' + escapeHtml(localizeText("Thêm task", "Add task")) + "</button>" +
    "</form>" +
    '<button type="button" class="home-quick-btn" data-planner-note-new="true">' + escapeHtml(localizeText("Tạo note", "New note")) + "</button>" +
    "</div>" +
    '<div class="home-stat-grid planner-dashboard-summary">' +
    '<article class="home-stat-card primary"><span>' + escapeHtml(localizeText("Tổng task", "Total tasks")) + "</span><strong>" + String(snapshot.total) + "</strong></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Hoàn thành", "Done")) + "</span><strong>" + String(snapshot.done) + "</strong><small>" + escapeHtml(localizeText("task đã xong", "tasks finished")) + "</small></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Đang làm", "In progress")) + "</span><strong>" + String(snapshot.active) + "</strong><small>" + escapeHtml(localizeText("task đang chạy", "tasks active")) + "</small></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Sắp đến hạn", "Due soon")) + "</span><strong>" + String(snapshot.dueSoon) + "</strong><small>" + escapeHtml(localizeText("cần ưu tiên", "need attention")) + "</small></article>" +
    "</div></section>" +
    '<div class="planner-dashboard-grid">' +
    '<div class="planner-dashboard-main">' +
    '<section class="home-block planner-dashboard-block"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Task queue", "Task queue")) + "</strong><span>" +
    escapeHtml(localizeText("Nhóm theo trạng thái, mở chi tiết ở panel bên phải", "Grouped by status, edit details in the side panel")) + "</span></div>" +
    '<div class="planner-dashboard-status-grid">' +
    plannerDashboardStatusColumnHtml("todo") +
    plannerDashboardStatusColumnHtml("progress") +
    plannerDashboardStatusColumnHtml("done") +
    "</div></section>" +
    '<section class="home-block planner-dashboard-block"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Nhịp hôm nay", "Today's flow")) + "</strong><span>" +
    escapeHtml(localizeText("Timeline và việc sắp tới hạn", "Timeline and near-deadline tasks")) + "</span></div>" +
    '<div class="home-support-grid">' + plannerDashboardDueSoonHtml() + plannerDashboardTimelineHtml() + "</div></section>" +
    "</div>" +
    '<aside class="planner-dashboard-side">' +
    '<section class="home-block planner-dashboard-block"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Chi tiết task", "Task details")) + "</strong><span>" +
    escapeHtml(localizeText("Tạo mới hoặc chỉnh task đang chọn", "Create a new task or edit the selected one")) + "</span></div>" +
    plannerDashboardTaskFormHtml() + "</section>" +
    '<section class="home-block planner-dashboard-block"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Notes", "Notes")) + "</strong><span>" +
    escapeHtml(localizeText(String(plannerState.notes.length) + " note đang lưu", String(plannerState.notes.length) + " saved notes")) + "</span></div>" +
    plannerDashboardNotesListHtml() + plannerDashboardNoteEditorHtml() + "</section>" +
    "</aside></div></section>"
  );
}

function plannerStudioMarkup() {
  return (
    '<section class="planner-studio" data-planner-studio="true">' +
    '<section class="planner-hero">' +
    '<div class="planner-hero-copy"><div class="eyebrow">Flow Desk</div><h3>' +
    escapeHtml(localizeText("Notes, task và timeline trong một khối", "Notes, tasks, and timeline in one block")) +
    '</h3><p>' +
    escapeHtml(localizeText(
      "Một khu planner tách biệt hoàn toàn khỏi chat: quick add, Kanban, list view và sticky note nổi nhiều lớp như một bàn làm việc số.",
      "A planner block isolated from chat: quick add, Kanban, list view, and layered sticky notes like a digital desk.",
    )) +
    '</p></div>' +
    '<div class="planner-hero-actions">' +
    '<form class="planner-quick-add-form" data-planner-quick-add-form="true">' +
    '<input class="settings-text-input planner-quick-add-input" name="quickAdd" maxlength="160" placeholder="' +
    escapeHtml(localizeText("Quick Add: nhập tiêu đề task để tạo nhanh", "Quick Add: type a task title for quick capture")) +
    '">' +
    '<div class="planner-quick-add-actions">' +
    '<button type="submit" class="btn" data-planner-quick-submit="task">' + escapeHtml(localizeText("Task", "Task")) + "</button>" +
    "</div></form>" +
    '<button type="button" class="planner-note-launch-btn" data-planner-note-new="true">' +
    escapeHtml(localizeText("Sticky note", "Sticky note")) +
    "</button></div></section>" +
    plannerOverviewHtml() +
    '<section class="planner-toolbar">' +
    '<label class="preview-search planner-search">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="5.5"></circle><path d="M16 16l4 4"></path></svg>' +
    '<input type="search" data-planner-search="true" placeholder="' + escapeHtml(localizeText("Search task, tag, project...", "Search tasks, tags, projects...")) +
    '" value="' + escapeHtml(plannerState.searchText) + '"></label>' +
    '<select class="settings-select-input" data-planner-filter="priority">' +
    '<option value="all">' + escapeHtml(localizeText("Mọi priority", "All priorities")) + "</option>" +
    PLANNER_PRIORITY_OPTIONS.map((priority) =>
      '<option value="' + priority + '"' + (plannerState.priorityFilter === priority ? " selected" : "") + ">" +
      escapeHtml(plannerPriorityLabel(priority)) + "</option>"
    ).join("") + '</select>' +
    '<select class="settings-select-input" data-planner-filter="status">' +
    '<option value="all">' + escapeHtml(localizeText("Mọi status", "All statuses")) + "</option>" +
    PLANNER_STATUS_OPTIONS.map((status) =>
      '<option value="' + status + '"' + (plannerState.statusFilter === status ? " selected" : "") + ">" +
      escapeHtml(plannerStatusLabel(status)) + "</option>"
    ).join("") + '</select>' +
    '<select class="settings-select-input" data-planner-filter="deadline">' +
    '<option value="all">' + escapeHtml(localizeText("Mọi deadline", "All deadlines")) + '</option>' +
    '<option value="today"' + (plannerState.deadlineFilter === "today" ? " selected" : "") + '>' + escapeHtml(localizeText("Hôm nay", "Today")) + '</option>' +
    '<option value="upcoming"' + (plannerState.deadlineFilter === "upcoming" ? " selected" : "") + '>' + escapeHtml(localizeText("Sắp tới", "Upcoming")) + '</option>' +
    '<option value="overdue"' + (plannerState.deadlineFilter === "overdue" ? " selected" : "") + '>' + escapeHtml(localizeText("Quá hạn", "Overdue")) + '</option>' +
    '</select>' +
    '<select class="settings-select-input" data-planner-filter="project">' +
    '<option value="all">' + escapeHtml(localizeText("Mọi project", "All projects")) + "</option>" +
    plannerProjectOptions().map((project) =>
      '<option value="' + escapeHtml(project) + '"' + (plannerState.projectFilter === project ? " selected" : "") + ">" +
      escapeHtml(project) + "</option>"
    ).join("") + '</select>' +
    '<div class="planner-view-toggle">' +
    '<button type="button" class="' + (plannerState.viewMode === "board" ? "active" : "") + '" data-planner-view="board">Board</button>' +
    '<button type="button" class="' + (plannerState.viewMode === "list" ? "active" : "") + '" data-planner-view="list">List</button>' +
    "</div>" +
    '<button type="button" class="planner-mini-btn" data-planner-filter-reset="true">' + escapeHtml(localizeText("Reset filter", "Reset filters")) + "</button>" +
    "</section>" +
    plannerWorkspaceHtml() +
    "</section>"
  );
}

function refreshPlannerStudioUi(panel = getPlannerStudioPanel()) {
  if (!panel) return;
  panel.innerHTML = plannerDashboardMarkup();
  refreshPlannerLiveUi();
}

function renderPlannerFloatingNotes() {
  const layer = ensurePlannerFloatingLayer();
  layer.innerHTML = "";
  document.body.classList.remove("planner-note-layer-open");
  return;
  const openNotes = plannerState.notes
    .filter((note) => note.isOpen)
    .sort((left, right) => Number(left.z || 0) - Number(right.z || 0));
  layer.innerHTML = openNotes
    .map((note) => {
      return (
        '<article class="planner-note-window' + (note.minimized ? " is-minimized" : "") +
        '" data-planner-note-window="' + escapeHtml(note.id) + '" data-color="' + escapeHtml(note.color) +
        '" style="left:' + String(note.x) + "px;top:" + String(note.y) + "px;z-index:" + String(note.z) + ';">' +
        '<header class="planner-note-window-head" data-planner-note-drag="' + escapeHtml(note.id) + '">' +
        '<div class="planner-note-window-kicker"><span></span>' + escapeHtml(note.pinned ? localizeText("Ghim", "Pinned") : localizeText("Sticky note", "Sticky note")) + "</div>" +
        '<div class="planner-note-window-actions">' +
        '<button type="button" data-planner-note-pin="' + escapeHtml(note.id) + '">' + escapeHtml(note.pinned ? "•" : "○") + "</button>" +
        '<button type="button" data-planner-note-minimize="' + escapeHtml(note.id) + '">' + escapeHtml(note.minimized ? "+" : "–") + "</button>" +
        '<button type="button" data-planner-note-close="' + escapeHtml(note.id) + '">×</button>' +
        "</div></header>" +
        '<div class="planner-note-window-body">' +
        '<input class="planner-note-title-input" data-planner-note-title="' + escapeHtml(note.id) + '" maxlength="80" value="' + escapeHtml(note.title) + '">' +
        '<textarea class="planner-note-body-input" data-planner-note-content="' + escapeHtml(note.id) + '" rows="8" maxlength="5000" placeholder="' +
        escapeHtml(localizeText("Viết note, checklist hoặc ý tưởng ở đây...", "Write notes, checklists, or ideas here...")) +
        '">' + escapeHtml(note.content) + '</textarea>' +
        '<div class="planner-note-palette">' +
        PLANNER_NOTE_COLOR_OPTIONS.map((color) =>
          '<button type="button" class="' + (note.color === color ? "active" : "") +
          '" data-planner-note-color="' + escapeHtml(note.id) + '" data-color-value="' + escapeHtml(color) + '"></button>'
        ).join("") +
        "</div></div></article>"
      );
    })
    .join("");
  document.body.classList.toggle("planner-note-layer-open", Boolean(openNotes.length));
}

function refreshPlannerLiveUi(now = Date.now()) {
  document.querySelectorAll("[data-planner-task-deadline]").forEach((node) => {
    const task = getPlannerTaskById(node.getAttribute("data-planner-task-deadline"));
    if (!task) return;
    node.textContent = plannerDeadlineState(task, now).copy;
  });
  document.querySelectorAll("[data-planner-task-tracked]").forEach((node) => {
    const task = getPlannerTaskById(node.getAttribute("data-planner-task-tracked"));
    if (!task) {
      node.textContent = localizeText("Chưa có", "No data");
      return;
    }
    node.textContent = localizeText("Đã track ", "Tracked ") + formatPlannerTrackedMs(getPlannerTaskTrackedMs(task, now));
  });
  document.querySelectorAll("[data-planner-task-progress]").forEach((node) => {
    const task = getPlannerTaskById(node.getAttribute("data-planner-task-progress"));
    if (!task) return;
    node.style.width = String(Math.round(getPlannerTaskProgressRatio(task, now) * 100)) + "%";
  });
}

function openPlannerNoteWindow(noteId) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  plannerState.notes.forEach((item) => {
    item.isOpen = item.id === note.id;
    item.minimized = false;
  });
  note.isOpen = true;
  note.minimized = false;
  if (!Number.isFinite(note.x) || !Number.isFinite(note.y) || (!note.x && !note.y)) {
    const next = nextPlannerNotePosition();
    note.x = next.x;
    note.y = next.y;
  }
  bringPlannerNoteToFront(noteId, false);
  note.updatedAt = Date.now();
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
}

function closePlannerNoteWindow(noteId) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  note.isOpen = false;
  note.updatedAt = Date.now();
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
}

function togglePlannerNotePinned(noteId) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  note.pinned = !note.pinned;
  note.updatedAt = Date.now();
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
}

function togglePlannerNoteMinimized(noteId) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  note.minimized = !note.minimized;
  note.updatedAt = Date.now();
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
}

function deletePlannerNote(noteId) {
  plannerState.notes = plannerState.notes.filter((note) => note.id !== String(noteId || ""));
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
}

function convertPlannerNoteToTask(noteId) {
  const note = getPlannerNoteById(noteId);
  if (!note) return false;
  const task = createPlannerTask({
    title: normalizePlannerSingleLine(note.title, 120) || localizeText("Task từ note", "Task from note"),
    description: note.content,
    project: activeChannel.type === "group" ? normalizePlannerSingleLine(activeChannel.name, 64) : "",
    tag: localizeText("From note", "From note"),
    priority: note.pinned ? "high" : "medium",
    status: "todo",
    estimateMinutes: 30,
  });
  plannerState.tasks.unshift(task);
  plannerState.selectedTaskId = task.id;
  note.updatedAt = Date.now();
  persistPlannerState();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
  return true;
}

function createPlannerStickyNote(seedTitle, seedContent) {
  const nextPosition = nextPlannerNotePosition();
  plannerState.noteZCounter = Math.max(1, Number(plannerState.noteZCounter) || 1) + 1;
  plannerState.notes.forEach((note) => {
    note.isOpen = false;
    note.minimized = false;
  });
  plannerState.notes.unshift(
    createPlannerNote({
      title: seedTitle,
      content: seedContent,
      color: PLANNER_NOTE_COLOR_OPTIONS[plannerState.notes.length % PLANNER_NOTE_COLOR_OPTIONS.length],
      isOpen: true,
      minimized: false,
      x: nextPosition.x,
      y: nextPosition.y,
      z: plannerState.noteZCounter,
      updatedAt: Date.now(),
    }),
  );
  persistPlannerState();
  renderPlannerFloatingNotes();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
}

function updatePlannerNoteField(noteId, field, value) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  if (field === "title") {
    note.title = normalizePlannerSingleLine(value, 80) || localizeText("Ghi chú mới", "New note");
  } else if (field === "content") {
    note.content = normalizePlannerTextBlock(value, 5000);
  } else if (field === "color") {
    note.color = normalizePlannerNoteColor(value);
  }
  note.updatedAt = Date.now();
  persistPlannerState();
  refreshHomeOverviewIfNeeded();
}

function selectPlannerTask(taskId) {
  plannerState.selectedTaskId = String(taskId || "");
  persistPlannerState();
  refreshPlannerStudioUi();
}

function resetPlannerTaskSelection() {
  plannerState.selectedTaskId = "";
  persistPlannerState();
  refreshPlannerStudioUi();
}

function upsertPlannerTask(payload) {
  const normalized = createPlannerTask(payload);
  if (!normalized.title) return false;
  const existing = getPlannerTaskById(payload.taskId || payload.id);
  if (existing) {
    Object.assign(existing, normalized, {
      id: existing.id,
      createdAt: existing.createdAt,
      trackedMs: existing.trackedMs,
      updatedAt: Date.now(),
    });
    plannerState.selectedTaskId = existing.id;
  } else {
    normalized.updatedAt = Date.now();
    plannerState.tasks.unshift(normalized);
    plannerState.selectedTaskId = normalized.id;
  }
  persistPlannerState();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
  return true;
}

function setPlannerTaskStatus(taskId, status) {
  const task = getPlannerTaskById(taskId);
  if (!task) return;
  task.status = normalizePlannerStatus(status);
  task.updatedAt = Date.now();
  if (task.status === "done" && plannerState.activeTaskId === task.id) {
    stopPlannerTaskTimer(Date.now());
  }
  persistPlannerState();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
}

function togglePlannerTaskDone(taskId) {
  const task = getPlannerTaskById(taskId);
  if (!task) return;
  setPlannerTaskStatus(task.id, task.status === "done" ? "todo" : "done");
}

function removePlannerTask(taskId) {
  const targetId = String(taskId || "");
  if (plannerState.activeTaskId === targetId) {
    stopPlannerTaskTimer(Date.now());
  }
  plannerState.tasks = plannerState.tasks.filter((task) => task.id !== targetId);
  if (plannerState.selectedTaskId === targetId) {
    plannerState.selectedTaskId = "";
  }
  persistPlannerState();
  refreshPlannerStudioUi();
  refreshHomeOverviewIfNeeded();
}

function quickAddPlannerTask(rawValue) {
  const text = normalizePlannerSingleLine(rawValue, 160);
  if (!text) return false;
  plannerState.tasks.unshift(
    createPlannerTask({
      title: text,
      description: "",
      priority: "medium",
      status: "todo",
      tag: localizeText("Quick add", "Quick add"),
      project: "",
      estimateMinutes: 30,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
  );
  plannerState.selectedTaskId = plannerState.tasks[0].id;
  persistPlannerState();
  refreshPlannerStudioUi();
  return true;
}

function startPlannerNoteDrag(noteId, clientX, clientY) {
  const note = getPlannerNoteById(noteId);
  if (!note) return;
  bringPlannerNoteToFront(noteId, false);
  plannerNoteDragState = {
    noteId,
    offsetX: clientX - Number(note.x || 0),
    offsetY: clientY - Number(note.y || 0),
  };
  document.body.classList.add("planner-note-dragging");
  renderPlannerFloatingNotes();
}

function updatePlannerNoteDrag(clientX, clientY) {
  if (!plannerNoteDragState) return;
  const note = getPlannerNoteById(plannerNoteDragState.noteId);
  if (!note) return;
  note.x = Math.max(12, Math.min(window.innerWidth - 332, clientX - plannerNoteDragState.offsetX));
  note.y = Math.max(60, Math.min(window.innerHeight - 120, clientY - plannerNoteDragState.offsetY));
  note.updatedAt = Date.now();
  const node = ensurePlannerFloatingLayer().querySelector(
    '[data-planner-note-window="' + note.id + '"]',
  );
  if (node) {
    node.style.left = String(note.x) + "px";
    node.style.top = String(note.y) + "px";
  }
}

function stopPlannerNoteDrag() {
  if (!plannerNoteDragState) return;
  plannerNoteDragState = null;
  document.body.classList.remove("planner-note-dragging");
  persistPlannerState();
}

function createLegacyStudyNotesPanel() {
  const panel = document.createElement("section");
  panel.className = "study-notes-panel";
  panel.dataset.studyNotebookPanel = "true";

  const intro = document.createElement("section");
  intro.className = "study-notes-intro";
  intro.innerHTML =
    '<div class="eyebrow">Workspace notes</div>' +
    "<h3>Notes & To-do</h3>" +
    "<p>" +
    localizeText(
      "Tách riêng khỏi Time để bạn ghi việc theo kiểu Notion mà không làm rối đồng hồ.",
      "Kept separate from Time so you can manage Notion-style notes without crowding the timer.",
    ) +
    "</p>";

  panel.append(intro, createStudyNotebookSection());
  refreshStudyNotebookUi(panel);
  return panel;
}

function createStudyNotesPanel() {
  const panel = document.createElement("section");
  panel.className = "study-notes-panel";
  panel.dataset.studyNotebookPanel = "true";
  panel.dataset.plannerStudio = "true";
  refreshPlannerStudioUi(panel);
  renderPlannerFloatingNotes();
  return panel;
}

function setFriendCardCollapsed(collapsed) {
  if (!el.friendCard || !el.friendCardToggle) return;
  if (!collapsed && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  el.friendCard.classList.toggle("is-collapsed", collapsed);
  syncSocialActionToggle();
  saveStoredFlag(FRIEND_CARD_STORAGE_KEY, collapsed);
}

function loadFriendCardPreference() {
  return loadStoredFlag(FRIEND_CARD_STORAGE_KEY, true);
}

function syncSocialActionToggle() {
  if (!el.previewSocialActionIdle || !el.newGroupToggleInput || !el.friendCardToggleInput) return;
  if (isCreateGroupPopoverOpen()) {
    el.newGroupToggleInput.checked = true;
    return;
  }
  if (el.friendCard && !el.friendCard.classList.contains("is-collapsed")) {
    el.friendCardToggleInput.checked = true;
    return;
  }
  el.previewSocialActionIdle.checked = true;
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

function positionStudyNotesPopover() {
  positionFlyout(el.studyNotesPopover, el.studyNotesToggleButton);
}

function positionInboxPanel() {
  positionFlyout(el.utilityPanel, el.notificationToggleButton);
}

function isSettingsPopoverOpen() {
  return document.body.classList.contains("settings-open");
}

function isCreateGroupPopoverOpen() {
  return document.body.classList.contains("create-group-open");
}

function isStudyTimerPopoverOpen() {
  return document.body.classList.contains("study-timer-open");
}

function isStudyNotesPopoverOpen() {
  return document.body.classList.contains("study-notes-open");
}

function isInboxPanelOpen() {
  return document.body.classList.contains("inbox-open");
}

function syncFlyoutScrim() {
  const isOpen =
    isSettingsPopoverOpen() ||
    isCreateGroupPopoverOpen() ||
    isStudyTimerPopoverOpen() ||
    isStudyNotesPopoverOpen() ||
    isInboxPanelOpen();
  document.body.classList.toggle("flyout-open", isOpen);
  el.settingsScrim.hidden = !isOpen;
}

function setSettingsPopoverOpen(nextOpen) {
  if (nextOpen && isInboxPanelOpen()) {
    setInboxPanelOpen(false);
  }
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  if (nextOpen && isStudyTimerPopoverOpen()) {
    setStudyTimerPopoverOpen(false);
  }
  if (nextOpen && isStudyNotesPopoverOpen()) {
    setStudyNotesPopoverOpen(false);
  }
  document.body.classList.toggle("settings-open", nextOpen);
  el.settingsPopover.setAttribute("aria-hidden", String(!nextOpen));
  el.settingsToggleButton.classList.toggle("active", nextOpen);
  el.settingsToggleButton.setAttribute("aria-pressed", String(nextOpen));
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
  if (nextOpen && isInboxPanelOpen()) {
    setInboxPanelOpen(false);
  }
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  if (nextOpen && isStudyTimerPopoverOpen()) {
    setStudyTimerPopoverOpen(false);
  }
  if (nextOpen && isStudyNotesPopoverOpen()) {
    setStudyNotesPopoverOpen(false);
  }
  if (nextOpen && el.friendCard && !el.friendCard.classList.contains("is-collapsed")) {
    setFriendCardCollapsed(true);
  }
  document.body.classList.toggle("create-group-open", nextOpen);
  el.createGroupPopover.setAttribute("aria-hidden", String(!nextOpen));
  syncSocialActionToggle();
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(() => {
      positionCreateGroupPopover();
      el.createGroupNameInput.focus();
    });
  }
}

function closeCreateGroupPopover() {
  setCreateGroupPopoverOpen(false);
}

function openCreateGroupPopover() {
  setCreateGroupPopoverOpen(true);
}

function setStudyTimerPopoverOpen(nextOpen) {
  if (nextOpen && isInboxPanelOpen()) {
    setInboxPanelOpen(false);
  }
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  if (nextOpen && isStudyNotesPopoverOpen()) {
    setStudyNotesPopoverOpen(false);
  }
  document.body.classList.toggle("study-timer-open", nextOpen);
  el.studyTimerPopover.setAttribute("aria-hidden", String(!nextOpen));
  el.studyTimerToggleButton.classList.toggle("active", nextOpen);
  el.studyTimerToggleButton.setAttribute("aria-pressed", String(nextOpen));
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(() => {
      refreshStudyTimerUi();
      const primaryButton = el.studyTimerPopover.querySelector("[data-study-action='toggle']");
      if (primaryButton) primaryButton.focus();
    });
  }
}

function closeStudyTimerPopover() {
  setStudyTimerPopoverOpen(false);
}

function toggleStudyTimerPopover() {
  setStudyTimerPopoverOpen(!isStudyTimerPopoverOpen());
}

function setStudyNotesPopoverOpen(nextOpen) {
  if (!el.studyNotesPopover || !el.studyNotesToggleButton) {
    document.body.classList.remove("study-notes-open");
    syncFlyoutScrim();
    return;
  }
  if (nextOpen && isInboxPanelOpen()) {
    setInboxPanelOpen(false);
  }
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  if (nextOpen && isStudyTimerPopoverOpen()) {
    setStudyTimerPopoverOpen(false);
  }
  document.body.classList.toggle("study-notes-open", nextOpen);
  el.studyNotesPopover.setAttribute("aria-hidden", String(!nextOpen));
  el.studyNotesToggleButton.classList.toggle("active", nextOpen);
  el.studyNotesToggleButton.setAttribute("aria-pressed", String(nextOpen));
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(() => {
      positionStudyNotesPopover();
      refreshPlannerStudioUi();
      renderPlannerFloatingNotes();
      const quickAddInput = el.studyNotesPopover.querySelector(".planner-quick-add-input");
      if (quickAddInput) quickAddInput.focus();
    });
  }
}

function closeStudyNotesPopover() {
  setStudyNotesPopoverOpen(false);
}

function toggleStudyNotesPopover() {
  setStudyNotesPopoverOpen(!isStudyNotesPopoverOpen());
}

function toggleCreateGroupPopover() {
  setCreateGroupPopoverOpen(!isCreateGroupPopoverOpen());
}

function logout() {
  closeSettingsPopover();
  closeCreateGroupPopover();
  closeStudyNotesPopover();
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

function syncInboxToggleState() {
  const open = isInboxPanelOpen();
  el.notificationToggleButton.classList.toggle("active", open);
  el.notificationToggleButton.setAttribute("aria-pressed", String(open));
}

function setInboxPanelOpen(nextOpen) {
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  if (nextOpen && isStudyTimerPopoverOpen()) {
    setStudyTimerPopoverOpen(false);
  }
  if (nextOpen && isStudyNotesPopoverOpen()) {
    setStudyNotesPopoverOpen(false);
  }
  document.body.classList.toggle("inbox-open", nextOpen);
  el.utilityPanel.setAttribute("aria-hidden", String(!nextOpen));
  syncInboxToggleState();
  syncFlyoutScrim();
  if (nextOpen) {
    requestAnimationFrame(() => {
      positionInboxPanel();
      el.closeInboxButton.focus();
    });
  }
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
  const canAttach = activeChannel.type === "direct" || activeChannel.type === "group";
  el.messageInput.disabled = !inConversation;
  el.sendBtn.disabled = !inConversation;
  el.attachBtn.disabled = !canAttach;
  if (!inConversation) {
    el.messageInput.placeholder = "Pick a chat to start typing...";
  } else if (activeChannel.type === "direct") {
    el.messageInput.placeholder = "Write a message or add a caption...";
  } else {
    el.messageInput.placeholder = "Write a message...";
  }
}

function setConnectionState(text, online) {
  el.connectionState.textContent = text;
  el.connectionState.className = "status-pill " + (online ? "online" : "delayed");
  syncComposer();
}

function setMessagesSurfaceMode(mode) {
  el.messagesArea.classList.toggle("home-mode", mode === "home");
  el.messagesArea.classList.toggle("empty-mode", mode === "empty");
  el.messagesArea.classList.toggle("conversation-mode", mode === "conversation");
}

function clearMessages(title, copy, kicker) {
  setMessagesSurfaceMode("empty");
  el.messagesArea.innerHTML =
    '<div class="empty-state">' +
    (kicker ? '<div class="eyebrow">' + kicker + "</div>" : "") +
    "<h2>" +
    title +
    '</h2><div class="muted">' +
    copy +
    "</div></div>";
}

function formatDashboardDuration(ms) {
  return formatPlannerTrackedMs(Math.max(0, Number(ms) || 0));
}

function homeTodayTasksSnapshot() {
  const todayKey = plannerDayKey();
  let tasks = plannerState.tasks.filter((task) =>
    plannerDayKey(task.scheduledAt) === todayKey || plannerDayKey(task.deadline) === todayKey
  );
  if (!tasks.length) {
    tasks = plannerState.tasks
      .slice()
      .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
  }
  const ordered = tasks
    .slice()
    .sort((left, right) => {
      if ((left.status === "done") !== (right.status === "done")) {
        return left.status === "done" ? 1 : -1;
      }
      const leftTime = Date.parse(left.deadline || left.scheduledAt || "") || Number.MAX_SAFE_INTEGER;
      const rightTime = Date.parse(right.deadline || right.scheduledAt || "") || Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    })
    .slice(0, 5);
  return {
    tasks: ordered,
    total: tasks.length,
    done: tasks.filter((task) => task.status === "done").length,
  };
}

function homeContinueLearningItems() {
  return plannerState.tasks
    .filter((task) => task.status !== "done")
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
    .slice(0, 3)
    .map((task) => ({
      kind: "task",
      value: task.id,
      kicker:
        task.status === "progress"
          ? localizeText("Đang làm", "In progress")
          : localizeText("Todo", "Todo"),
      title: task.title || task.project || localizeText("Untitled task", "Untitled task"),
      meta: [task.project, task.tag].filter(Boolean).join(" / ") || plannerStatusLabel(task.status),
      detail: task.deadline
        ? plannerDeadlineState(task).copy
        : task.status === "progress"
          ? localizeText("Đang thực hiện", "Currently in progress")
          : localizeText("Chưa hoàn thành", "Pending"),
    }));
}

function homeTimelineItems() {
  const todayKey = plannerDayKey();
  return plannerState.tasks
    .filter((task) => {
      if (task.status === "done") return false;
      return plannerDayKey(task.scheduledAt) === todayKey || plannerDayKey(task.deadline) === todayKey;
    })
    .sort((left, right) => {
      const leftTime = Date.parse(left.scheduledAt || left.deadline || "") || Number.MAX_SAFE_INTEGER;
      const rightTime = Date.parse(right.scheduledAt || right.deadline || "") || Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    })
    .slice(0, 4);
}

function homeActivityItems() {
  const items = [];
  const pendingInvites =
    socialState.incomingFriendRequests.length + socialState.groupInvitations.length;
  if (pendingInvites) {
    items.push({
      kind: "inbox",
      value: "true",
      title: pendingInvites === 1
        ? localizeText("Có 1 lời mời mới", "1 new invite waiting")
        : localizeText("Có " + String(pendingInvites) + " cập nhật mới", String(pendingInvites) + " new updates"),
      meta: localizeText("Mở thông báo để xem ngay.", "Open notifications to review them."),
    });
  }

  groups.slice(0, 2).forEach((group) => {
    items.push({
      kind: "group",
      value: group.id,
      title: group.name || "Study Group",
      meta: getPreview("group", group.id, group.category || localizeText("Nhóm đang hoạt động", "Group is active")),
    });
  });

  socialState.friends.slice(0, Math.max(0, 4 - items.length)).forEach((friend) => {
    items.push({
      kind: "direct",
      value: friend.email,
      title: displayName(friend),
      meta: getPreview("direct", normalizeEmail(friend.email), localizeText("Tin nhắn cá nhân", "Direct conversation")),
    });
  });

  return items.slice(0, 4);
}

function homePinnedNotes(limit = 3) {
  return plannerState.notes
    .filter((note) => note.pinned)
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
    .slice(0, limit);
}

function homeActionAttribute(kind, value) {
  if (kind === "task") {
    return 'data-home-open-task="' + escapeHtml(value) + '"';
  }
  if (kind === "group") {
    return 'data-home-open-group="' + escapeHtml(value) + '"';
  }
  if (kind === "direct") {
    return 'data-home-open-direct="' + escapeHtml(value) + '"';
  }
  if (kind === "note") {
    return 'data-home-open-note="' + escapeHtml(value) + '"';
  }
  return 'data-home-open-inbox="true"';
}

function homeContinueCardsHtml(items) {
  if (!items.length) {
    return (
      '<div class="home-block-empty">' +
      escapeHtml(localizeText("Chưa có việc nào chưa hoàn thành. Hãy tạo task mới từ Quick Actions.", "No unfinished tasks yet. Create one from Quick Actions.")) +
      "</div>"
    );
  }
  return items.map((item) =>
    '<button type="button" class="home-continue-card" ' + homeActionAttribute(item.kind, item.value) + ">" +
    '<span class="home-card-kicker">' + escapeHtml(item.kicker) + "</span>" +
    '<strong>' + escapeHtml(item.title) + "</strong>" +
    '<span class="home-card-meta">' + escapeHtml(item.meta) + "</span>" +
    '<span class="home-card-detail">' + escapeHtml(item.detail) + "</span>" +
    "</button>"
  ).join("");
}

function homeActivityHtml(items) {
  if (!items.length) {
    return (
      '<div class="home-block-empty">' +
      escapeHtml(localizeText("Chưa có hoạt động nổi bật. Khi có chat mới hoặc lời mời, phần này sẽ sáng lên.", "No activity yet. New chats and invites will surface here.")) +
      "</div>"
    );
  }
  return '<div class="home-feed-list">' + items.map((item) =>
    '<button type="button" class="home-feed-item" ' + homeActionAttribute(item.kind, item.value) + ">" +
    '<strong>' + escapeHtml(item.title) + "</strong>" +
    '<span>' + escapeHtml(item.meta) + "</span>" +
    "</button>"
  ).join("") + "</div>";
}

function homeTimelineHtml(items) {
  if (!items.length) {
    return (
      '<div class="home-note-empty">' +
      escapeHtml(localizeText("Chưa có mốc giờ nào cho hôm nay.", "No scheduled slots for today yet.")) +
      "</div>"
    );
  }
  return '<div class="home-timeline-list">' + items.map((task) => {
    const stamp = task.scheduledAt || task.deadline;
    return (
      '<button type="button" class="home-timeline-item" data-home-open-task="' + escapeHtml(task.id) + '">' +
      '<span>' + escapeHtml(plannerDateTimeLabel(stamp)) + "</span>" +
      '<strong>' + escapeHtml(task.title) + "</strong>" +
      '<small>' + escapeHtml(task.project || plannerStatusLabel(task.status)) + "</small>" +
      "</button>"
    );
  }).join("") + "</div>";
}

function homeHeatmapHtml(cells) {
  return (
    '<div class="home-heatmap-grid">' +
    cells.map((cell) =>
      '<span class="home-heatmap-cell" data-level="' + String(cell.level) + '" title="' +
      escapeHtml(cell.label + " • " + formatDashboardDuration(cell.studyMs)) + '"></span>'
    ).join("") +
    "</div>"
  );
}

function homeQuickNotePanelHtml() {
  return (
    '<div class="home-note-capture">' +
    '<div class="home-mini-head"><strong>' + escapeHtml(localizeText("Quick note", "Quick note")) +
    "</strong><button type=\"button\" class=\"home-inline-btn\" data-home-quick=\"planner\">" +
    escapeHtml(localizeText("Open planner", "Open planner")) +
    "</button></div>" +
    '<textarea class="home-quick-note-input" data-home-quick-note-input="true" rows="5" maxlength="1200" placeholder="' +
    escapeHtml(localizeText("Ghi nhanh ý tưởng, deadline hoặc việc vừa nảy ra khi đang học...", "Capture ideas, deadlines, or next steps while you are studying...")) +
    '">' + escapeHtml(plannerState.quickNote) + '</textarea>' +
    '<div class="home-note-capture-foot"><span>' +
    escapeHtml(localizeText("Autosave vào planner", "Autosaved into planner")) +
    "</span></div></div>"
  );
}

function homePinnedNotesHtml(notes) {
  if (!notes.length) {
    return (
      '<div class="home-note-empty">' +
      escapeHtml(localizeText("Ghim note quan trọng từ Notes để hiện ở đây.", "Pin important notes from Notes to surface them here.")) +
      "</div>"
    );
  }
  return '<div class="home-note-list">' + notes.map((note) =>
    '<button type="button" class="home-note-chip" ' + homeActionAttribute("note", note.id) + ">" +
    '<strong>' + escapeHtml(note.title) + "</strong>" +
    '<span>' + escapeHtml((note.content || localizeText("Mở note để viết thêm.", "Open note to keep writing.")).slice(0, 84)) + "</span>" +
    "</button>"
  ).join("") + "</div>";
}

function homeDashboardMarkup() {
  const todayStudyMs = dashboardStudyMsForDay();
  const streak = dashboardStudyStreak();
  const todayTasks = homeTodayTasksSnapshot();
  const continueItems = homeContinueLearningItems();
  const activityItems = homeActivityItems();
  const plannerOverview = plannerOverviewSnapshot();
  const weekStudyMs = dashboardStudyMsForRecentDays(7);
  const heatmapCells = dashboardStudyHeatmapCells(21);
  const pinnedNotes = homePinnedNotes();
  const timelineItems = homeTimelineItems();
  const todayTaskTotal = Math.max(todayTasks.total, todayTasks.tasks.length);
  const name = currentUser ? displayName(currentUser) : localizeText("bạn", "there");
  return (
    '<section class="home-overview home-dashboard">' +
    '<section class="home-welcome">' +
    '<div class="home-welcome-copy"><div class="eyebrow">Dashboard</div>' +
    '<h2>' + escapeHtml(localizeText("Xin chào " + name, "Hello " + name)) + "</h2>" +
    '<p>' + escapeHtml(localizeText("Quay lại đúng việc cần làm, theo dõi tiến độ và giữ note bám sát luồng học trong một màn hình gọn.", "Jump back into the right tasks, track progress, and keep notes close in one clean view.")) + "</p>" +
    '<div class="home-welcome-actions"><button type="button" class="home-quick-btn primary" data-home-quick="focus">' + escapeHtml(localizeText("Start 25m Focus", "Start 25m Focus")) + "</button></div></div>" +
    '<div class="home-stat-grid">' +
    '<article class="home-stat-card primary"><span>' + escapeHtml(localizeText("Hôm nay đã học", "Studied today")) + "</span><strong>" + escapeHtml(formatDashboardDuration(todayStudyMs)) + "</strong></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Streak", "Streak")) + "</span><strong>" + escapeHtml(String(streak)) + "</strong><small>" + escapeHtml(localizeText("ngày liên tiếp", "day streak")) + "</small></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Task hôm nay", "Today tasks")) + "</span><strong>" + escapeHtml(String(todayTasks.done) + "/" + String(todayTaskTotal)) + "</strong><small>" + escapeHtml(localizeText("hoàn thành", "completed")) + "</small></article>" +
    '<article class="home-stat-card"><span>' + escapeHtml(localizeText("Sắp đến hạn", "Due soon")) + "</span><strong>" + escapeHtml(String(plannerOverview.dueSoon)) + "</strong><small>" + escapeHtml(localizeText("task cần chú ý", "tasks to review")) + "</small></article>" +
    "</div></section>" +
    '<div class="home-dashboard-grid">' +
    '<section class="home-block continue"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Việc cần làm", "Todo")) + "</strong><span>" + escapeHtml(localizeText("Các mục chưa hoàn thành", "Unfinished items")) + "</span></div>" +
    '<div class="home-continue-grid">' + homeContinueCardsHtml(continueItems) + "</div></section>" +
    '<section class="home-block activity"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Chat / Activity", "Chat / Activity")) + "</strong><span>" + escapeHtml(localizeText("Những gì cần bạn chú ý", "Important updates")) + "</span></div>" +
    homeActivityHtml(activityItems) + "</section>" +
    '<section class="home-block progress"><div class="home-block-head"><strong>' + escapeHtml(localizeText("Stats / Progress", "Stats / Progress")) + "</strong><span>" + escapeHtml(localizeText("Heatmap, progress và note đã ghim", "Heatmap, progress, and pinned notes")) + "</span></div>" +
    '<div class="home-progress-grid">' +
    '<article class="home-progress-card"><span>' + escapeHtml(localizeText("Tuần này", "This week")) + "</span><strong>" + escapeHtml(formatDashboardDuration(weekStudyMs)) + "</strong></article>" +
    '<article class="home-progress-card"><span>' + escapeHtml(localizeText("Task xong", "Tasks done")) + "</span><strong>" + escapeHtml(String(plannerOverview.done)) + "</strong></article>" +
    '<article class="home-progress-card"><span>' + escapeHtml(localizeText("Đang làm", "In progress")) + "</span><strong>" + escapeHtml(String(plannerOverview.active)) + "</strong></article>" +
    "</div>" +
    '<div class="home-support-grid">' +
    '<div class="home-heatmap-panel"><div class="home-mini-head"><strong>' + escapeHtml(localizeText("Study Heatmap", "Study Heatmap")) + "</strong><span>" + escapeHtml(localizeText("21 ngày gần nhất", "Last 21 days")) + "</span></div>" +
    homeHeatmapHtml(heatmapCells) + "</div>" +
    '<div class="home-timeline-panel"><div class="home-mini-head"><strong>' + escapeHtml(localizeText("Timeline hôm nay", "Today timeline")) + "</strong><span>" + escapeHtml(localizeText("Theo giờ", "By hour")) + "</span></div>" +
    homeTimelineHtml(timelineItems) + "</div>" +
    homeQuickNotePanelHtml() +
    '<div class="home-pinned-panel"><div class="home-mini-head"><strong>' + escapeHtml(localizeText("Pinned Notes", "Pinned Notes")) + "</strong><span>" + escapeHtml(localizeText("Từ sticky notes", "From sticky notes")) + "</span></div>" +
    homePinnedNotesHtml(pinnedNotes) + "</div></div></section>" +
    "</div></section>"
  );
}

function openDashboardTaskPlanner(taskId) {
  if (taskId) {
    selectPlannerTask(taskId);
  } else {
    resetPlannerTaskSelection();
  }
  setStudyNotesPopoverOpen(true);
}

function openDashboardPlanner() {
  setStudyNotesPopoverOpen(true);
}

function openDashboardContinue() {
  const [firstItem] = homeContinueLearningItems();
  if (firstItem) {
    handleDashboardOpen(firstItem.kind, firstItem.value);
    return;
  }
  openDashboardTaskPlanner("");
}

function startDashboardFocusMode() {
  setStudyTimerMode("pomodoro");
  setStudyTimerPopoverOpen(true);
  if (!studyTimerState.isRunning) {
    startStudyTimer(Date.now());
  }
}

function handleDashboardOpen(kind, value) {
  if (kind === "task") {
    openDashboardTaskPlanner(value);
    return;
  }
  if (kind === "note") {
    openPlannerNoteWindow(value);
    setStudyNotesPopoverOpen(true);
    return;
  }
  if (kind === "group") {
    const group = groups.find((item) => String((item && item.id) || "") === String(value || ""));
    if (group) {
      selectGroup(group);
      return;
    }
  }
  if (kind === "direct") {
    const friend = socialState.friends.find((item) =>
      normalizeEmail(item.email) === normalizeEmail(value || "")
    );
    if (friend) {
      selectDirect(friend);
      return;
    }
  }
  openInboxPanel();
}

function renderHomeOverview(options = {}) {
  void options;
  clearMessages(
    localizeText("Chưa chọn cuộc trò chuyện", "No conversation selected"),
    localizeText(
      "Hãy chọn một đoạn chat hoặc nhóm ở danh sách bên trái để bắt đầu.",
      "Choose a chat or group from the left to start messaging.",
    ),
    "Inbox",
  );
}

function refreshHomeOverviewIfNeeded() {
  if (activeChannel.type !== "home" || !el.messagesArea) return;
  renderHomeOverview({ preserveScroll: true });
}

function selectDefaultConversation() {
  const firstFriend = socialState.friends.find((friend) => normalizeEmail(friend.email));
  if (firstFriend) {
    selectDirect(firstFriend);
    return true;
  }

  const firstGroup = groups.find((group) => String((group && group.id) || ""));
  if (firstGroup) {
    selectGroup(firstGroup);
    return true;
  }

  selectHome();
  return false;
}

function createFavoriteChip(label, avatarUrl, onClick, active) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-chip" + (active ? " active" : "");
  button.title = label;
  const avatar = document.createElement("span");
  avatar.className = "favorite-chip-avatar";
  syncAvatarNode(avatar, label, avatarUrl);
  button.appendChild(avatar);
  button.addEventListener("click", onClick);
  return button;
}

function renderFavoritesStrip() {
  if (!el.favoriteAvatars || !el.favoritesEmpty || !el.favoritesCount) return;
  el.favoriteAvatars.innerHTML = "";

  const chips = [];
  if (currentUser) {
    chips.push(
      createFavoriteChip(
        displayName(currentUser),
        currentUser.avatarUrl,
        () => selectDefaultConversation(),
        activeChannel.type === "home",
      ),
    );
  }

  socialState.friends.slice(0, 5).forEach((friend) => {
    const email = normalizeEmail(friend.email);
    chips.push(
      createFavoriteChip(
        displayName(friend),
        friend.avatarUrl || "",
        () => selectDirect(friend),
        activeChannel.type === "direct" && activeChannel.id === email,
      ),
    );
  });

  groups.slice(0, 2).forEach((group) => {
    chips.push(
      createFavoriteChip(
        group.name || "Study Group",
        "",
        () => selectGroup(group),
        activeChannel.type === "group" && String(activeChannel.id) === String(group.id),
      ),
    );
  });

  el.favoritesCount.textContent = String(chips.length);
  if (!chips.length) {
    el.favoritesEmpty.style.display = "block";
    el.favoriteAvatars.appendChild(el.favoritesEmpty);
    return;
  }
  el.favoritesEmpty.style.display = "none";
  chips.forEach((chip) => el.favoriteAvatars.appendChild(chip));
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
  el.createGroupForm.reset();
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
  const preferredLanguage = (currentUser && currentUser.preferredLanguage) || "vi";
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
    setCreateGroupFeedback("Enter a group name before creating the study group.", "error");
    return;
  }
  const invalidEmail = members.find((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  if (invalidEmail) {
    setCreateGroupFeedback("Check the invited emails before creating the study group.", "error");
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
  const attachmentUrl = String((message && message.attachmentUrl) || "").trim();
  if (attachmentUrl) return attachmentUrl;
  const attachmentBase64 = String((message && message.attachmentBase64) || "").trim();
  if (!attachmentBase64) return "";
  return (
    "data:" +
    (message.attachmentContentType || "application/octet-stream") +
    ";base64," +
    attachmentBase64
  );
}

function buildAttachment(message) {
  if (!message || message.recalled || (!message.attachmentBase64 && !message.attachmentUrl)) return null;
  const href = attachmentDataUrl(message);
  if (!href) return null;
  const wrap = document.createElement("div");
  wrap.className = "message-attachment";

  const type = String(message.attachmentContentType || "");
  if (type.startsWith("image/")) {
    wrap.classList.add("is-image");
  } else {
    wrap.classList.add("is-file");
  }

  const header = document.createElement("div");
  header.className = "message-attachment-header";

  const label = document.createElement("strong");
  label.className = "message-attachment-title";
  label.textContent = message.attachmentName || "attachment";
  header.appendChild(label);

  if (type.startsWith("image/")) {
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
  download.textContent = type.startsWith("image/") ? "Open image" : "Download file";
  wrap.appendChild(download);

  return wrap;
}

function messagePreview(message, sent, sender) {
  const prefix = sent ? "You" : sender;
  return prefix + ": " + messageSummaryText(message);
}

function isOwnMessage(message, sent) {
  if (sent) return true;
  if (!message || !currentUser || !currentUser.email) return false;
  const currentEmail = normalizeEmail(currentUser.email);
  const senderEmail = normalizeEmail(message.senderEmail);
  if (senderEmail && senderEmail === currentEmail) {
    return true;
  }
  if (activeChannel.type === "direct") {
    const recipientEmail = normalizeEmail(message.recipientEmail);
    const channelEmail = normalizeEmail(activeChannel.email);
    if (recipientEmail && channelEmail && recipientEmail === channelEmail) {
      return true;
    }
  }
  return false;
}

function canToggleMessagePin(message, sent) {
  return Boolean(message) && !message.recalled;
}

function closeMessageActionMenu() {
  if (!messageActionMenuState) return;
  const { menu, trigger, tools } = messageActionMenuState;
  if (tools) {
    tools.classList.remove("is-open");
  }
  if (trigger) {
    trigger.classList.remove("active");
    trigger.setAttribute("aria-expanded", "false");
  }
  if (menu && menu.parentNode) {
    menu.parentNode.removeChild(menu);
  }
  messageActionMenuState = null;
}

function positionMessageActionMenu(menu, trigger) {
  if (!menu || !trigger) return;
  const triggerRect = trigger.getBoundingClientRect();
  const menuWidth = menu.offsetWidth || 220;
  const menuHeight = menu.offsetHeight || 180;
  const gutter = 12;
  const nextLeft = Math.max(
    gutter,
    Math.min(window.innerWidth - menuWidth - gutter, triggerRect.right - menuWidth + 8),
  );
  let nextTop = triggerRect.top - menuHeight - gutter;
  let placement = "above";
  if (nextTop < gutter) {
    nextTop = Math.min(window.innerHeight - menuHeight - gutter, triggerRect.bottom + gutter);
    placement = "below";
  }
  const arrowLeft = Math.max(
    28,
    Math.min(menuWidth - 28, triggerRect.left + triggerRect.width / 2 - nextLeft),
  );
  menu.dataset.placement = placement;
  menu.style.left = nextLeft + "px";
  menu.style.top = nextTop + "px";
  menu.style.setProperty("--message-menu-arrow-left", arrowLeft + "px");
}

function createMessageActionItem(label, onClick, danger) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "message-action-item" + (danger ? " danger" : "");
  button.setAttribute("role", "menuitem");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function buildMessageActionMenu(message, sent, sender) {
  const menu = document.createElement("div");
  menu.className = "message-action-menu";
  menu.setAttribute("role", "menu");
  const ownMessage = isOwnMessage(message, sent);

  if (ownMessage && !message.recalled) {
    menu.appendChild(
      createMessageActionItem(
        localizeText("Thu hồi", "Recall"),
        () => {
          closeMessageActionMenu();
          void recallMessage(message);
        },
        false,
      ),
    );
  }

  if (canToggleMessagePin(message, sent)) {
    menu.appendChild(
      createMessageActionItem(
        message.pinned ? localizeText("Bỏ ghim", "Unpin") : localizeText("Ghim", "Pin"),
        () => {
          closeMessageActionMenu();
          void toggleMessagePin(message);
        },
        false,
      ),
    );
  }

  return menu.childElementCount ? menu : null;
}

function openMessageActionMenu(trigger, tools, message, sent, sender) {
  closeMessageActionMenu();
  const menu = buildMessageActionMenu(message, sent, sender);
  if (!menu) return;
  document.body.appendChild(menu);
  positionMessageActionMenu(menu, trigger);
  window.requestAnimationFrame(() => {
    menu.classList.add("is-open");
  });
  tools.classList.add("is-open");
  trigger.classList.add("active");
  trigger.setAttribute("aria-expanded", "true");
  messageActionMenuState = { menu, trigger, tools };
}

function toggleMessageActionMenu(trigger, tools, message, sent, sender) {
  if (messageActionMenuState && messageActionMenuState.trigger === trigger) {
    closeMessageActionMenu();
    return;
  }
  openMessageActionMenu(trigger, tools, message, sent, sender);
}

function buildMessageActionsLegacy(message, sent) {
  if (!message || !message.id || (activeChannel.type !== "direct" && activeChannel.type !== "group")) {
    return null;
  }

  const tools = document.createElement("div");
  tools.className = "message-tools";

  if (!message.recalled) {
    const pinButton = document.createElement("button");
    pinButton.type = "button";
    pinButton.className = "message-tool-btn";
    pinButton.textContent = message.pinned ? "Bỏ ghim" : "Ghim";
    pinButton.addEventListener("click", () => {
      void toggleMessagePin(message);
    });
    tools.appendChild(pinButton);
  }

  if (sent && !message.recalled) {
    const recallButton = document.createElement("button");
    recallButton.type = "button";
    recallButton.className = "message-tool-btn danger";
    recallButton.textContent = "Thu hồi";
    recallButton.addEventListener("click", () => {
      void recallMessage(message);
    });
    tools.appendChild(recallButton);
  }

  return tools.childElementCount ? tools : null;
}

function buildMessageActions(message, sent, sender) {
  if (!message || !message.id || (activeChannel.type !== "direct" && activeChannel.type !== "group")) {
    return null;
  }

  const ownMessage = isOwnMessage(message, sent);
  const hasRecall = ownMessage && !message.recalled;
  const hasPin = canToggleMessagePin(message, sent);
  if (!hasRecall && !hasPin) {
    return null;
  }

  const tools = document.createElement("div");
  tools.className = "message-tools";

  const menuButton = document.createElement("button");
  menuButton.type = "button";
  menuButton.className = "message-action-trigger";
  menuButton.setAttribute("aria-haspopup", "menu");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", localizeText("Tùy chọn tin nhắn", "Message options"));
  menuButton.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="5" r="1.8" fill="currentColor" stroke="none"></circle>' +
    '<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"></circle>' +
    '<circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"></circle>' +
    "</svg>";
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMessageActionMenu(menuButton, tools, message, sent, sender);
  });
  tools.appendChild(menuButton);

  return tools;
}

function addMessage(message, sent, sender, timestamp, autoScroll = true) {
  if (
    el.messagesArea.querySelector(".empty-state") ||
    el.messagesArea.classList.contains("home-mode")
  ) {
    el.messagesArea.innerHTML = "";
  }
  setMessagesSurfaceMode("conversation");
  const ownMessage = isOwnMessage(message, sent);
  const row = document.createElement("div");
  row.className = "message-row" + (ownMessage ? " sent" : "") + (message && message.recalled ? " recalled" : "");
  if (message && message.id) {
    row.dataset.messageId = String(message.id);
  }
  const identity = resolveMessageIdentity(message, ownMessage, sender);
  row.innerHTML =
    '<div class="message-stack"><div class="message-meta"><strong>' +
    (identity.name || sender) +
    "</strong><span>" +
    formatTime(timestamp) +
    '</span></div><div class="message-content-row"><div class="message-bubble"></div></div></div>';
  const bubble = row.querySelector(".message-bubble");
  const contentRow = row.querySelector(".message-content-row");
  const text = String((message && message.content) || "").trim();
  if (message && message.recalled) {
    const copy = document.createElement("div");
    copy.className = "message-copy recalled-copy";
    copy.textContent = recalledMessageCopy();
    bubble.appendChild(copy);
  } else if (text) {
    const copy = document.createElement("div");
    copy.className = "message-copy";
    copy.textContent = text;
    bubble.appendChild(copy);
  }
  const attachment = buildAttachment(message);
  if (attachment) {
    bubble.appendChild(attachment);
  }
  const tools = buildMessageActions(message, ownMessage, sender);
  if (tools && contentRow) {
    contentRow.appendChild(tools);
  }
  el.messagesArea.appendChild(row);
  if (autoScroll) {
    el.messagesArea.scrollTop = el.messagesArea.scrollHeight;
  }
}

// Channel selection and sidebar rendering
function selectHome() {
  closeMessageActionMenu();
  activeChannel = { type: "home" };
  closePreviewDetails();
  syncSurfaceMode();
  el.chatKicker.textContent = "Inbox";
  el.chatTitle.textContent = localizeText("Hộp chat", "Inbox");
  el.chatSubtitle.textContent = localizeText(
    "Chọn một cuộc trò chuyện hoặc nhóm để bắt đầu.",
    "Pick a conversation or group to get started.",
  );
  syncAvatarNode(el.chatAvatar, displayName(currentUser), currentUser && currentUser.avatarUrl);
  showBanner("", "info");
  disconnectSubscription();
  highlightSelection();
  syncPreviewProfilePanel();
  renderFavoritesStrip();
  renderPinnedMessageStrip();
  renderPreviewPinnedPanel();
  renderHomeOverview();
  syncComposer();
}

function selectDirect(friend) {
  closeMessageActionMenu();
  activeChannel = {
    type: "direct",
    id: normalizeEmail(friend.email),
    email: friend.email,
    name: displayName(friend),
  };
  closePreviewDetails();
  syncSurfaceMode();
  el.chatKicker.textContent = "";
  el.chatTitle.textContent = displayName(friend);
  el.chatSubtitle.textContent = friend.email || "";
  syncAvatarNode(el.chatAvatar, displayName(friend), friend.avatarUrl || "");
  showBanner("", "info");
  highlightSelection();
  syncPreviewProfilePanel();
  renderFavoritesStrip();
  renderPinnedMessageStrip();
  renderPreviewPinnedPanel();
  syncComposer();
  loadDirectHistory(friend.email);
  subscribeToDirect(friend.email);
}

function selectGroup(group) {
  closeMessageActionMenu();
  activeChannel = { type: "group", id: group.id, name: group.name || "Study Group" };
  closePreviewDetails();
  syncSurfaceMode();
  el.chatKicker.textContent = "Group";
  el.chatTitle.textContent = group.name || "Study Group";
  el.chatSubtitle.textContent = group.category || "";
  syncAvatarNode(el.chatAvatar, group.name || "Study Group", "");
  showBanner("", "info");
  highlightSelection();
  syncPreviewProfilePanel();
  renderFavoritesStrip();
  renderPinnedMessageStrip();
  renderPreviewPinnedPanel();
  syncComposer();
  void ensureGroupDetails(group.id);
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
    activeChannel.type === "home",
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
    '</div><div class="channel-main"><div class="channel-row"><div class="channel-name">' +
    name +
    "</div>" +
    (role ? '<span class="channel-tag">' + role + "</span>" : "") +
    '</div><div class="channel-preview"></div></div>';
  button.title = name;
  button.querySelector(".channel-preview").textContent = preview;
  button.addEventListener("click", onClick);
  return button;
}

function friendMatchesQuery(friend, query) {
  if (!query) return true;
  const name = displayName(friend).toLowerCase();
  const email = String(friend.email || "").toLowerCase();
  return name.includes(query) || email.includes(query);
}

function groupMatchesQuery(group, query) {
  if (!query) return true;
  const name = String(group.name || "").toLowerCase();
  const category = String(group.category || "").toLowerCase();
  const description = String(group.description || "").toLowerCase();
  return name.includes(query) || category.includes(query) || description.includes(query);
}

function visibleFriends() {
  if (rosterFilter === "group") return [];
  const query = friendSearchQuery.trim().toLowerCase();
  return socialState.friends.filter((friend) => friendMatchesQuery(friend, query));
}

function visibleGroups() {
  if (rosterFilter === "personal") return [];
  const query = friendSearchQuery.trim().toLowerCase();
  return groups.filter((group) => groupMatchesQuery(group, query));
}

function syncRosterFilterUi() {
  const tabs = [
    [el.filterAllButton, "all"],
    [el.filterPersonalButton, "personal"],
    [el.filterGroupsButton, "group"],
  ];
  tabs.forEach(([button, filter]) => {
    if (!button) return;
    const active = rosterFilter === filter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });


  const personalCount = visibleFriends().length;
  const groupCount = visibleGroups().length;

  if (el.previewRosterBadge) {
    const totalVisible = personalCount + groupCount;
    el.previewRosterBadge.textContent = String(totalVisible);
    el.previewRosterBadge.title = totalVisible
      ? String(totalVisible) + " active conversations"
      : "No active conversations";
  }
}

function setRosterFilter(nextFilter) {
  rosterFilter = nextFilter;
  syncRosterFilterUi();
  renderFriends();
  renderGroups();
}

function renderFriends() {
  el.friendsList.innerHTML = "";
  const matches = visibleFriends();
  if (el.friendsSection) {
    el.friendsSection.hidden = rosterFilter === "group";
  }
  el.friendsCount.textContent = String(matches.length);
  el.friendsEmpty.textContent = socialState.friends.length
    ? "No friends match your search."
    : "No accepted friends yet.";
  el.friendsEmpty.style.display = matches.length ? "none" : "block";
  matches.forEach((friend) => {
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
  syncRosterFilterUi();
  highlightSelection();
  renderFavoritesStrip();
  refreshHomeOverviewIfNeeded();
}

function renderGroups() {
  if (el.groupRailList) {
    el.groupRailList.innerHTML = "";
  }
  if (el.groupsList) {
    el.groupsList.innerHTML = "";
    const matches = visibleGroups();
    if (el.groupsSection) {
      el.groupsSection.hidden = rosterFilter === "personal";
    }
    matches.forEach((group) => {
      el.groupsList.appendChild(
        renderChannel(
          "group",
          group.id,
          group.name || "Study Group",
          getPreview("group", group.id, group.category || "Accepted study group"),
          group.role || "",
          () => selectGroup(group),
        ),
      );
    });
    if (el.groupsEmpty) {
      el.groupsEmpty.style.display = matches.length ? "none" : "block";
      el.groupsEmpty.textContent = groups.length
        ? "No groups match your search."
        : "No active groups yet.";
    }
    el.overviewGroups.textContent = String(matches.length);
  }
  if (el.groupRailList) {
    groups.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rail-btn rail-group";
      button.dataset.id = String(group.id);
      button.innerHTML =
        '<span class="rail-group-mark">' +
        initials(group.name || "Group") +
        '</span><span class="rail-btn-copy"><strong class="rail-btn-title">' +
        (group.name || "Study Group") +
        '</strong><span class="rail-btn-subtitle">' +
        (group.category || group.role || "Study group") +
        "</span></span>";
      button.title = group.name || "Study Group";
      button.addEventListener("click", () => selectGroup(group));
      el.groupRailList.appendChild(button);
    });
  }
  syncRosterFilterUi();
  highlightSelection();
  renderFavoritesStrip();
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
  const nextGroups = result.ok && Array.isArray(result.data) ? result.data : [];
  groups = nextGroups.map((group) => {
    const cached = groupDetailsCache.get(String(group.id || ""));
    return cached ? { ...group, ...cached } : group;
  });
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
    setConversationHistory("direct", directId, []);
    setPinnedMessages("direct", directId, []);
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
  setConversationHistory("direct", directId, messages);
  void loadDirectPins(otherEmail);
  if (!messages.length) {
    clearMessages("No messages yet", "Start the conversation here.", "");
    return;
  }
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
  clearMessages("Loading group", "Pulling the latest group messages.", "Group");
  const result = await authorizedRequest("/api/messages/groups/" + groupId);
  if (activeChannel.type !== "group" || String(activeChannel.id) !== currentGroupId) return;
  if (!result.ok) {
    setConversationHistory("group", currentGroupId, []);
    setPinnedMessages("group", currentGroupId, []);
    clearMessages(
      "Group unavailable",
      result.data.error || "You cannot open this group right now.",
      "Group",
    );
    showBanner(result.data.error || "Group history is unavailable.", "error");
    return;
  }
  showBanner("", "info");
  const messages = Array.isArray(result.data) ? result.data : [];
  setConversationHistory("group", currentGroupId, messages);
  void loadGroupPins(groupId);
  if (!messages.length) {
    clearMessages("No messages yet", "Send the first message to this study group.", "Group");
    return;
  }
  const last = messages[messages.length - 1];
  if (last) {
    const sender =
      normalizeEmail(last.senderEmail) === normalizeEmail(currentUser.email)
        ? "You"
        : last.senderName || last.senderEmail || "User";
    setPreview("group", groupId, messagePreview(last, sender === "You", sender));
  }
}

async function loadDirectPins(otherEmail) {
  const directId = normalizeEmail(otherEmail);
  const result = await authorizedRequest(
    "/api/messages/direct/" + encodeURIComponent(otherEmail) + "/pins",
  );
  if (activeChannel.type !== "direct" || normalizeEmail(activeChannel.email) !== directId) return;
  setPinnedMessages("direct", directId, result.ok && Array.isArray(result.data) ? result.data : []);
}

async function loadGroupPins(groupId) {
  const currentGroupId = String(groupId || "");
  const result = await authorizedRequest("/api/messages/groups/" + currentGroupId + "/pins");
  if (activeChannel.type !== "group" || String(activeChannel.id) !== currentGroupId) return;
  setPinnedMessages("group", currentGroupId, result.ok && Array.isArray(result.data) ? result.data : []);
}

// Realtime messaging
function connectWs() {
  if (reconnectTimer) window.clearTimeout(reconnectTimer);
  if (typeof SockJS === "undefined" || typeof Stomp === "undefined") {
    setConnectionState("Sync delayed", false);
    reconnectTimer = window.setTimeout(connectWs, 15000);
    return;
  }
  const socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.connect(
    {},
    () => {
      setConnectionState("Live sync", true);
      if (activeChannel.type === "group") subscribeToGroup(activeChannel.id);
      if (activeChannel.type === "direct") subscribeToDirect(activeChannel.email);
    },
    () => {
      setConnectionState("Sync delayed", false);
      reconnectTimer = window.setTimeout(connectWs, 5000);
    },
  );
}

function subscribeToGroup(groupId) {
  if (!stompClient || !stompClient.connected) return;
  disconnectSubscription();
  activeSubscription = stompClient.subscribe("/topic/groups/" + groupId, (payload) => {
    const data = JSON.parse(payload.body || "{}");
    const updateOnly = Boolean(data && data.message);
    const message = updateOnly ? data.message : data;
    if (!message || !message.id) return;
    if (
      !updateOnly &&
      !String(message.content || "").trim() &&
      !message.attachmentBase64 &&
      !message.attachmentUrl
    ) {
      return;
    }
    applyRealtimeConversationUpdate("group", groupId, message, updateOnly);
  });
}

function subscribeToDirect(otherEmail) {
  if (!stompClient || !stompClient.connected) return;
  disconnectSubscription();
  const key = conversationKey(currentUser.email, otherEmail);
  const directId = normalizeEmail(otherEmail);
  activeSubscription = stompClient.subscribe("/topic/direct/" + key, (payload) => {
    const data = JSON.parse(payload.body || "{}");
    const updateOnly = Boolean(data && data.message);
    const message = updateOnly ? data.message : data;
    if (!message || !message.id) return;
    if (
      !updateOnly &&
      !String(message.content || "").trim() &&
      !message.attachmentBase64 &&
      !message.attachmentUrl
    ) {
      return;
    }
    applyRealtimeConversationUpdate("direct", directId, message, updateOnly);
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

function isSameChannel(type, id) {
  return activeChannel.type === type && String(activeChannel.id || "") === String(id || "");
}

function clearDraftIfUnchanged(type, id, expectedValue) {
  if (!isSameChannel(type, id)) return;
  if (String(el.messageInput.value || "").trim() !== String(expectedValue || "").trim()) return;
  el.messageInput.value = "";
}

async function sendGroupMessageFallback(content) {
  if (activeChannel.type !== "group") return false;
  const activeGroupId = String(activeChannel.id);
  const result = await authorizedRequest("/api/messages/groups/" + activeGroupId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      groupId: activeChannel.id,
      senderEmail: currentUser.email,
      senderName: displayName(currentUser),
      content,
    }),
  });
  if (!result.ok || !result.data) {
    showToast((result.data && result.data.error) || "Could not send the message.");
    return false;
  }
  const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
  setPreview("group", activeGroupId, messagePreview(result.data, true, sender));
  if (!stompClient || !stompClient.connected) {
    upsertConversationHistory("group", activeGroupId, result.data);
    if (isSameChannel("group", activeGroupId)) {
      addMessage(result.data, true, sender, result.data.timestamp);
    }
  }
  clearDraftIfUnchanged("group", activeGroupId, content);
  return true;
}

async function sendDirectMessageFallback(content) {
  if (activeChannel.type !== "direct") return false;
  const channelId = activeChannel.id;
  const recipientEmail = activeChannel.email;
  const result = await authorizedRequest("/api/messages/direct/" + encodeURIComponent(recipientEmail), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderEmail: currentUser.email,
      senderName: displayName(currentUser),
      recipientEmail,
      content,
    }),
  });
  if (!result.ok || !result.data) {
    showToast((result.data && result.data.error) || "Could not send the message.");
    return false;
  }
  const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
  setPreview("direct", channelId, messagePreview(result.data, true, sender));
  if (!stompClient || !stompClient.connected) {
    upsertConversationHistory("direct", channelId, result.data);
    if (isSameChannel("direct", channelId)) {
      addMessage(result.data, true, sender, result.data.timestamp);
    }
  }
  clearDraftIfUnchanged("direct", channelId, content);
  return true;
}

async function uploadDirectAttachment(file) {
  if (!file || activeChannel.type !== "direct") return;
  const channelId = activeChannel.id;
  const recipientEmail = activeChannel.email;
  const formData = new FormData();
  formData.append("file", file);
  const caption = el.messageInput.value.trim();
  if (caption) {
    formData.append("caption", caption);
  }

  el.attachBtn.disabled = true;
  el.attachBtn.title = "Uploading attachment...";
  el.attachBtn.setAttribute("aria-label", "Uploading attachment");
  const result = await authorizedRequest(
    "/api/messages/direct/" + encodeURIComponent(recipientEmail) + "/attachments",
    {
      method: "POST",
      body: formData,
    },
  );
  el.attachBtn.title = "Attach";
  el.attachBtn.setAttribute("aria-label", "Attach");
  syncComposer();
  el.attachmentInput.value = "";

  if (!result.ok) {
    showToast(result.data.error || "Could not send the file.");
    return;
  }
  const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
  setPreview("direct", channelId, messagePreview(result.data, true, sender));

  if (!stompClient || !stompClient.connected) {
    upsertConversationHistory("direct", channelId, result.data);
    if (isSameChannel("direct", channelId)) {
      addMessage(result.data, true, sender, result.data.timestamp);
    }
  }

  clearDraftIfUnchanged("direct", channelId, caption);
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
  el.attachBtn.title = "Uploading attachment...";
  el.attachBtn.setAttribute("aria-label", "Uploading attachment");
  const result = await authorizedRequest("/api/messages/groups/" + activeGroupId + "/attachments", {
    method: "POST",
    body: formData,
  });
  el.attachBtn.title = "Attach";
  el.attachBtn.setAttribute("aria-label", "Attach");
  syncComposer();
  el.attachmentInput.value = "";

  if (!result.ok) {
    showToast(result.data.error || "Could not send the file.");
    return;
  }
  const sender = result.data.senderName || displayName(currentUser) || currentUser.email;
  setPreview("group", activeGroupId, messagePreview(result.data, true, sender));

  if (!stompClient || !stompClient.connected) {
    upsertConversationHistory("group", activeGroupId, result.data);
    if (isSameChannel("group", activeGroupId)) {
      addMessage(result.data, true, sender, result.data.timestamp);
    }
  }

  clearDraftIfUnchanged("group", activeGroupId, caption);
  showToast("Attachment sent.");
}

async function recallMessage(message) {
  if (!message || !message.id) return;
  if (!window.confirm("Thu hồi tin nhắn này?")) return;

  let result;
  if (activeChannel.type === "group") {
    result = await authorizedRequest(
      "/api/messages/groups/" + activeChannel.id + "/messages/" + message.id + "/recall",
      { method: "POST" },
    );
  } else if (activeChannel.type === "direct") {
    result = await authorizedRequest(
      "/api/messages/direct/" + encodeURIComponent(activeChannel.email) + "/messages/" + message.id + "/recall",
      { method: "POST" },
    );
  } else {
    return;
  }

  if (!result.ok || !result.data) {
    showToast((result.data && result.data.error) || "Không thể thu hồi tin nhắn.");
    return;
  }

  applyMessageUpdate(activeChannel.type, activeChannel.id, result.data);
  showToast("Đã thu hồi tin nhắn.");
}

async function toggleMessagePin(message) {
  if (!message || !message.id) return;
  const nextPinned = !message.pinned;

  let result;
  if (activeChannel.type === "group") {
    result = await authorizedRequest(
      "/api/messages/groups/" + activeChannel.id + "/messages/" + message.id + "/pin",
      { method: nextPinned ? "POST" : "DELETE" },
    );
  } else if (activeChannel.type === "direct") {
    result = await authorizedRequest(
      "/api/messages/direct/" + encodeURIComponent(activeChannel.email) + "/messages/" + message.id + "/pin",
      { method: nextPinned ? "POST" : "DELETE" },
    );
  } else {
    return;
  }

  if (!result.ok || !result.data) {
    showToast((result.data && result.data.error) || "Không thể cập nhật ghim.");
    return;
  }

  applyMessageUpdate(activeChannel.type, activeChannel.id, result.data);
  showToast(nextPinned ? "Đã ghim tin nhắn." : "Đã bỏ ghim.");
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
  try {
    currentUser = requireAuth();
    if (!currentUser) return;
    await loadCurrentUserProfile();
    applyTheme(loadThemePreference());
    startStudyTimerTicker();
    removeLanguageSettingsField();
    if (!el.studyTimerPanelMount.firstChild) {
      el.studyTimerPanelMount.appendChild(createStudyTimerPanel());
      refreshStudyTimerUi();
    }
    if (el.studyNotesPanelMount && !el.studyNotesPanelMount.firstChild) {
      el.studyNotesPanelMount.appendChild(createStudyNotesPanel());
      refreshPlannerStudioUi();
      renderPlannerFloatingNotes();
    }
    syncCurrentUserUi();
    setFriendCardCollapsed(true);
    setFriendsCardCollapsed(false);
    setRosterFilter("all");
    el.settingsToggleButton.title = "Settings";
    el.settingsToggleButton.setAttribute("aria-label", "Settings");
    el.studyTimerToggleButton.title = "Study timer";
    el.studyTimerToggleButton.setAttribute("aria-label", "Study timer");
    closeSettingsPopover();
    closeStudyTimerPopover();
    closeCreateGroupPopover();
    renderCreateGroupMembersPreview();
    setSettingsProfileFeedback("", "success");
    setCreateGroupFeedback("", "success");
    syncInboxToggleState();
    selectHome();
    clearMessages("Loading conversations", "Preparing your inbox.", "Inbox");
    await refreshWorkspace();
    selectDefaultConversation();
    handlePanelQuery();
    connectWs();
    if (workspaceRefreshTimer) window.clearInterval(workspaceRefreshTimer);
    workspaceRefreshTimer = window.setInterval(refreshWorkspace, 5000);
  } catch (error) {
    console.error("Workspace bootstrap failed.", error);
    showBanner("Không thể chuẩn bị workspace. Hãy tải lại trang.", "error");
  } finally {
    await finishWorkspaceBoot();
  }
}

// Event wiring
el.friendCardToggleInput.addEventListener("click", () =>
  setFriendCardCollapsed(!el.friendCard.classList.contains("is-collapsed")),
);

el.friendsCardToggle.addEventListener("click", () =>
  setFriendsCardCollapsed(!el.friendsCard.classList.contains("is-collapsed")),
);

if (el.friendsSearchInput) {
  el.friendsSearchInput.addEventListener("input", (event) => {
    const input = /** @type {HTMLInputElement} */ (event.currentTarget);
    friendSearchQuery = input.value || "";
    renderFriends();
    renderGroups();
  });
}

if (el.previewCloseProfile) {
  el.previewCloseProfile.addEventListener("click", closePreviewDetails);
}

if (el.profileToggleButton) {
  el.profileToggleButton.addEventListener("click", () => {
    const isOpen = Boolean(el.previewApp && el.previewApp.classList.contains("details-open"));
    if (isOpen && previewDetailsMode === "self") {
      closePreviewDetails();
      return;
    }
    openCurrentUserProfile();
  });
}

if (el.previewAddFriendBtn) {
  el.previewAddFriendBtn.addEventListener("click", () => {
    closePreviewDetails();
    setRosterFilter("personal");
    setFriendCardCollapsed(false);
    el.friendEmailInput.focus();
  });
}

if (el.previewGroupInfoBtn) {
  el.previewGroupInfoBtn.addEventListener("click", () => {
    if (activeChannel.type === "group") {
      void ensureGroupDetails(activeChannel.id);
    }
  });
}

if (el.previewGroupRenameBtn) {
  el.previewGroupRenameBtn.addEventListener("click", () => {
    void renameActiveGroup();
  });
}

if (el.previewGroupRenameInput) {
  el.previewGroupRenameInput.addEventListener("input", () => {
    setPreviewGroupManageFeedback("", "success");
  });
  el.previewGroupRenameInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    void renameActiveGroup();
  });
}

if (el.previewGroupLeaveBtn) {
  el.previewGroupLeaveBtn.addEventListener("click", () => {
    void leaveActiveGroup();
  });
}

if (el.dashboardNavButton) {
  el.dashboardNavButton.addEventListener("click", () => {
    closeInboxPanel();
    closeSettingsPopover();
    closeStudyTimerPopover();
    closeCreateGroupPopover();
    closePreviewDetails();
    setRosterFilter("all");
    selectHome();
  });
}

if (el.friendsNavButton) {
  el.friendsNavButton.addEventListener("click", () => {
    closePreviewDetails();
    setRosterFilter("personal");
    setFriendsCardCollapsed(false);
    const matches = visibleFriends();
    if (matches.length) {
      selectDirect(matches[0]);
    }
    if (el.friendsSearchInput) {
      el.friendsSearchInput.focus();
    } else if (el.filterPersonalButton) {
      el.filterPersonalButton.focus();
    }
  });
}

if (el.groupNavButton) {
  el.groupNavButton.addEventListener("click", () => {
    closePreviewDetails();
    setRosterFilter("group");
    setFriendsCardCollapsed(false);
    const matches = visibleGroups();
    if (matches.length) {
      selectGroup(matches[0]);
      return;
    }
    if (el.groupsList) {
      el.groupsList.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (el.filterAllButton) {
  el.filterAllButton.addEventListener("click", () => setRosterFilter("all"));
}

if (el.filterPersonalButton) {
  el.filterPersonalButton.addEventListener("click", () => setRosterFilter("personal"));
}

if (el.filterGroupsButton) {
  el.filterGroupsButton.addEventListener("click", () => setRosterFilter("group"));
}

[el.settingsThemeLight, el.settingsThemeDark, el.settingsThemeAuto]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener("change", (event) => {
      const currentInput = /** @type {HTMLInputElement} */ (event.currentTarget);
      if (currentInput.checked) applyTheme(currentInput.value);
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

el.settingsProfileForm.addEventListener("submit", saveProfileSettings);

el.settingsDisplayNameInput.addEventListener("input", () => {
  setSettingsProfileFeedback("", "success");
  refreshSettingsAvatarPreview();
});

el.settingsAvatarUrlInput.addEventListener("input", () => {
  setSettingsProfileFeedback("", "success");
  refreshSettingsAvatarPreview();
});

el.settingsBirthDateInput.addEventListener("input", () => {
  setSettingsProfileFeedback("", "success");
});

el.settingsLanguageSelect.addEventListener("change", () => {
  setSettingsProfileFeedback("", "success");
});

el.createGroupMembersInput.addEventListener("input", () => {
  renderCreateGroupMembersPreview();
  setCreateGroupFeedback("", "success");
});

el.createGroupForm.addEventListener("submit", submitCreateGroup);

el.studyTimerPanelMount.addEventListener("click", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const studyModeButton = target.closest("[data-study-mode]");
  if (studyModeButton) {
    setStudyTimerMode(studyModeButton.dataset.studyMode || "stopwatch");
    return;
  }

  const shortcutButton = target.closest("[data-study-shortcut]");
  if (shortcutButton) {
    triggerStudyTimerAuxAction();
    return;
  }

  const studyActionButton = target.closest("[data-study-action]");
  if (!studyActionButton) return;

  if (studyActionButton.dataset.studyAction === "toggle") {
    toggleStudyTimer();
  } else if (studyActionButton.dataset.studyAction === "reset") {
    resetStudyTimer();
  } else if (studyActionButton.dataset.studyAction === "fullscreen") {
    toggleStudyTimerFullscreen();
  }
});

el.studyTimerPanelMount.addEventListener("input", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const studyField = target.closest("[data-study-field]");
  if (!studyField) return;
  updateStudyTimerField(
    studyField.dataset.studyField || "",
    /** @type {HTMLInputElement} */ (studyField).value,
  );
});

if (el.studyNotesPanelMount) {
el.studyNotesPanelMount.addEventListener("click", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const quickNoteButton = target.closest("[data-planner-note-new]");
  if (quickNoteButton) {
    createPlannerStickyNote("", "");
    return;
  }

  const filterResetButton = target.closest("[data-planner-filter-reset]");
  if (filterResetButton) {
    resetPlannerFilters();
    return;
  }

  const viewToggleButton = target.closest("[data-planner-view]");
  if (viewToggleButton) {
    plannerState.viewMode = viewToggleButton.dataset.plannerView === "list" ? "list" : "board";
    persistPlannerState();
    refreshPlannerStudioUi();
    return;
  }

  const taskToggleButton = target.closest("[data-planner-task-toggle]");
  if (taskToggleButton) {
    togglePlannerTaskDone(taskToggleButton.dataset.plannerTaskToggle || "");
    return;
  }

  const taskTrackButton = target.closest("[data-planner-task-track]");
  if (taskTrackButton) {
    togglePlannerTaskTimer(taskTrackButton.dataset.plannerTaskTrack || "");
    refreshPlannerStudioUi();
    return;
  }

  const taskSelectButton = target.closest("[data-planner-task-select]");
  if (taskSelectButton) {
    selectPlannerTask(taskSelectButton.dataset.plannerTaskSelect || "");
    return;
  }

  const taskRemoveButton = target.closest("[data-planner-task-remove]");
  if (taskRemoveButton) {
    removePlannerTask(taskRemoveButton.dataset.plannerTaskRemove || "");
    return;
  }

  const taskResetButton = target.closest("[data-planner-task-reset]");
  if (taskResetButton) {
    resetPlannerTaskSelection();
    return;
  }

  const noteOpenButton = target.closest("[data-planner-note-open]");
  if (noteOpenButton) {
    openPlannerNoteWindow(noteOpenButton.dataset.plannerNoteOpen || "");
    return;
  }

  const notePinButton = target.closest("[data-planner-note-pin]");
  if (notePinButton) {
    togglePlannerNotePinned(notePinButton.dataset.plannerNotePin || "");
    return;
  }

  const noteConvertButton = target.closest("[data-planner-note-convert]");
  if (noteConvertButton) {
    if (convertPlannerNoteToTask(noteConvertButton.dataset.plannerNoteConvert || "")) {
      showToast(localizeText("Đã chuyển note thành task.", "Note converted into a task."));
    }
    return;
  }

  const noteDeleteButton = target.closest("[data-planner-note-delete]");
  if (noteDeleteButton) {
    deletePlannerNote(noteDeleteButton.dataset.plannerNoteDelete || "");
  }
});

el.studyNotesPanelMount.addEventListener("input", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const searchField = target.closest("[data-planner-search]");
  if (searchField) {
    plannerState.searchText = normalizePlannerSingleLine(
      /** @type {HTMLInputElement} */ (searchField).value,
      80,
    );
    persistPlannerState();
    refreshPlannerStudioUi();
  }
});

el.studyNotesPanelMount.addEventListener("change", (event) => {
  const target = asElement(event.target);
  if (!target) return;
  const filterField = target.closest("[data-planner-filter]");
  if (!filterField) return;
  const key = filterField.dataset.plannerFilter || "";
  const value = /** @type {HTMLSelectElement} */ (filterField).value || "all";
  if (key === "priority") plannerState.priorityFilter = value;
  if (key === "status") plannerState.statusFilter = value;
  if (key === "deadline") plannerState.deadlineFilter = value;
  if (key === "project") plannerState.projectFilter = value;
  persistPlannerState();
  refreshPlannerStudioUi();
});

el.studyNotesPanelMount.addEventListener("submit", (event) => {
  const form = asElement(event.target);
  if (!form) return;
  event.preventDefault();
  if (form.matches("[data-planner-quick-add-form]")) {
    const quickInput = /** @type {HTMLInputElement | null} */ (form.querySelector("[name='quickAdd']"));
    if (quickInput && quickAddPlannerTask(quickInput.value)) {
      quickInput.value = "";
    }
    return;
  }
  if (!form.matches("[data-planner-task-form]")) return;
  const title = /** @type {HTMLInputElement | null} */ (form.querySelector("[name='title']"));
  if (!title || !normalizePlannerSingleLine(title.value, 120)) return;
  const payload = {
    taskId: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='taskId']"))?.value || "",
    title: title.value,
    description: /** @type {HTMLTextAreaElement | null} */ (form.querySelector("[name='description']"))?.value || "",
    deadline: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='deadline']"))?.value || "",
    scheduledAt: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='scheduledAt']"))?.value || "",
    priority: /** @type {HTMLSelectElement | null} */ (form.querySelector("[name='priority']"))?.value || "medium",
    status: /** @type {HTMLSelectElement | null} */ (form.querySelector("[name='status']"))?.value || "todo",
    project: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='project']"))?.value || "",
    tag: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='tag']"))?.value || "",
    estimateMinutes: /** @type {HTMLInputElement | null} */ (form.querySelector("[name='estimateMinutes']"))?.value || 30,
  };
  upsertPlannerTask(payload);
});

el.studyNotesPanelMount.addEventListener("dragstart", (event) => {
  const target = asElement(event.target);
  if (!target) return;
  const taskCard = target.closest("[data-planner-task-drag]");
  if (!taskCard) return;
  plannerDraggedTaskId = taskCard.dataset.plannerTaskDrag || "";
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", plannerDraggedTaskId);
  }
});

el.studyNotesPanelMount.addEventListener("dragover", (event) => {
  const target = asElement(event.target);
  if (!target || !target.closest("[data-planner-drop-zone]")) return;
  event.preventDefault();
});

el.studyNotesPanelMount.addEventListener("drop", (event) => {
  const target = asElement(event.target);
  const dropZone = target && target.closest("[data-planner-drop-zone]");
  if (!dropZone) return;
  event.preventDefault();
  const nextStatus = dropZone.dataset.plannerDropZone || "";
  if (!plannerDraggedTaskId || !PLANNER_STATUS_OPTIONS.includes(nextStatus)) return;
  setPlannerTaskStatus(plannerDraggedTaskId, nextStatus);
  plannerDraggedTaskId = "";
});
}

document.addEventListener("click", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const noteCloseButton = target.closest("[data-planner-note-close]");
  if (noteCloseButton) {
    closePlannerNoteWindow(noteCloseButton.dataset.plannerNoteClose || "");
    return;
  }

  const noteMinimizeButton = target.closest("[data-planner-note-minimize]");
  if (noteMinimizeButton) {
    togglePlannerNoteMinimized(noteMinimizeButton.dataset.plannerNoteMinimize || "");
    return;
  }

  const notePinButton = target.closest("[data-planner-note-pin]");
  if (notePinButton && notePinButton.closest("[data-planner-note-window]")) {
    togglePlannerNotePinned(notePinButton.dataset.plannerNotePin || "");
    return;
  }

  const noteColorButton = target.closest("[data-planner-note-color]");
  if (noteColorButton) {
    updatePlannerNoteField(
      noteColorButton.dataset.plannerNoteColor || "",
      "color",
      noteColorButton.dataset.colorValue || "amber",
    );
    renderPlannerFloatingNotes();
    refreshPlannerStudioUi();
  }
});

document.addEventListener("input", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const noteTitleInput = target.closest("[data-planner-note-title]");
  if (noteTitleInput) {
    updatePlannerNoteField(
      noteTitleInput.dataset.plannerNoteTitle || "",
      "title",
      /** @type {HTMLInputElement} */ (noteTitleInput).value,
    );
    return;
  }

  const noteBodyInput = target.closest("[data-planner-note-content]");
  if (noteBodyInput) {
    updatePlannerNoteField(
      noteBodyInput.dataset.plannerNoteContent || "",
      "content",
      /** @type {HTMLTextAreaElement} */ (noteBodyInput).value,
    );
  }
});

document.addEventListener("pointerdown", (event) => {
  const target = asElement(event.target);
  if (!target) return;
  const noteWindow = target.closest("[data-planner-note-window]");
  if (!noteWindow) return;
  const noteId = noteWindow.dataset.plannerNoteWindow || "";
  bringPlannerNoteToFront(noteId);
  const note = getPlannerNoteById(noteId);
  if (note) {
    noteWindow.style.zIndex = String(note.z);
  }
  if (
    target.closest("button") ||
    target.closest("input") ||
    target.closest("textarea") ||
    target.closest(".planner-note-palette")
  ) {
    return;
  }
  const dragHandle = target.closest("[data-planner-note-drag]");
  if (!dragHandle) return;
  event.preventDefault();
  startPlannerNoteDrag(dragHandle.dataset.plannerNoteDrag || "", event.clientX, event.clientY);
});

document.addEventListener("pointermove", (event) => {
  if (!plannerNoteDragState) return;
  event.preventDefault();
  updatePlannerNoteDrag(event.clientX, event.clientY);
});

document.addEventListener("pointerup", () => {
  stopPlannerNoteDrag();
});

el.messagesArea.addEventListener("click", (event) => {
  if (activeChannel.type !== "home") return;
  const target = asElement(event.target);
  if (!target) return;

  const taskToggleButton = target.closest("[data-home-task-toggle]");
  if (taskToggleButton) {
    togglePlannerTaskDone(taskToggleButton.dataset.homeTaskToggle || "");
    return;
  }

  const openTaskButton = target.closest("[data-home-open-task]");
  if (openTaskButton) {
    handleDashboardOpen("task", openTaskButton.dataset.homeOpenTask || "");
    return;
  }

  const openGroupButton = target.closest("[data-home-open-group]");
  if (openGroupButton) {
    handleDashboardOpen("group", openGroupButton.dataset.homeOpenGroup || "");
    return;
  }

  const openDirectButton = target.closest("[data-home-open-direct]");
  if (openDirectButton) {
    handleDashboardOpen("direct", openDirectButton.dataset.homeOpenDirect || "");
    return;
  }

  const openNoteButton = target.closest("[data-home-open-note]");
  if (openNoteButton) {
    handleDashboardOpen("note", openNoteButton.dataset.homeOpenNote || "");
    return;
  }

  const openInboxButton = target.closest("[data-home-open-inbox]");
  if (openInboxButton) {
    openInboxPanel();
    return;
  }

  const quickActionButton = target.closest("[data-home-quick]");
  if (!quickActionButton) return;

  const action = quickActionButton.dataset.homeQuick || "";
  if (action === "planner") {
    openDashboardPlanner();
    return;
  }
  if (action === "task") {
    openDashboardTaskPlanner("");
    return;
  }
  if (action === "focus") {
    startDashboardFocusMode();
    return;
  }
  if (action === "continue") {
    openDashboardContinue();
  }
});

el.messagesArea.addEventListener("input", (event) => {
  if (activeChannel.type !== "home") return;
  const target = asElement(event.target);
  const quickNoteField = target && target.closest("[data-home-quick-note-input]");
  if (!(quickNoteField instanceof HTMLTextAreaElement)) return;
  plannerState.quickNote = normalizePlannerTextBlock(quickNoteField.value, 1200);
  persistPlannerState();
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

el.messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = el.messageInput.value.trim();
  if (!content) return;
  if (activeChannel.type === "home") {
    showToast("Pick a chat before sending a message.");
    return;
  }
  if (!stompClient || !stompClient.connected) {
    connectWs();
    const sent =
      activeChannel.type === "group"
        ? await sendGroupMessageFallback(content)
        : await sendDirectMessageFallback(content);
    if (sent) {
      el.messageInput.value = "";
      showToast("Message sent. Live sync is reconnecting.");
    }
    syncComposer();
    return;
  }
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
  const input = /** @type {HTMLInputElement} */ (event.currentTarget);
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.size) {
    input.value = "";
    showToast("The selected file is empty.");
    return;
  }
  if (String(file.type || "").startsWith("video/")) {
    input.value = "";
    showToast("Video attachments are not supported in this chat.");
    return;
  }
  if (activeChannel.type === "direct") {
    await uploadDirectAttachment(file);
    return;
  }
  if (activeChannel.type === "group") {
    await uploadGroupAttachment(file);
  }
});

el.homeRailButton.addEventListener("click", () => {
  setRosterFilter("all");
  selectDefaultConversation();
});
el.newGroupToggleInput.addEventListener("click", toggleCreateGroupPopover);
el.studyTimerToggleButton.addEventListener("click", toggleStudyTimerPopover);
el.settingsToggleButton.addEventListener("click", toggleSettingsPopover);
el.settingsCloseButton.addEventListener("click", closeSettingsPopover);
el.studyTimerCloseButton.addEventListener("click", closeStudyTimerPopover);
el.createGroupCloseButton.addEventListener("click", closeCreateGroupPopover);
el.createGroupCancelBtn.addEventListener("click", closeCreateGroupPopover);
if (el.studyNotesToggleButton) {
  el.studyNotesToggleButton.addEventListener("click", toggleStudyNotesPopover);
}
if (el.studyNotesCloseButton) {
  el.studyNotesCloseButton.addEventListener("click", closeStudyNotesPopover);
}
el.settingsScrim.addEventListener("click", () => {
  closeMessageActionMenu();
  closeInboxPanel();
  closeSettingsPopover();
  closeStudyTimerPopover();
  closeStudyNotesPopover();
  closeCreateGroupPopover();
});
if (el.createGroupSidebarBtn) {
  el.createGroupSidebarBtn.addEventListener("click", openCreateGroupPopover);
}
if (el.headerInboxButton) {
  el.headerInboxButton.addEventListener("click", () => {
    const isOpen = Boolean(el.previewApp && el.previewApp.classList.contains("details-open"));
    if (isOpen && previewDetailsMode === "channel") {
      closePreviewDetails();
      return;
    }
    openActiveChannelDetails();
  });
}
el.notificationToggleButton.addEventListener("click", toggleInboxPanel);
el.closeInboxButton.addEventListener("click", closeInboxPanel);
el.sidebarLogoutBtn.addEventListener("click", logout);
window.addEventListener("beforeunload", () => {
  try {
    if (workspaceRefreshTimer) window.clearInterval(workspaceRefreshTimer);
    if (studyTimerTicker) window.clearInterval(studyTimerTicker);
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
document.addEventListener("pointerdown", (event) => {
  if (!messageActionMenuState) return;
  const target = event.target;
  if (!(target instanceof Node)) {
    closeMessageActionMenu();
    return;
  }
  if (
    messageActionMenuState.menu.contains(target) ||
    messageActionMenuState.trigger.contains(target)
  ) {
    return;
  }
  closeMessageActionMenu();
});
document.addEventListener("keydown", (event) => {
  const target = asElement(event.target);
  const isTypingTarget =
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable);

  if (isStudyTimerPopoverOpen() && !isTypingTarget && !event.metaKey && !event.ctrlKey && !event.altKey) {
    if (event.code === "Space") {
      event.preventDefault();
      toggleStudyTimer();
      return;
    }
    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      resetStudyTimer();
      return;
    }
    if (event.key === "l" || event.key === "L") {
      event.preventDefault();
      triggerStudyTimerAuxAction();
      return;
    }
    if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      toggleStudyTimerFullscreen();
      return;
    }
  }

  if (event.key !== "Escape") return;
  if (messageActionMenuState) {
    closeMessageActionMenu();
    return;
  }
  if (isInboxPanelOpen()) {
    closeInboxPanel();
    return;
  }
  if (isStudyTimerPopoverOpen()) {
    closeStudyTimerPopover();
    return;
  }
  if (isStudyNotesPopoverOpen()) {
    closeStudyNotesPopover();
    return;
  }
  if (isCreateGroupPopoverOpen()) {
    closeCreateGroupPopover();
    return;
  }
  if (isSettingsPopoverOpen()) {
    closeSettingsPopover();
  }
});
window.addEventListener("resize", () => {
  closeMessageActionMenu();
  syncInboxToggleState();
  if (isInboxPanelOpen()) {
    positionInboxPanel();
  }
  if (isSettingsPopoverOpen()) {
    positionSettingsPopover();
  }
  if (isStudyNotesPopoverOpen()) {
    positionStudyNotesPopover();
  }
  if (isCreateGroupPopoverOpen()) {
    positionCreateGroupPopover();
  }
  syncInboxToggleState();
});
window.addEventListener(
  "scroll",
  () => {
    closeMessageActionMenu();
    if (isInboxPanelOpen()) {
      positionInboxPanel();
    }
    if (isSettingsPopoverOpen()) {
      positionSettingsPopover();
    }
    if (isStudyNotesPopoverOpen()) {
      positionStudyNotesPopover();
    }
    if (isCreateGroupPopoverOpen()) {
      positionCreateGroupPopover();
    }
  },
  true,
);
window.addEventListener("load", bootstrap);
