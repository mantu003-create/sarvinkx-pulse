const $ = (selector) => document.querySelector(selector);

const starterApps = [
  {id:"chatgpt",name:"ChatGPT",icon:"✳",type:"AI assistant",url:"https://chatgpt.com",color:"green"},
  {id:"gemini",name:"Gemini",icon:"✦",type:"AI assistant",url:"https://gemini.google.com",color:"blue"},
  {id:"youtube",name:"YouTube",icon:"▶",type:"Video",url:"https://youtube.com",color:"orange"},
  {id:"github",name:"GitHub",icon:"⌘",type:"Code & projects",url:"https://github.com",color:"purple"},
  {id:"vscode",name:"VS Code",icon:"‹/›",type:"Code editor",url:"",color:"blue"},
  {id:"n8n",name:"n8n",icon:"⌘",type:"Automation",url:"https://n8n.io",color:"pink"},
  {id:"canva",name:"Canva",icon:"◉",type:"Design",url:"https://canva.com",color:"purple"},
  {id:"notion",name:"Notion",icon:"N",type:"Workspace",url:"https://notion.so",color:"cyan"},
  {id:"antigravity",name:"Antigravity",icon:"✧",type:"AI coding",url:"",color:"pink"}
];

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let apps = read("pulse.apps", starterApps);
let tasks = read("pulse.tasks", [
  {id:1,text:"Learn one useful AI tool",done:false},
  {id:2,text:"Build a small project feature",done:false},
  {id:3,text:"Spend 25 minutes on freelancing",done:false}
]);

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",hour12:true});
  const match = time.match(/\s?(AM|PM)$/);
  $("#clock").innerHTML = match
    ? `${escapeHtml(time.slice(0, match.index))}<span>${match[1]}</span>`
    : escapeHtml(time);
  $("#date").textContent = now.toLocaleDateString([], {weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const hour = now.getHours();
  $("#greeting").textContent = `${hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}, Mantu.`;
  $("#year").textContent = now.getFullYear();
}

function renderApps() {
  const dock = $("#appGrid");
  dock.innerHTML = "";
  apps.forEach((app) => {
    const tile = document.createElement("div");
    tile.className = "app-tile";
    tile.dataset.color = app.color || "blue";
    tile.tabIndex = 0;
    tile.setAttribute("role", "link");
    tile.setAttribute("aria-label", `${app.name}${app.url ? ", open website" : ", local app shortcut"}`);
    tile.innerHTML = `<button class="remove-app" type="button" title="Remove shortcut" aria-label="Remove ${escapeHtml(app.name)}">×</button><span class="app-icon" aria-hidden="true">${escapeHtml(app.icon || "✦")}</span><strong>${escapeHtml(app.name)}</strong><span class="app-type">${escapeHtml(app.type || (app.url ? "Website" : "Local app"))}</span>`;

    const open = () => {
      if (app.url) {
        window.open(app.url, "_blank", "noopener,noreferrer");
      } else {
        alert(`${app.name} is a local Windows app. This browser version cannot launch local programs. Native Windows integration is planned for a later phase.`);
      }
    };
    tile.addEventListener("click", (event) => {
      if (event.target.closest(".remove-app")) return;
      open();
    });
    tile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    tile.querySelector(".remove-app").addEventListener("click", (event) => {
      event.stopPropagation();
      apps = apps.filter((item) => item.id !== app.id);
      save("pulse.apps", apps);
      renderApps();
    });
    dock.appendChild(tile);
  });

  const add = document.createElement("button");
  add.type = "button";
  add.className = "app-tile add-tile";
  add.setAttribute("aria-label", "Add app or website shortcut");
  add.innerHTML = '<span class="app-icon" aria-hidden="true">＋</span><strong>Add app</strong><span class="app-type">Customize shortcuts</span>';
  add.addEventListener("click", () => $("#appDialog").showModal());
  dock.appendChild(add);
}

function renderTasks() {
  const list = $("#taskList");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const row = document.createElement("li");
    row.className = `task-row${task.done ? " done" : ""}`;
    row.innerHTML = `<input type="checkbox" ${task.done ? "checked" : ""} aria-label="Complete task"><span>${escapeHtml(task.text)}</span><button class="delete-task" type="button" aria-label="Delete task">×</button>`;
    row.querySelector("input").addEventListener("change", (event) => {
      task.done = event.target.checked;
      save("pulse.tasks", tasks);
      renderTasks();
    });
    row.querySelector(".delete-task").addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      save("pulse.tasks", tasks);
      renderTasks();
    });
    list.appendChild(row);
  });

  const done = tasks.filter((task) => task.done).length;
  $("#taskCount").textContent = tasks.length;
  $("#progressLabel").textContent = `${done} of ${tasks.length} tasks complete`;
  $("#progressBar").style.width = `${tasks.length ? (done / tasks.length) * 100 : 0}%`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#taskInput");
  const text = input.value.trim();
  if (!text) return;
  tasks.push({id:Date.now(),text,done:false});
  save("pulse.tasks", tasks);
  input.value = "";
  renderTasks();
});

const quickNote = $("#quickNote");
quickNote.value = read("pulse.note", "");
quickNote.addEventListener("input", () => {
  save("pulse.note", quickNote.value);
  $("#saveStatus").textContent = "Saving locally…";
  clearTimeout(window.noteSaveTimer);
  window.noteSaveTimer = setTimeout(() => { $("#saveStatus").textContent = "Saved on this device"; }, 350);
});

$("#appForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#appName").value.trim();
  if (!name) return;
  const url = $("#appUrl").value.trim();
  apps.push({id:`app-${Date.now()}`,name,icon:$("#appIcon").value.trim() || "✦",type:url ? "Website" : "Local app",url,color:$("#appColor").value});
  save("pulse.apps", apps);
  renderApps();
  $("#appDialog").close();
  $("#appForm").reset();
  $("#appIcon").value = "✦";
});

$("#closeDialog").addEventListener("click", () => $("#appDialog").close());
$("#cancelDialog").addEventListener("click", () => $("#appDialog").close());
$("#themeBtn").addEventListener("click", () => document.body.classList.toggle("glow-off"));

const demoNews = [
  ["AI","News feed not connected","Connect a trusted RSS feed or API for real, dated AI headlines.","SETUP"],
  ["TOOLS","Tool discovery","Demo card · connect a source to follow new tools.","DEMO"],
  ["OPEN","Project releases","Demo card · connect release feeds for projects you follow.","DEMO"]
];
function renderDemoNews() {
  const list = $("#newsList");
  list.innerHTML = "";
  demoNews.forEach(([label,title,description,status]) => {
    const card = document.createElement("article");
    card.className = "news-item";
    card.innerHTML = `<span class="news-icon">${escapeHtml(label)}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p><span class="news-time">${escapeHtml(status)}</span>`;
    list.appendChild(card);
  });
}
$("#refreshNews").addEventListener("click", () => {
  renderDemoNews();
  const button = $("#refreshNews");
  button.textContent = "Checked ✓";
  setTimeout(() => { button.textContent = "Refresh ↻"; }, 1400);
});

updateClock();
setInterval(updateClock, 1000);
renderApps();
renderTasks();
renderDemoNews();

// Wallpaper state is separate from the existing shortcut/task/note stores.
const wallpaperKey = "pulse.wallpaper.settings";
const wallpaperPresets = [
  {id:"ai-tech",name:"AI & Technology",category:"AI & Technology",src:"assets/wallpapers/ai-tech.svg"},
  {id:"motivation",name:"Motivation & Discipline",category:"Motivation & Discipline",src:"assets/wallpapers/motivation.svg"},
  {id:"hero-red-gold",name:"Futuristic Hero",category:"Iron Man / Futuristic Hero",src:"assets/wallpapers/hero-red-gold.svg"},
  {id:"space",name:"Space & Universe",category:"Space & Universe",src:"assets/wallpapers/space-universe.svg"},
  {id:"nature",name:"Nature & Cinematic",category:"Nature & Cinematic",src:"assets/wallpapers/nature-cinematic.svg"},
  {id:"minimal",name:"Minimal Focus",category:"Minimal Focus",src:"assets/wallpapers/minimal-focus.svg"}
];
const savedWallpaper = read(wallpaperKey, {});
const wallpaperSettings = {
  selected: typeof savedWallpaper.selected === "string" ? savedWallpaper.selected : "nature",
  interval: [0,900000,1800000,3600000,21600000,86400000].includes(Number(savedWallpaper.interval)) ? Number(savedWallpaper.interval) : 0,
  appearance: savedWallpaper.appearance === "light" ? "light" : "dark",
  accent: ["cyan","blue","violet","amber","rose"].includes(savedWallpaper.accent) ? savedWallpaper.accent : "cyan",
  customImage: typeof savedWallpaper.customImage === "string" && savedWallpaper.customImage.startsWith("data:image/") ? savedWallpaper.customImage : ""
};
let wallpaperTimer = null;
let wallpaperChangeToken = 0;
let activeWallpaperLayer = "wallpaperA";

function availableWallpapers() {
  const items = [...wallpaperPresets];
  if (wallpaperSettings.customImage) items.push({id:"custom",name:"Custom Wallpaper",category:"Custom Wallpapers",src:wallpaperSettings.customImage});
  return items;
}
function persistWallpaperSettings() {
  try {
    save(wallpaperKey, wallpaperSettings);
    return true;
  } catch {
    $("#wallpaperStatus").textContent = "Browser storage is full. Choose a smaller image or remove the saved custom wallpaper.";
    return false;
  }
}
function scheduleWallpaperRotation() {
  if (wallpaperTimer !== null) {
    clearTimeout(wallpaperTimer);
    wallpaperTimer = null;
  }
  const delay = wallpaperSettings.interval;
  if (!delay) return;
  wallpaperTimer = setTimeout(() => {
    wallpaperTimer = null;
    cycleWallpaper(1, true);
  }, delay);
}
function renderWallpaperPreviews() {
  const container = $("#wallpaperPreviews");
  container.innerHTML = "";
  availableWallpapers().forEach((wallpaper) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wallpaper-preview";
    button.dataset.wallpaperId = wallpaper.id;
    button.setAttribute("aria-label", `Use ${wallpaper.name}`);
    button.setAttribute("aria-pressed", String(wallpaper.id === wallpaperSettings.selected));
    button.style.backgroundImage = wallpaper.id === "custom"
      ? `linear-gradient(0deg,#030817b3,transparent 72%),url("${wallpaper.src}")`
      : `linear-gradient(0deg,#030817b3,transparent 72%),url("${wallpaper.src}")`;
    button.innerHTML = `<span>${escapeHtml(wallpaper.name)}</span>`;
    button.addEventListener("click", () => setWallpaper(wallpaper.id));
    container.appendChild(button);
  });
  $("#clearCustomWallpaper").hidden = !wallpaperSettings.customImage;
}
function preloadWallpaper(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = reject;
    image.src = src;
  });
}
async function setWallpaper(id, fromRotation = false) {
  const wallpaper = availableWallpapers().find((item) => item.id === id) || wallpaperPresets.find((item) => item.id === "minimal");
  const token = ++wallpaperChangeToken;
  let source = wallpaper.src;
  try {
    await preloadWallpaper(source);
  } catch {
    source = "assets/wallpapers/minimal-focus.svg";
    try { await preloadWallpaper(source); } catch { /* CSS base color remains the final fallback. */ }
  }
  if (token !== wallpaperChangeToken) return;
  const nextLayerId = activeWallpaperLayer === "wallpaperA" ? "wallpaperB" : "wallpaperA";
  const nextLayer = document.getElementById(nextLayerId);
  const currentLayer = document.getElementById(activeWallpaperLayer);
  nextLayer.style.backgroundImage = `url("${source}")`;
  nextLayer.classList.add("active");
  currentLayer.classList.remove("active");
  activeWallpaperLayer = nextLayerId;
  wallpaperSettings.selected = wallpaper.id;
  document.body.dataset.theme = wallpaperSettings.appearance;
  document.body.dataset.accent = wallpaperSettings.accent;
  persistWallpaperSettings();
  document.querySelectorAll(".wallpaper-preview").forEach((preview) => {
    preview.setAttribute("aria-pressed", String(preview.dataset.wallpaperId === wallpaperSettings.selected));
  });
  if (!fromRotation) $("#wallpaperStatus").textContent = `${wallpaper.name} selected. Wallpaper settings are saved in this browser.`;
  scheduleWallpaperRotation();
}
function cycleWallpaper(direction, fromRotation = false) {
  const wallpapers = availableWallpapers();
  const index = wallpapers.findIndex((wallpaper) => wallpaper.id === wallpaperSettings.selected);
  const nextIndex = (Math.max(index, 0) + direction + wallpapers.length) % wallpapers.length;
  setWallpaper(wallpapers[nextIndex].id, fromRotation);
}
function shuffleWallpaper() {
  const wallpapers = availableWallpapers().filter((wallpaper) => wallpaper.id !== wallpaperSettings.selected);
  if (!wallpapers.length) return;
  setWallpaper(wallpapers[Math.floor(Math.random() * wallpapers.length)].id);
}
function applyWallpaperPreferences() {
  document.body.dataset.theme = wallpaperSettings.appearance;
  document.body.dataset.accent = wallpaperSettings.accent;
  $("#rotationInterval").value = String(wallpaperSettings.interval);
  $("#appearanceMode").value = wallpaperSettings.appearance;
  $("#accentColor").value = wallpaperSettings.accent;
}
async function prepareCustomWallpaper(file) {
  if (!file || !file.type.startsWith("image/")) return;
  $("#wallpaperStatus").textContent = "Preparing image…";
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / bitmap.width, 1200 / bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const dataUrl = canvas.toDataURL("image/webp", 0.78);
    const previousImage = wallpaperSettings.customImage;
    const previousId = wallpaperSettings.selected;
    wallpaperSettings.customImage = dataUrl;
    if (!persistWallpaperSettings()) {
      wallpaperSettings.customImage = previousImage;
      wallpaperSettings.selected = previousId;
      return;
    }
    renderWallpaperPreviews();
    await setWallpaper("custom");
    $("#wallpaperStatus").textContent = "Custom wallpaper saved in this browser. The original file is not uploaded.";
  } catch {
    $("#wallpaperStatus").textContent = "That image could not be processed. Try another image file.";
  }
}

applyWallpaperPreferences();
renderWallpaperPreviews();
$("#wallpaperSettingsBtn").addEventListener("click", () => $("#wallpaperDialog").showModal());
$("#closeWallpaperDialog").addEventListener("click", () => $("#wallpaperDialog").close());
$("#previousWallpaper").addEventListener("click", () => cycleWallpaper(-1));
$("#nextWallpaper").addEventListener("click", () => cycleWallpaper(1));
$("#shuffleWallpaper").addEventListener("click", shuffleWallpaper);
$("#rotationInterval").addEventListener("change", (event) => {
  wallpaperSettings.interval = Number(event.target.value);
  persistWallpaperSettings();
  scheduleWallpaperRotation();
  $("#wallpaperStatus").textContent = wallpaperSettings.interval ? "Automatic rotation is on. The timer restarts after each wallpaper change." : "Automatic rotation is disabled.";
});
$("#appearanceMode").addEventListener("change", (event) => {
  wallpaperSettings.appearance = event.target.value;
  applyWallpaperPreferences();
  persistWallpaperSettings();
});
$("#accentColor").addEventListener("change", (event) => {
  wallpaperSettings.accent = event.target.value;
  applyWallpaperPreferences();
  persistWallpaperSettings();
});
$("#customWallpaperFile").addEventListener("change", (event) => prepareCustomWallpaper(event.target.files[0]));
$("#clearCustomWallpaper").addEventListener("click", () => {
  wallpaperSettings.customImage = "";
  if (wallpaperSettings.selected === "custom") wallpaperSettings.selected = "minimal";
  persistWallpaperSettings();
  renderWallpaperPreviews();
  setWallpaper(wallpaperSettings.selected);
  $("#wallpaperStatus").textContent = "Saved custom wallpaper removed from this browser.";
});
window.addEventListener("beforeunload", () => {
  if (wallpaperTimer !== null) clearTimeout(wallpaperTimer);
});
setWallpaper(wallpaperSettings.selected);
