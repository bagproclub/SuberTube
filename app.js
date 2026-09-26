'use strict';

const header = document.querySelector('[data-header]');
const shellControls = document.querySelectorAll('[data-shell-control], [data-notification]');
const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const searchStatus = document.querySelector('[data-search-status]');
const searchTrigger = document.querySelector('[data-search-trigger]');
const videoForm = document.querySelector('[data-video-form]');
const videoInput = document.querySelector('[data-video-input]');
const videoStatus = document.querySelector('[data-video-status]');
const playerShell = document.querySelector('[data-player-shell]');
const playerFrame = document.querySelector('[data-player-frame]');
const saveLibraryButton = document.querySelector('[data-save-library]');
const libraryList = document.querySelector('[data-library-list]');
const historyList = document.querySelector('[data-history-list]');
const profileTrigger = document.querySelector('[data-profile-trigger]');
const profileSheet = document.querySelector('[data-profile-sheet]');
const profileBackdrop = document.querySelector('[data-profile-backdrop]');
const profileCloseButtons = document.querySelectorAll('[data-profile-close]');
const profileForm = document.querySelector('[data-profile-form]');
const profileInput = document.querySelector('[data-profile-input]');
const profileList = document.querySelector('[data-profile-list]');
const profileSummary = document.querySelector('[data-profile-summary]');

const YOUTUBE_SEARCH_ORIGIN = 'https://www.youtube.com/';
const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube.com';
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const LIBRARY_STORAGE_KEY = 'subertube.library.v1';
const HISTORY_STORAGE_KEY = 'subertube.history.v1';
const PROFILES_STORAGE_KEY = 'subertube.profiles.v1';
const ACTIVE_PROFILE_STORAGE_KEY = 'subertube.active-profile.v1';
const MAX_LIBRARY_ITEMS = 20;
const MAX_HISTORY_ITEMS = 30;
const MAX_PROFILES = 5;
let currentVideoId = null;

const readStoredList = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && isValidVideoId(item.videoId)) : [];
  } catch {
    return [];
  }
};

const writeStoredList = (key, items) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};

const formatStoredTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
};

const isValidVideoId = (value) => YOUTUBE_VIDEO_ID_PATTERN.test(value || '');

const extractYouTubeVideoId = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;

  const host = url.hostname.toLowerCase();
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0] || '';
    return isValidVideoId(id) ? id : null;
  }

  if (host !== 'www.youtube.com' && host !== 'm.youtube.com' && host !== 'youtube.com') return null;

  const parts = url.pathname.split('/').filter(Boolean);
  if (url.pathname === '/watch') {
    const id = url.searchParams.get('v') || '';
    return isValidVideoId(id) ? id : null;
  }

  if (['embed', 'shorts', 'live'].includes(parts[0])) {
    const id = parts[1] || '';
    return isValidVideoId(id) ? id : null;
  }

  if (parts[0] === 'attribution_link') {
    for (const key of ['u', 'q', 'url']) {
      const nested = url.searchParams.get(key);
      if (nested) {
        const id = extractYouTubeVideoId(nested);
        if (id) return id;
      }
    }
  }

  return null;
};

const buildYouTubeEmbedUrl = (videoId, pageOrigin) => {
  if (!isValidVideoId(videoId)) return null;
  const url = new URL(`/embed/${videoId}`, YOUTUBE_EMBED_ORIGIN);
  if (pageOrigin) {
    try {
      const page = new URL(pageOrigin);
      if (/^https?:$/.test(page.protocol) && page.origin !== 'https://appassets.androidplatform.net') {
        url.searchParams.set('origin', page.origin);
      }
    } catch {
      // The fixed YouTube embed origin remains valid without an optional origin parameter.
    }
  }
  return url.href;
};

const createVideoListItem = (item, { removable = false } = {}) => {
  const li = document.createElement('li');
  li.className = 'library-item';

  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'library-open';
  open.dataset.openVideo = item.videoId;
  open.textContent = `YouTube • ${item.videoId}`;

  const meta = document.createElement('span');
  meta.className = 'library-meta';
  meta.textContent = formatStoredTime(item.openedAt || item.savedAt);

  li.append(open, meta);

  if (removable) {
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'library-remove';
    remove.textContent = 'ลบ';
    remove.dataset.removeLibrary = item.videoId;
    li.append(remove);
  }

  return li;
};

const renderLibraryHistory = () => {
  if (libraryList) {
    libraryList.replaceChildren();
    const items = readStoredList(LIBRARY_STORAGE_KEY);
    if (!items.length) {
      const empty = document.createElement('li');
      empty.className = 'library-empty';
      empty.textContent = 'ยังไม่มีรายการที่บันทึก';
      libraryList.append(empty);
    } else {
      items.forEach((item) => libraryList.append(createVideoListItem(item, { removable: true })));
    }
  }

  if (historyList) {
    historyList.replaceChildren();
    const items = readStoredList(HISTORY_STORAGE_KEY);
    if (!items.length) {
      const empty = document.createElement('li');
      empty.className = 'library-empty';
      empty.textContent = 'ยังไม่มีประวัติการเปิดวิดีโอ';
      historyList.append(empty);
    } else {
      items.forEach((item) => historyList.append(createVideoListItem(item)));
    }
  }
};

const recordHistory = (videoId) => {
  const next = [{ videoId, openedAt: new Date().toISOString() }, ...readStoredList(HISTORY_STORAGE_KEY).filter((item) => item.videoId !== videoId)].slice(0, MAX_HISTORY_ITEMS);
  writeStoredList(HISTORY_STORAGE_KEY, next);
};

const saveCurrentVideoToLibrary = () => {
  if (!currentVideoId) return;
  const existing = readStoredList(LIBRARY_STORAGE_KEY);
  if (existing.some((item) => item.videoId === currentVideoId)) return;
  const next = [{ videoId: currentVideoId, savedAt: new Date().toISOString() }, ...existing].slice(0, MAX_LIBRARY_ITEMS);
  writeStoredList(LIBRARY_STORAGE_KEY, next);
  renderLibraryHistory();
};

const setSearchStatus = (message) => {
  if (searchStatus) searchStatus.textContent = message;
};

const setVideoStatus = (message) => {
  if (videoStatus) videoStatus.textContent = message;
};

const renderYouTubePlayer = (videoId) => {
  if (!playerShell || !playerFrame) return;
  const destination = buildYouTubeEmbedUrl(videoId, window.location.href);
  if (!destination) {
    setVideoStatus('วิดีโอไม่ผ่าน URL safety boundary');
    return;
  }

  const parsed = new URL(destination);
  if (parsed.protocol !== 'https:' || parsed.origin !== YOUTUBE_EMBED_ORIGIN || !parsed.pathname.startsWith('/embed/')) {
    setVideoStatus('ปลายทางไม่ผ่าน URL safety boundary');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.title = 'YouTube video player';
  iframe.loading = 'eager';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.src = parsed.href;

  playerFrame.replaceChildren(iframe);
  playerShell.hidden = false;
  currentVideoId = videoId;
  recordHistory(videoId);
  renderLibraryHistory();
  setVideoStatus('เปิดผ่าน Official YouTube IFrame Player');
  if (window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set('video', videoId);
    window.history.replaceState(null, '', url.pathname + url.search);
  }
};

const buildYouTubeSearchUrl = (query) => {
  const url = new URL('results', YOUTUBE_SEARCH_ORIGIN);
  url.searchParams.set('search_query', query);
  return url.href;
};

const readProfiles = () => {
  try {
    const raw = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((profile) => profile && typeof profile.id === 'string' && typeof profile.name === 'string' && profile.name.trim()).slice(0, MAX_PROFILES) : [];
  } catch {
    return [];
  }
};

const writeProfiles = (profiles) => {
  try {
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles.slice(0, MAX_PROFILES)));
    return true;
  } catch {
    return false;
  }
};

const getActiveProfileId = () => {
  try {
    return window.localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY) || 'guest';
  } catch {
    return 'guest';
  }
};

const setActiveProfileId = (id) => {
  try {
    window.localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, id);
  } catch {
    // Local-only profile is best-effort; guest remains usable.
  }
};

const getActiveProfile = () => {
  const id = getActiveProfileId();
  if (id === 'guest') return { id: 'guest', name: 'Guest' };
  return readProfiles().find((profile) => profile.id === id) || { id: 'guest', name: 'Guest' };
};

const renderProfiles = () => {
  const active = getActiveProfile();
  if (profileSummary) {
    profileSummary.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = `ใช้งานอยู่: ${active.name}`;
    const note = document.createElement('span');
    note.textContent = active.id === 'guest' ? 'เล่นวิดีโอได้โดยไม่ต้องมีบัญชี' : 'โปรไฟล์นี้เก็บเฉพาะในเครื่อง';
    profileSummary.append(title, note);
  }
  if (profileTrigger) profileTrigger.setAttribute('aria-label', `โปรไฟล์ปัจจุบัน: ${active.name}`);

  if (profileList) {
    profileList.replaceChildren();
    const guestItem = document.createElement('li');
    guestItem.className = 'profile-item';
    const guestName = document.createElement('span');
    guestName.textContent = 'Guest';
    const guestAction = document.createElement('button');
    guestAction.type = 'button';
    guestAction.textContent = active.id === 'guest' ? 'ใช้งานอยู่' : 'เลือก';
    guestAction.dataset.selectProfile = 'guest';
    guestAction.disabled = active.id === 'guest';
    guestItem.append(guestName, guestAction);
    profileList.append(guestItem);

    readProfiles().forEach((profile) => {
      const item = document.createElement('li');
      item.className = 'profile-item';
      const name = document.createElement('span');
      name.textContent = profile.name;
      const actions = document.createElement('span');
      actions.className = 'profile-item-actions';
      const use = document.createElement('button');
      use.type = 'button';
      use.textContent = active.id === profile.id ? 'ใช้งานอยู่' : 'เลือก';
      use.dataset.selectProfile = profile.id;
      use.disabled = active.id === profile.id;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'ลบ';
      remove.dataset.removeProfile = profile.id;
      actions.append(use, remove);
      item.append(name, actions);
      profileList.append(item);
    });
  }
};

const openProfileSheet = () => {
  renderProfiles();
  if (profileSheet) profileSheet.hidden = false;
  if (profileBackdrop) profileBackdrop.hidden = false;
  profileInput?.focus({ preventScroll: true });
};

const closeProfileSheet = () => {
  if (profileSheet) profileSheet.hidden = true;
  if (profileBackdrop) profileBackdrop.hidden = true;
};

if (searchTrigger && searchInput) {
  searchTrigger.addEventListener('click', () => {
    searchInput.focus({ preventScroll: true });
    searchInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
}

if (profileTrigger) profileTrigger.addEventListener('click', openProfileSheet);
profileCloseButtons.forEach((button) => button.addEventListener('click', closeProfileSheet));
profileBackdrop?.addEventListener('click', closeProfileSheet);

if (profileForm && profileInput) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = profileInput.value.trim();
    if (!name) {
      profileInput.focus();
      return;
    }
    const profiles = readProfiles();
    if (profiles.some((profile) => profile.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    if (profiles.length >= MAX_PROFILES) return;
    const id = `profile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    profiles.unshift({ id, name, createdAt: new Date().toISOString() });
    if (writeProfiles(profiles)) setActiveProfileId(id);
    profileInput.value = '';
    renderProfiles();
  });
}

if (profileList) {
  profileList.addEventListener('click', (event) => {
    const select = event.target.closest('[data-select-profile]');
    if (select) {
      setActiveProfileId(select.dataset.selectProfile || 'guest');
      renderProfiles();
      return;
    }
    const remove = event.target.closest('[data-remove-profile]');
    if (remove) {
      const id = remove.dataset.removeProfile;
      const profiles = readProfiles().filter((profile) => profile.id !== id);
      writeProfiles(profiles);
      if (getActiveProfileId() === id) setActiveProfileId('guest');
      renderProfiles();
    }
  });
}

if (videoForm && videoInput) {
  videoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const videoId = extractYouTubeVideoId(videoInput.value);
    if (!videoId) {
      setVideoStatus('กรุณาใช้ลิงก์ YouTube ของวิดีโอที่ถูกต้อง');
      videoInput.focus();
      return;
    }
    renderYouTubePlayer(videoId);
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      setSearchStatus('กรุณาพิมพ์คำค้นหาก่อน');
      searchInput.focus();
      return;
    }

    const destination = buildYouTubeSearchUrl(query);
    const parsed = new URL(destination);
    if (parsed.protocol !== 'https:' || parsed.origin !== 'https://www.youtube.com') {
      setSearchStatus('ปลายทางไม่ผ่าน URL safety boundary');
      return;
    }

    setSearchStatus('กำลังเปิด Official YouTube Search ในพื้นที่ค้นหา...');
    window.location.assign(parsed.href);
  });
}

if (libraryList) {
  libraryList.addEventListener('click', (event) => {
    const open = event.target.closest('[data-open-video]');
    if (open) {
      const videoId = open.dataset.openVideo;
      if (isValidVideoId(videoId)) renderYouTubePlayer(videoId);
    }
    const button = event.target.closest('[data-remove-library]');
    if (button) {
      const videoId = button.dataset.removeLibrary;
      const next = readStoredList(LIBRARY_STORAGE_KEY).filter((item) => item.videoId !== videoId);
      writeStoredList(LIBRARY_STORAGE_KEY, next);
      renderLibraryHistory();
    }
  });
}

if (historyList) {
  historyList.addEventListener('click', (event) => {
    const open = event.target.closest('[data-open-video]');
    if (!open) return;
    const videoId = open.dataset.openVideo;
    if (isValidVideoId(videoId)) renderYouTubePlayer(videoId);
  });
}

if (saveLibraryButton) saveLibraryButton.addEventListener('click', saveCurrentVideoToLibrary);

if (header) {
  const updateCompactState = () => header.classList.toggle('is-compact', window.scrollY > 24);
  updateCompactState();
  window.addEventListener('scroll', updateCompactState, { passive: true });
}

shellControls.forEach((control) => {
  control.addEventListener('pointerdown', () => control.classList.add('is-pressed'));
  control.addEventListener('pointerup', () => control.classList.remove('is-pressed'));
  control.addEventListener('pointercancel', () => control.classList.remove('is-pressed'));
  control.addEventListener('blur', () => control.classList.remove('is-pressed'));
});

const canonicalizeLocalQuery = () => {
  const url = new URL(window.location.href);
  const currentVideoId = url.searchParams.get('video');
  const nextSearch = new URLSearchParams();
  if (isValidVideoId(currentVideoId)) nextSearch.set('video', currentVideoId);
  const nextSuffix = nextSearch.toString();
  const next = `${url.pathname}${nextSuffix ? `?${nextSuffix}` : ''}${url.hash}`;
  const current = `${url.pathname}${url.search}${url.hash}`;
  if (next !== current && window.history?.replaceState) {
    window.history.replaceState(null, '', next);
  }
  return isValidVideoId(currentVideoId) ? currentVideoId : null;
};

const initialVideoId = canonicalizeLocalQuery();
if (isValidVideoId(initialVideoId)) renderYouTubePlayer(initialVideoId);

renderLibraryHistory();
renderProfiles();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profileSheet && !profileSheet.hidden) closeProfileSheet();
});
