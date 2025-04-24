import { loadSceneConfig } from './sceneManager.js';
import { createButton } from './utils.js';

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
        loadSceneConfig("data/main_menu.json");
      } else if (option.json) {
        const path = "data/" + option.json;
        console.log("🎬 Loading video JSON from:", path);
        loadSceneConfig(path);
      } else {
        console.warn("⚠️ Unrecognized endOption format:", option);
      }
    });

    group.appendChild(button);
  });

  menuEl.appendChild(group);
}
