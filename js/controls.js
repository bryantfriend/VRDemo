import { createButton } from './utils.js';
import { clearMenu } from './utils.js';
const menuEl = document.getElementById("ui-menu");
const videoEl = document.getElementById("tourVideo");
import { loadMainMenu, loadVideoData } from './loader.js';

export function setupBasicControls(config) {
  const group = document.createElement("a-entity");
  group.setAttribute("id", "control-menu");

  const radius = 1; // arc radius
  const centerY = -0.2; // vertical level
  const centerZ = -2.5;

  const buttons = [
    { label: "Play/Pause", angle: 90, action: () => videoEl.paused ? videoEl.play() : videoEl.pause() },
    { label: "<< 10 sec", angle: 150, action: () => videoEl.currentTime -= 10 },
    { label: ">> 10 sec", angle: 30, action: () => videoEl.currentTime += 10 },
    { label: "Restart", angle: 270, action: () => videoEl.currentTime = 0 }
  ];

  buttons.forEach(btn => {
    const rad = btn.angle * Math.PI / 180;
    const x = radius * Math.cos(rad);
    const y = centerY;
    const z = centerZ + radius * Math.sin(rad);
    const el = createButton(btn.label, `${x} ${y} ${z}`, btn.action);
    group.appendChild(el);
  });

  menuEl.appendChild(group);
}


export function setupSceneButtons(config) {
  if (!config.scenes) return;

  const group = document.createElement("a-entity");
  group.setAttribute("position", "0 -1.5 -3");

  config.scenes.forEach((scene, i) => {
    const x = (i - config.scenes.length / 2) * 1.5;
    const el = createButton(scene.label, `${x} 0 0`, () => {
      videoEl.currentTime = scene.timestamp;
    });
    group.appendChild(el);
  });

  menuEl.appendChild(group);
}

export function setupEndOptions(config) {
  const videoEl = document.getElementById("tourVideo");
  const menuEl = document.getElementById("ui-menu");

  if (!config.endOptions) return;

  videoEl.addEventListener("ended", () => {
    videoEl.pause();

    const group = document.createElement("a-entity");
    group.setAttribute("position", "0 1 -2.5");

    config.endOptions.forEach((option, i) => {
      const y = -i * 0.6;
      const btn = createButton(option.label, `0 ${y} 0`, async () => {
        clearMenu();

        if (option.nextVideo) {
          // Load video and corresponding JSON config
          const jsonName = option.nextVideo.split('/').pop().replace('.mp4', '.json');
          const jsonPath = `data/${jsonName}`;

          const videoEl = document.getElementById("tourVideo");
          videoEl.setAttribute("src", option.nextVideo);
          videoEl.load();
          videoEl.play();

          const res = await fetch(jsonPath);
          const cfg = await res.json();
          setupBasicControls(cfg);
          setupSceneButtons(cfg);
          setupEndOptions(cfg);

        } else if (option.menu) {
          loadMainMenu();
        }
      });

      group.appendChild(btn);
    });

    menuEl.appendChild(group);
  });
}
