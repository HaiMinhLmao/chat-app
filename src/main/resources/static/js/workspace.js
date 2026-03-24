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
 * @param {string} id
 * @returns {HTMLSelectElement}
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
  newGroupBtn: mustGetButton("newGroupBtn"),
  studyTimerToggleButton: mustGetButton("studyTimerToggleButton"),
  settingsToggleButton: mustGetButton("settingsToggleButton"),
  dashboardNavButton: getOptionalButton("dashboardNavButton"),
  friendsNavButton: getOptionalButton("friendsNavButton"),
  groupNavButton: getOptionalButton("groupNavButton"),
  userAvatar: mustGetElement("userAvatar"),
  userName: mustGetElement("userName"),
  userEmail: mustGetElement("userEmail"),
  friendCard: mustGetElement("friendCard"),
  friendCardToggle: mustGetButton("friendCardToggle"),
  friendsCard: mustGetElement("friendsCard"),
  friendsCardToggle: mustGetButton("friendsCardToggle"),
  friendRequestForm: mustGetForm("friendRequestForm"),
  friendEmailInput: mustGetInput("friendEmailInput"),
  friendSubmitBtn: mustGetButton("friendSubmitBtn"),
  friendRequestFeedback: mustGetElement("friendRequestFeedback"),
  friendsSearchInput: mustGetInput("friendsSearchInput"),
  settingsPopover: mustGetElement("settingsPopover"),
  settingsCloseButton: mustGetButton("settingsCloseButton"),
  settingsScrim: mustGetElement("settingsScrim"),
  studyTimerPopover: mustGetElement("studyTimerPopover"),
  studyTimerCloseButton: mustGetButton("studyTimerCloseButton"),
  studyTimerPanelMount: mustGetElement("studyTimerPanelMount"),
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
  clearSearchButton: getOptionalButton("clearSearchButton"),
  previewFilterSummary: getOptionalElement("previewFilterSummary"),
  previewRosterBadge: getOptionalElement("previewRosterBadge"),
  chatKicker: mustGetElement("chatKicker"),
  chatTitle: mustGetElement("chatTitle"),
  chatSubtitle: mustGetElement("chatSubtitle"),
  chatAvatar: getOptionalElement("chatAvatar"),
  connectionState: mustGetElement("connectionState"),
  headerInboxButton: getOptionalButton("headerInboxButton"),
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
  previewApp: getOptionalElement("previewApp"),
  previewSidebarAvatar: getOptionalElement("previewSidebarAvatar"),
  previewDetails: getOptionalElement("previewDetails"),
  previewCloseProfile: getOptionalButton("previewCloseProfile"),
  previewProfileAvatar: getOptionalElement("previewProfileAvatar"),
  previewProfileName: getOptionalElement("previewProfileName"),
  previewProfileEmail: getOptionalElement("previewProfileEmail"),
  previewProfilePhone: getOptionalElement("previewProfilePhone"),
  previewProfileStatus: getOptionalElement("previewProfileStatus"),
  previewMutualCount: getOptionalElement("previewMutualCount"),
  previewAddFriendBtn: getOptionalButton("previewAddFriendBtn"),
  previewGroupInfoBtn: getOptionalButton("previewGroupInfoBtn"),
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
const previews = new Map();
const AUTH_SESSION_KEY = "authSession";
const LEGACY_SESSION_KEY = "supabaseSession";
const FRIEND_CARD_STORAGE_KEY = "workspaceFriendCardCollapsed";
const FRIENDS_CARD_STORAGE_KEY = "workspaceFriendsCardCollapsed";
const THEME_STORAGE_KEY = "workspaceTheme";
const STUDY_TIMER_STORAGE_KEY = "workspaceStudyTimer";
const SETTINGS_DRAWER_BREAKPOINT = 760;
const MINUTE_MS = 60000;
let studyTimerTicker = null;

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
  el.settingsThemeLight.checked = preference === "light";
  el.settingsThemeDark.checked = preference === "dark";
  el.settingsThemeAuto.checked = preference === "auto";
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
    el.chatTitle.textContent = name;
    syncAvatarNode(el.chatAvatar, name, currentUser.avatarUrl);
    refreshHomeOverviewIfNeeded();
  }
  syncPreviewProfilePanel();
  renderFavoritesStrip();
}

function setPreviewDetailsOpen(nextOpen) {
  if (!el.previewApp || !el.previewDetails) return;
  el.previewApp.classList.toggle("details-open", nextOpen);
  if (nextOpen) {
    el.previewDetails.scrollTop = 0;
  }
}

function closePreviewDetails() {
  setPreviewDetailsOpen(false);
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

function syncPreviewProfilePanel() {
  if (
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

  if (activeChannel.type === "direct") {
    const friend = activeFriendRecord();
    if (friend) {
      name = displayName(friend);
      avatarUrl = friend.avatarUrl || "";
      contact = friend.email || "friend@myclassroom.app";
      detail = "Direct message";
      status = "Accepted friend";
      meta = groups.length ? String(groups.length) + " active groups in workspace" : "Ready to chat";
      emailHref = friend.email ? "mailto:" + friend.email : "#";
    }
  } else if (activeChannel.type === "group") {
    const group = activeGroupRecord();
    if (group) {
      name = group.name || "Study Group";
      avatarUrl = "";
      contact = group.category || "Group room";
      detail = group.description || "Shared workspace for classmates and team members.";
      status = "Group conversation";
      meta = String(groups.length) + " groups available";
      emailHref = "#";
    }
  }

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
    activeChannel.type !== "group",
    activeChannel.type === "home" ? "Add Friend" : "Pinned Contact",
    activeChannel.type === "direct",
  );
  showPreviewAction(
    el.previewGroupInfoBtn,
    activeChannel.type === "group",
    "View Group Info",
    false,
  );
}

function normalizeStudyMinutes(value, fallback, maximum) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(maximum || 180, Math.max(1, Math.round(numeric)));
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

function getStudyTimerPanel() {
  return document.querySelector("[data-study-timer]");
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
    syncStudyTimerState();
    refreshStudyTimerUi();
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

function setFriendCardCollapsed(collapsed) {
  if (!el.friendCard || !el.friendCardToggle) return;
  el.friendCard.classList.toggle("is-collapsed", collapsed);
  el.friendCardToggle.classList.toggle("active", !collapsed);
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

function isInboxPanelOpen() {
  return document.body.classList.contains("inbox-open");
}

function syncFlyoutScrim() {
  const isOpen =
    isSettingsPopoverOpen() ||
    isCreateGroupPopoverOpen() ||
    isStudyTimerPopoverOpen() ||
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
  document.body.classList.toggle("create-group-open", nextOpen);
  el.createGroupPopover.setAttribute("aria-hidden", String(!nextOpen));
  el.newGroupBtn.classList.toggle("active", nextOpen);
  el.newGroupBtn.setAttribute("aria-pressed", String(nextOpen));
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
  if (nextOpen && isSettingsPopoverOpen()) {
    setSettingsPopoverOpen(false);
  }
  if (nextOpen && isCreateGroupPopoverOpen()) {
    setCreateGroupPopoverOpen(false);
  }
  if (nextOpen && isStudyTimerPopoverOpen()) {
    setStudyTimerPopoverOpen(false);
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

function createHomeShortcut(name, meta, datasetKey, datasetValue, avatarUrl) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-shortcut";
  button.dataset[datasetKey] = String(datasetValue);

  const avatar = document.createElement("div");
  avatar.className = "channel-avatar";
  syncAvatarNode(avatar, name, avatarUrl || "");

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

  const frame = document.createElement("section");
  frame.className = "home-frame";

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
      friend.avatarUrl || "",
    );
  });

  const groupButtons = groups.slice(0, 4).map((group) =>
    createHomeShortcut(
      group.name || "Study Group",
      getPreview("group", group.id, group.category || "Open room"),
      "homeGroup",
      group.id,
      "",
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

  frame.append(hero, sections);
  wrap.append(frame);
  el.messagesArea.appendChild(wrap);
  el.messagesArea.scrollTop = 0;
}

function refreshHomeOverviewIfNeeded() {
  if (activeChannel.type === "home") renderHomeOverview();
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
        () => selectHome(),
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
  closePreviewDetails();
  syncSurfaceMode();
  el.chatKicker.textContent = "Overview";
  el.chatTitle.textContent = displayName(currentUser);
  el.chatSubtitle.textContent = "Friends, invites, and groups in one place.";
  syncAvatarNode(el.chatAvatar, displayName(currentUser), currentUser && currentUser.avatarUrl);
  showBanner("", "info");
  disconnectSubscription();
  highlightSelection();
  syncPreviewProfilePanel();
  renderFavoritesStrip();
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
  syncComposer();
  loadDirectHistory(friend.email);
  subscribeToDirect(friend.email);
}

function selectGroup(group) {
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

  if (el.clearSearchButton) {
    el.clearSearchButton.hidden = !friendSearchQuery.trim();
  }

  const personalCount = visibleFriends().length;
  const groupCount = visibleGroups().length;
  if (el.previewFilterSummary) {
    const parts = [];
    if (rosterFilter !== "group") parts.push(String(personalCount) + " personal");
    if (rosterFilter !== "personal") parts.push(String(groupCount) + " groups");
    const label = parts.length ? parts.join(" • ") : "No results";
    el.previewFilterSummary.textContent = friendSearchQuery.trim()
      ? 'Search "' + friendSearchQuery.trim() + '" • ' + label
      : label;
  }

  if (el.previewRosterBadge) {
    const totalVisible = personalCount + groupCount;
    el.previewRosterBadge.textContent = totalVisible ? String(totalVisible) + " ready" : "Ready";
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
          getPreview("group", group.id, group.category || "Accepted room"),
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
        (group.category || group.role || "Study room") +
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
  startStudyTimerTicker();
  removeLanguageSettingsField();
  if (!el.studyTimerPanelMount.firstChild) {
    el.studyTimerPanelMount.appendChild(createStudyTimerPanel());
    refreshStudyTimerUi();
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
  await refreshWorkspace();
  handlePanelQuery();
  connectWs();
  if (workspaceRefreshTimer) window.clearInterval(workspaceRefreshTimer);
  workspaceRefreshTimer = window.setInterval(refreshWorkspace, 5000);
}

// Event wiring
el.friendCardToggle.addEventListener("click", () =>
  setFriendCardCollapsed(!el.friendCard.classList.contains("is-collapsed")),
);

el.friendsCardToggle.addEventListener("click", () =>
  setFriendsCardCollapsed(!el.friendsCard.classList.contains("is-collapsed")),
);

el.friendsSearchInput.addEventListener("input", (event) => {
  const input = /** @type {HTMLInputElement} */ (event.currentTarget);
  friendSearchQuery = input.value || "";
  renderFriends();
  renderGroups();
});

const previewChatHead = document.querySelector(".preview-chat-head");
if (previewChatHead) {
  previewChatHead.addEventListener("click", (event) => {
    const target = asElement(event.target);
    if (target && target.closest("button")) return;
    setPreviewDetailsOpen(true);
  });
}

if (el.previewCloseProfile) {
  el.previewCloseProfile.addEventListener("click", closePreviewDetails);
}

if (el.previewAddFriendBtn) {
  el.previewAddFriendBtn.addEventListener("click", () => {
    closePreviewDetails();
    setRosterFilter("personal");
    setFriendCardCollapsed(false);
    el.friendEmailInput.focus();
  });
}

if (el.dashboardNavButton) {
  el.dashboardNavButton.addEventListener("click", () => {
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
    el.friendsSearchInput.focus();
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

if (el.clearSearchButton) {
  el.clearSearchButton.addEventListener("click", () => {
    friendSearchQuery = "";
    el.friendsSearchInput.value = "";
    setRosterFilter(rosterFilter);
    el.friendsSearchInput.focus();
  });
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

el.messagesArea.addEventListener("click", (event) => {
  const target = asElement(event.target);
  if (!target) return;

  const actionButton = target.closest("[data-home-action]");
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

  const friendShortcut = target.closest("[data-home-friend]");
  if (friendShortcut) {
    const email = normalizeEmail(friendShortcut.dataset.homeFriend || "");
    const friend = socialState.friends.find((item) => normalizeEmail(item.email) === email);
    if (friend) selectDirect(friend);
    return;
  }

  const groupShortcut = target.closest("[data-home-group]");
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
  const input = /** @type {HTMLInputElement} */ (event.currentTarget);
  const file = input.files && input.files[0];
  if (!file) return;
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
  selectHome();
});
el.newGroupBtn.addEventListener("click", toggleCreateGroupPopover);
el.studyTimerToggleButton.addEventListener("click", toggleStudyTimerPopover);
el.settingsToggleButton.addEventListener("click", toggleSettingsPopover);
el.settingsCloseButton.addEventListener("click", closeSettingsPopover);
el.studyTimerCloseButton.addEventListener("click", closeStudyTimerPopover);
el.createGroupCloseButton.addEventListener("click", closeCreateGroupPopover);
el.createGroupCancelBtn.addEventListener("click", closeCreateGroupPopover);
el.settingsScrim.addEventListener("click", () => {
  closeInboxPanel();
  closeSettingsPopover();
  closeStudyTimerPopover();
  closeCreateGroupPopover();
});
if (el.createGroupSidebarBtn) {
  el.createGroupSidebarBtn.addEventListener("click", openCreateGroupPopover);
}
if (el.headerInboxButton) {
  el.headerInboxButton.addEventListener("click", toggleInboxPanel);
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
  if (isInboxPanelOpen()) {
    closeInboxPanel();
    return;
  }
  if (isStudyTimerPopoverOpen()) {
    closeStudyTimerPopover();
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
  syncInboxToggleState();
  if (isInboxPanelOpen()) {
    positionInboxPanel();
  }
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
    if (isInboxPanelOpen()) {
      positionInboxPanel();
    }
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
