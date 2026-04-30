const editor = document.querySelector("#shared-text");
const status = document.querySelector("#status");
const lastUpdated = document.querySelector("#last-updated");
const characterCount = document.querySelector("#character-count");

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
    if (!quiet) {
      setStatus("Offline", "error");
    }
  }
}

async function saveSpace() {
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
    setStatus("Save failed", "error");
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
setInterval(() => loadSpace({ quiet: true }), 2500);
