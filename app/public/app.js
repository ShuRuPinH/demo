const form = document.getElementById("note-form");
const notesEl = document.getElementById("notes");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refresh");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderNotes(notes) {
  if (!notes.length) {
    notesEl.innerHTML = '<li class="empty">Пока нет записей.</li>';
    return;
  }

  notesEl.innerHTML = notes
    .map(
      (note) => `
      <li>
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.body || "")}</p>
        <time datetime="${note.created_at}">${formatDate(note.created_at)}</time>
      </li>
    `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadNotes() {
  setStatus("Загрузка...");
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error("Не удалось загрузить записи");
    const notes = await res.json();
    renderNotes(notes);
    setStatus(`Всего записей: ${notes.length}`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = form.title.value.trim();
  const body = form.body.value.trim();

  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Не удалось сохранить запись");
    }

    form.reset();
    await loadNotes();
    setStatus("Запись добавлена");
  } catch (err) {
    setStatus(err.message, true);
  }
});

refreshBtn.addEventListener("click", loadNotes);
loadNotes();
