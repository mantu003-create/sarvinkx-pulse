# SARVINKX Pulse

A lightweight personal dashboard with a cinematic wallpaper engine, glass widgets, app dock, local tasks and notes. It uses plain HTML, CSS and JavaScript and works with GitHub Pages without a build step.

## Run it

Open `index.html` in a modern browser or publish the project folder with GitHub Pages. The app and its preset wallpapers work offline once the files are available locally. Google Fonts are optional; system sans-serif fallbacks are used if they cannot load.

## Wallpaper engine

Use the gear button in the upper-right corner to open wallpaper settings. Choose one of the bundled categories (AI & Technology, Motivation & Discipline, Iron Man / Futuristic Hero, Space & Universe, Nature & Cinematic, or Minimal Focus), or use Previous, Next and Shuffle. Preset art is bundled as local SVG files in `assets/wallpapers`, so it does not download remote images or require an image API.

Automatic rotation can be disabled or set to 15 minutes, 30 minutes, 1 hour, 6 hours, or daily. The appearance, accent color, selected wallpaper and interval persist in the browser under `pulse.wallpaper.settings`. Crossfades respect the operating system's reduced-motion preference.

Choose a local image in the Custom wallpaper section to use a personal background. The browser resizes it and stores a compressed copy in local storage; the original file is not uploaded. This lets it persist across refreshes in the same browser profile, but browser data clearing or storage limits can remove or block it. Re-select the image if that happens. Keeping a reference to and reopening arbitrary filesystem paths reliably would require a later desktop integration.

## Existing dashboard data and browser limits

App shortcuts, tasks and notes continue using the existing `pulse.apps`, `pulse.tasks` and `pulse.note` local storage keys. Website shortcuts open in a new tab. The Windows app examples cannot launch local programs in a browser. This page is a full-screen experience while open, not a persistent Windows wallpaper layer; those OS features require a later native phase. No Tauri or native Windows code is included.

News cards are explicitly demo/setup content, not live headlines. Connect a trusted feed before showing real news.
