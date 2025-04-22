import { clearMenu } from './utils.js';
import { buildMenu } from './menuBuilder.js';
import { setupBasicControls, setupSceneButtons, setupEndOptions } from './controls.js';


export function loadMainMenu() {
  fetch("data/main_menu.json")
    .then(res => res.json())
    .then(menu => {
      clearMenu();

      const bgVideoEl = document.getElementById("menuBackground");
      if (menu.backgroundVideo && bgVideoEl) {
        bgVideoEl.setAttribute("src", menu.backgroundVideo);
        bgVideoEl.load();
        bgVideoEl.play();
        const sky = document.querySelector("a-sky");
        if (sky) sky.setAttribute("visible", true);

      }

      const screen = document.getElementById("menu-video-screen");
      if (screen) screen.setAttribute("visible", true);

      document.getElementById("videosphere").setAttribute("visible", false);

      buildMenu(menu.menu);
    });
}

export function loadVideoData(path) {
  fetch(path)
    .then(res => res.json())
    .then(config => {
      const videoEl = document.getElementById("tourVideo");
      videoEl.setAttribute("src", config.video);
      videoEl.load();
      videoEl.muted = false;

      videoEl.addEventListener("loadedmetadata", () => {
        document.getElementById("videosphere").setAttribute("visible", true);
        videoEl.play();
      }, { once: true });

      clearMenu(); // ✅ hide old buttons

      setupBasicControls(config);   // ✅ Add playback controls
      setupSceneButtons(config);    // ✅ Add scene-skip buttons
      setupEndOptions(config);      // ✅ Add return to menu or next video
    });
}
