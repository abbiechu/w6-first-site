(() => {
  const dateElement = document.querySelector("#today-date");
  if (dateElement) {
    const today = new Date();
    dateElement.textContent = new Intl.DateTimeFormat("zh-Hant", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(today);
    dateElement.dateTime = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  }
  const list = document.querySelector(".task-list");
  if (!list) return;
  const key = "day-by-task-status-v1";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || "{}"); if (!saved || typeof saved !== "object" || Array.isArray(saved)) saved = {}; } catch { saved = {}; }
  function update(task, done) {
    const button = task.querySelector(".task-toggle");
    const name = task.querySelector(".task-copy h3").textContent;
    task.classList.toggle("is-complete", done);
    button.setAttribute("aria-pressed", String(done));
    button.setAttribute("aria-label", `標記「${name}」為${done ? "未完成" : "已完成"}`);
    task.querySelector(".task-check").textContent = done ? "✓" : "";
    const status = task.querySelector(".task-status");
    status.textContent = done ? "已完成" : "未完成";
    status.classList.toggle("status-done", done);
    status.classList.toggle("status-pending", !done);
  }
  list.querySelectorAll(".task-item[data-task-id]").forEach((task) => {
    const id = task.dataset.taskId;
    const initial = task.classList.contains("is-complete");
    update(task, typeof saved[id] === "boolean" ? saved[id] : initial);
    task.querySelector(".task-toggle").addEventListener("click", () => {
      const done = task.querySelector(".task-toggle").getAttribute("aria-pressed") !== "true";
      update(task, done); saved[id] = done;
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch { /* Storage may be unavailable for local files. */ }
    });
  });
})();
