# SARVINKX Pulse — Desktop Dashboard Starter

A lightweight, responsive HTML/CSS/JavaScript dashboard with a premium dark interface, app shortcut tiles, local tasks and notes.

## Run it
1. Extract the ZIP.
2. Open `index.html` in Chrome or Edge.
3. Add website shortcuts with **+ Add app**.
4. Tasks, notes and shortcuts are saved in that browser's local storage.

## Important limitation about installed Windows apps
A normal browser page **cannot scan your installed Windows apps or launch arbitrary local `.exe` files**. This is a browser security boundary, not a bug.

This starter includes sample app tiles:
- Web shortcuts (ChatGPT, Gemini, YouTube, GitHub, n8n, Canva, Notion) open their websites.
- Local app examples (VS Code, Antigravity) show an explanatory message until a native desktop integration is added.

## To show the real apps installed on your PC
Next phase should package this UI as a Windows desktop app using **Tauri 2** and add a narrowly scoped native Rust command that reads Windows Start Menu shortcut locations. Let the user select which apps to show. Launching should use validated shortcut targets, never arbitrary commands from page input. Keep the frontend isolated and use an allowlist/capability policy.

## Real AI news
News is intentionally labelled as demo/setup content. Do not present invented headlines as live news. In the next phase, connect reputable RSS feeds or official APIs through a small local service, validate links, show publication timestamps and provide source links. Keep API secrets out of frontend JavaScript.

## Files
- `index.html` — layout
- `style.css` — responsive premium UI
- `script.js` — clock, app shortcuts, task list and local notes

This is a working starter dashboard, not yet a native Windows wallpaper replacement. A Windows startup app can launch after sign-in; a true desktop-widget layer needs additional Windows-specific integration.
