import { clearMenu } from './utils.js';
import { buildMenu } from './menuBuilder.js';
import { setupBasicControls, setupSceneButtons, setupEndOptions } from './controls.js';

export const AppState = {
  currentScene: null,
  activeVideo: null,
  isMenuVisible: false,
  isVideoPlaying: false
};

export function enterMainMenuMode(config) {
  console.log("🟢 Entering main menu mode");

  AppState.currentScene = 'mainMenu';
  AppState.activeVideo = null;
  AppState.isMenuVisible = true;
  AppState.isVideoPlaying = false;

  clearMenu();

  const menuVideo = document.getElementById("menuBackground");
  const tourVideo = document.getElementById("tourVideo");
  const screen = document.getElementById("menu-video-screen");
  const sky = document.getElementById("scene-sky");
  const sphere = document.getElementById("videosphere");

  if (sphere) sphere.setAttribute("visible", false);
  if (screen) screen.setAttribute("visible", false); // Hide first to prevent gray box

  if (sky) {
    sky.setAttribute("src", "#sky360");
    sky.setAttribute("visible", true);
  }

  if (tourVideo) {
    tourVideo.pause();
    tourVideo.setAttribute("src", "");
  }

  if (menuVideo && config.backgroundVideo) {
    menuVideo.setAttribute("src", config.backgroundVideo);
    menuVideo.load();
    menuVideo.muted = true;

    // ✅ Only show screen after video starts playing
    menuVideo.play().then(() => {
      console.log("✅ Menu video playing — showing screen");
      if (screen) screen.setAttribute("visible", true);
    }).catch(err => {
      console.warn("🚫 Autoplay blocked — screen stays hidden", err);
      if (screen) screen.setAttribute("visible", false); // Don't show gray box
    });
  }

  buildMenu(config.menu);
}

export function enterVideoSceneMode(config) {
  console.log("🎥 Entering video scene:", config.video);

  AppState.currentScene = 'videoScene';
  AppState.activeVideo = config.video;
  AppState.isMenuVisible = false;
  AppState.isVideoPlaying = true;

  clearMenu();

  const screen = document.getElementById("menu-video-screen");
  const videoEl = document.getElementById("tourVideo");
  const sky = document.getElementById("scene-sky");
  const sphere = document.getElementById("videosphere");

  if (screen) screen.setAttribute("visible", false);
  if (sky) sky.setAttribute("visible", false);
  if (sphere) sphere.setAttribute("visible", false); // Hide initially

  videoEl.setAttribute("src", config.video);
  videoEl.load();
  videoEl.muted = false;

  videoEl.addEventListener("loadedmetadata", () => {
    sphere.setAttribute("visible", true); // Only show when video is ready
    videoEl.play();
  }, { once: true });

  setupBasicControls(config);
  setupSceneButtons(config);
  setupEndOptions(config);
}

export function loadSceneConfig(jsonPath) {
  fetch(jsonPath)
    .then(res => res.json())
    .then(config => {
      if (config.menu) {
        enterMainMenuMode(config);
      } else if (config.video) {
        enterVideoSceneMode(config);
      } else {
        console.warn("⚠️ Unknown config format in", jsonPath);
      }
    })
    .catch(err => {
      console.error("❌ Failed to load scene config from:", jsonPath, err);
    });
}
