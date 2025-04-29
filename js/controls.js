
import { createButton } from './utils.js';
import { createCircleButton } from './utils.js';
import { loadSceneConfig } from './sceneManager.js';

export function setupBasicControls(config) {
  const menuEl = document.getElementById("ui-menu");
  const group = document.createElement("a-entity");
  group.setAttribute("position", "0 -0.6 -2.5");

  const videoEl = document.getElementById("tourVideo");

  const buttons = [
    { label: "▶ Play/Pause", action: () => videoEl.paused ? videoEl.play() : videoEl.pause() },
    { label: "⏪ Rewind 10s", action: () => videoEl.currentTime -= 10 },
    { label: "⏩ Forward 10s", action: () => videoEl.currentTime += 10 },
    { label: "⏮ Restart", action: () => videoEl.currentTime = 0 }
  ];

  buttons.forEach((btn, i) => {
    const x = (i - 1.5) * 2;
    const button = createButton(btn.label, `${x} 0 0`, btn.action);
    group.appendChild(button);
  });

  menuEl.appendChild(group);
}

export function setupSceneButtons(config) {
  if (!config.scenes || config.scenes.length === 0) {
    console.log("⚠️ No scene buttons to add.");
    return;
  }

  const menuEl = document.getElementById("ui-menu");
  const group = document.createElement("a-entity");
  group.setAttribute("position", "0 0.6 -2.5");

  const videoEl = document.getElementById("tourVideo");

  config.scenes.forEach((scene, i) => {
    const x = (i - (config.scenes.length - 1) / 2) * 1.6;
    const button = createButton(scene.label, `${x} 0 0`, () => {
      console.log(`⏩ Jumping to scene: ${scene.label} at ${scene.timestamp}s`);
      videoEl.currentTime = scene.timestamp;
    });
    group.appendChild(button);
  });

  menuEl.appendChild(group);
}

export function setupModernControls(config) {
  const uiMenu = document.getElementById("ui-menu");

  const container = document.createElement("a-entity");
  container.setAttribute("position", "0 -1.4 -2.5");
  container.setAttribute("id", "modern-controls");

  const videoEl = document.getElementById("tourVideo");

  // 🔹 Top row: scene buttons
  const sceneButtonsGroup = document.createElement("a-entity");
  sceneButtonsGroup.setAttribute("position", "0 0.4 0");

  const scenes = config?.scenes || [];
  scenes.forEach((scene, i) => {
    const x = (i - (scenes.length - 1) / 2) * 0.6;
    const button = createCircleButton(scene.label, `${x} 0 0.01`, () => {
      console.log(`⏩ Jumping to scene: ${scene.label} at ${scene.timestamp}s`);
      videoEl.currentTime = scene.timestamp;
    }, 0.14);
    sceneButtonsGroup.appendChild(button);
  });

  container.appendChild(sceneButtonsGroup);

  // 🔹 Bottom row: Pause, Restart, Menu
  const mainControlsGroup = document.createElement("a-entity");
  mainControlsGroup.setAttribute("position", "0 0 0");

  const mainButtons = [
    {
      label: "<<",
      action: () => {
        videoEl.currentTime = 0;
      }
    },
    {
      label: "||",
      action: () => {
        if (videoEl.paused) videoEl.play();
        else videoEl.pause();
      }
    },
    {
      label: "Menu",
      action: () => {
        loadSceneConfig("data/main_menu.json");
      }
    }
  ];

  mainButtons.forEach((btn, i) => {
    const x = (i - (mainButtons.length - 1) / 2) * 0.8;
    const button = createCircleButton(btn.label, `${x} 0 0.01`, btn.action, 0.14);
    mainControlsGroup.appendChild(button);
  });

  container.appendChild(mainControlsGroup);
  uiMenu.appendChild(container); // ✅ Attach to fixed position in world
}




export function setupEndOptions(config) {
  if (!config.endOptions || config.endOptions.length === 0) {
    console.log("⚠️ No endOptions found in config.");
    return;
  }

  const menuEl = document.getElementById("ui-menu");
  const group = document.createElement("a-entity");
  group.setAttribute("position", "0 -1.5 -2.3");

  config.endOptions.forEach((option, i) => {
    const x = (i - (config.endOptions.length - 1) / 2) * 2.2;
    const label = option.label;

    console.log(`🧱 Creating endOption button: ${label} at x=${x}`);

    const button = document.createElement("a-entity");
    button.setAttribute("geometry", "primitive: plane; height: 0.4; width: 1.6");
    button.setAttribute("material", "color: #444; opacity: 0.9; shader: flat; transparent: true");
    button.setAttribute("text", `value: ${label}; align: center; color: white; width: 2.5; font: exo2bold`);
    button.setAttribute("position", `${x} 0 0`);
    button.setAttribute("class", "clickable");
    button.setAttribute("visible", "true");

    button.addEventListener("click", () => {
      console.log("🟢 Clicked endOption:", label);
      if (option.menu) {
        console.log("🔁 Loading main menu...");
        loadMainMenu(); // ✅ Correct way to load the menu
      } else if (option.json) {
        const path = "data/" + option.json;
        console.log("🎬 Loading video JSON from:", path);
        loadVideoData(path);
      } else {
        console.warn("⚠️ Unrecognized endOption format:", option);
      }
    });

    group.appendChild(button);
  });

  menuEl.appendChild(group);
}
