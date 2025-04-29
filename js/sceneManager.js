
// Central scene manager with clear state transitions

import { clearMenu } from './utils.js';
import { buildMenu } from './menuBuilder.js';
import { setupBasicControls, setupSceneButtons, setupEndOptions, setupModernControls } from './controls.js';

export const AppState = {
  currentScene: null,
  activeVideo: null,
  isMenuVisible: false,
  isVideoPlaying: false
};

export function enterMainMenuMode(config) {
  console.log("🟢 Entering main menu mode");

  // 🔹 Remove leftover HUD
  const cameraEl = document.querySelector("[camera]");
  if (cameraEl) {
    const huds = cameraEl.querySelectorAll(".hud-group");
    huds.forEach(el => {
      console.log("🧹 Removing leftover HUD group from camera (main menu)", el);
      cameraEl.removeChild(el);
    });
  }

  AppState.currentScene = 'mainMenu';
  AppState.activeVideo = null;
  AppState.isMenuVisible = true;
  AppState.isVideoPlaying = false;

  clearMenu();

  const menuVideo = document.getElementById("menuBackground");
  const tourVideo = document.getElementById("tourVideo");
  if (tourVideo) {
    tourVideo.pause();
    tourVideo.setAttribute("src", "");
    tourVideo.load();
  }

  const screen = document.getElementById("menu-video-screen");
  const sky = document.getElementById("scene-sky");
  const sphere = document.getElementById("videosphere");

  if (sphere) sphere.setAttribute("visible", false);
  if (screen) screen.setAttribute("visible", true);
  if (sky) {
    sky.setAttribute("src", "#sky360");
    sky.setAttribute("visible", true); // ✅ Ensure sky is back
  }

  if (menuVideo && config.backgroundVideo) {
    menuVideo.setAttribute("src", config.backgroundVideo);
    menuVideo.load();
    menuVideo.muted = true;
    menuVideo.play().catch(err => {
      console.warn("🚫 Autoplay blocked for menu video:", err);
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
  
  // Clear floating controls from camera
  const cameraEl = document.querySelector("[camera]");
  if (cameraEl) {
    const huds = cameraEl.querySelectorAll(".hud-group");
    huds.forEach(el => {
      console.log("🧹 Removing HUD group from camera:", el);
      cameraEl.removeChild(el);
    });
  }



  const screen = document.getElementById("menu-video-screen");
  const videoEl = document.getElementById("tourVideo");
  const sky = document.getElementById("scene-sky");
  const sphere = document.getElementById("videosphere");

  if (screen) screen.setAttribute("visible", false);
  if (sky) sky.setAttribute("visible", false);
  if (sphere) sphere.setAttribute("visible", true);

  videoEl.setAttribute("src", config.video);
  videoEl.load();
  videoEl.muted = false;

  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  }, { once: true });
  
  setupModernControls(config);
  //setupBasicControls(config);
  //setupSceneButtons(config);
  //setupEndOptions(config);
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
