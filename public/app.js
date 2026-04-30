const editor = document.querySelector("#shared-text");
const status = document.querySelector("#status");
const lastUpdated = document.querySelector("#last-updated");
const characterCount = document.querySelector("#character-count");

const EVENTS_URL = "/api/space/events";

const STORAGE_KEY = "third-space-local-space";

let saveTimer;
let localText = "";
let lastServerText = "";
let isSaving = false;
let isEditing = false;

function setStatus(message, state = "live") {
  status.textContent = message;
  status.className = `status-pill is-${state}`;
}

function updateMeta(text, updatedAt) {
  characterCount.textContent = `${text.length.toLocaleString()} character${text.length === 1 ? "" : "s"}`;

  if (!updatedAt) {
    lastUpdated.textContent = "Not saved yet";
    return;
  }

  const time = new Date(updatedAt);
  lastUpdated.textContent = `Last saved ${time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  })}`;
}

async function loadSpace({ quiet = false } = {}) {
  try {
    const response = await fetch("/api/space");

    if (!response.ok) {
      throw new Error("Could not load shared text.");
    }

    const space = await response.json();
    lastServerText = space.text;

    if (!isEditing && !isSaving && editor.value !== space.text) {
      editor.value = space.text;
      localText = space.text;
    }

    updateMeta(editor.value, space.updatedAt);
    setStatus("Live", "live");
  } catch {
    const stored = loadLocalSpace();
    if (stored) {
      lastServerText = stored.text;
      if (!isEditing && !isSaving && editor.value !== stored.text) {
        editor.value = stored.text;
        localText = stored.text;
      }

      updateMeta(editor.value, stored.updatedAt);
      setStatus("Offline", "error");
      return;
    }

    if (!quiet) {
      setStatus("Offline", "error");
    }
  }
}

function loadLocalSpace() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalSpace(space) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(space));
  } catch {
    // ignore localStorage failures
  }
}

function setupEventStream() {
  if (!window.EventSource) {
    return;
  }

  const source = new EventSource(EVENTS_URL);

  source.addEventListener("message", (event) => {
    try {
      const space = JSON.parse(event.data);
      lastServerText = space.text;

      if (!isEditing && !isSaving && editor.value !== space.text) {
        editor.value = space.text;
        localText = space.text;
      }

      updateMeta(editor.value, space.updatedAt);
      setStatus("Live", "live");
    } catch {
      // ignore malformed event data
    }
  });

  source.addEventListener("error", () => {
    setStatus("Offline", "error");
  });
}

async function saveSpace() {
  localText = editor.value;
  if (localText === lastServerText) {
    setStatus("Live", "live");
    return;
  }

  isSaving = true;
  setStatus("Saving", "saving");

  try {
    const response = await fetch("/api/space", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: localText })
    });

    if (!response.ok) {
      throw new Error("Could not save shared text.");
    }

    const space = await response.json();
    lastServerText = space.text;
    updateMeta(space.text, space.updatedAt);
    setStatus("Live", "live");
  } catch {
    const space = {
      text: localText,
      updatedAt: new Date().toISOString()
    };

    saveLocalSpace(space);
    lastServerText = space.text;
    updateMeta(space.text, space.updatedAt);
    setStatus("Saved locally", "live");
  } finally {
    isSaving = false;
  }
}

editor.addEventListener("input", () => {
  localText = editor.value;
  updateMeta(localText);
  setStatus("Editing", "saving");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveSpace, 500);
});

editor.addEventListener("focus", () => {
  isEditing = true;
});

editor.addEventListener("blur", () => {
  isEditing = false;
  clearTimeout(saveTimer);
  saveSpace();
});

loadSpace();
setupEventStream();
setInterval(() => loadSpace({ quiet: true }), 2500);
