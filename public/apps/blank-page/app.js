/* Minimal “Blank Page”-style editor: just type, auto-saves locally. */

const editor = document.getElementById("editor");
const help = document.getElementById("help");

function normalizeDocId(raw) {
  const v = (raw ?? "").trim();
  return v ? v : "untitled";
}

function getDocIdFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  try {
    return normalizeDocId(decodeURIComponent(hash));
  } catch {
    return normalizeDocId(hash);
  }
}

function setHashFromDocId(docId) {
  const encoded = encodeURIComponent(docId);
  if (window.location.hash.replace(/^#/, "") === encoded) return;
  window.location.hash = encoded;
}

function storageKey(docId) {
  return `blankpage:doc:${docId}`;
}

function setTitle(docId) {
  document.title = docId === "untitled" ? "Blank Page" : `${docId} – Blank Page`;
}

let currentDocId = getDocIdFromHash();
let saveTimer = null;

function loadDoc(docId) {
  const key = storageKey(docId);
  const value = localStorage.getItem(key);
  editor.value = value ?? "";
  currentDocId = docId;
  setTitle(docId);
  // Put caret at end; keep it simple.
  editor.focus();
  editor.setSelectionRange(editor.value.length, editor.value.length);
}

function saveDoc(docId, text) {
  localStorage.setItem(storageKey(docId), text);
}

function scheduleSave() {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveDoc(currentDocId, editor.value);
    saveTimer = null;
  }, 300);
}

function downloadTxt(filenameBase, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

editor.addEventListener("input", scheduleSave);

window.addEventListener("hashchange", () => {
  // Save current before switching.
  saveDoc(currentDocId, editor.value);
  loadDoc(getDocIdFromHash());
});

window.addEventListener("beforeunload", () => {
  saveDoc(currentDocId, editor.value);
});

window.addEventListener("keydown", (e) => {
  if (!e.ctrlKey || e.altKey || e.metaKey) return;

  const key = e.key.toLowerCase();

  // Ctrl+S: download
  if (key === "s") {
    e.preventDefault();
    saveDoc(currentDocId, editor.value);
    downloadTxt(currentDocId, editor.value);
    return;
  }

  // Ctrl+K: switch doc
  if (key === "k") {
    e.preventDefault();
    const next = prompt(
      "Switch to which note? (This uses your browser storage)",
      currentDocId,
    );
    if (next == null) return;
    setHashFromDocId(normalizeDocId(next));
    return;
  }

  // Ctrl+/: help
  if (key === "/") {
    e.preventDefault();
    if (help.open) help.close();
    else help.showModal();
  }
});

// First load
if (!window.location.hash) {
  setHashFromDocId(currentDocId);
}
loadDoc(currentDocId);

