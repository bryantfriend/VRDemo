let sceneEl = document.querySelector("a-scene");
let menuEl = document.getElementById("ui-menu");
let videoEl = document.getElementById("tourVideo");
let bgVideoEl = document.getElementById("menuBackground");
let bgPlaneEl = document.getElementById("menu-background-plane");

// Default to main menu JSON
let jsonURL = "data/main_menu.json";

loadMainMenu();

function loadMainMenu() {
  fetch(jsonURL)
    .then(res => res.json())
    .then(menu => {
      clearMenu();

      // Set background video dynamically from JSON
      if (menu.backgroundVideo && bgVideoEl) {
        bgVideoEl.setAttribute("src", menu.backgroundVideo);
        bgVideoEl.load();
        bgVideoEl.play();
      }

      if (bgPlaneEl) {
        bgPlaneEl.setAttribute("visible", true);
        bgPlaneEl.setAttribute("material", "shader: flat; transparent: true; opacity: 1");
      }

      let menuGroup = document.createElement("a-entity");
      menuGroup.setAttribute("position", "0 0 -2.5");

      menu.menu.forEach((item, i) => {
        let y = -i * 0.6;
        let buttonEl = createButton(item.label, `0 ${y} 0`, () => {
          fadeOutBackground();
          loadVideoData("data/" + item.json);
        });
        menuGroup.appendChild(buttonEl);
      });

      menuEl.appendChild(menuGroup);
    });
}

function fadeOutBackground() {
  if (bgPlaneEl) {
    bgPlaneEl.setAttribute("animation__fade", {
      property: "material.opacity",
      to: 0,
      dur: 1000,
      easing: "easeInOutQuad"
    });
  }
}

function loadVideoData(path) {
  fetch(path)
    .then(res => res.json())
    .then(config => {
      videoEl.setAttribute("src", config.video);
      videoEl.load();
      videoEl.muted = false;

      videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
      }, { once: true });

      clearMenu();
      setupBasicControls(config);
      setupSceneButtons(config);
      setupEndOptions(config);
    });
}

function createButton(label, position, onClick) {
  let btn = document.createElement("a-entity");

  // Stylish background plane
  btn.setAttribute("geometry", "primitive: plane; height: 0.4; width: 1.4");
  btn.setAttribute("material", "color: #111; opacity: 0.85; shader: flat; transparent: true");

  // Text styling
  btn.setAttribute("text", `value: ${label}; align: center; color: #fff; width: 2.5; font: exo2bold`);
  btn.setAttribute("position", position);
  btn.setAttribute("class", "clickable");

  // Hover effects
  btn.setAttribute("animation__hover", "property: scale; startEvents: mouseenter; to: 1.05 1.05 1; dur: 150");
  btn.setAttribute("animation__unhover", "property: scale; startEvents: mouseleave; to: 1 1 1; dur: 150");

  btn.addEventListener("mouseenter", () => {
    btn.setAttribute("material", "color: #333; opacity: 0.95");
  });
  btn.addEventListener("mouseleave", () => {
    btn.setAttribute("material", "color: #111; opacity: 0.85");
  });
  btn.addEventListener("click", onClick);

  return btn;
}

function setupBasicControls(config) {
  let controlsGroup = document.createElement("a-entity");
  controlsGroup.setAttribute("position", "1.2 0 -2.5");

  const buttons = [
    {
      label: "Play/Pause",
      action: () => {
        if (videoEl.paused) {
          videoEl.muted = false;
          videoEl.play();
        } else {
          videoEl.pause();
        }
      }
    },
    { label: "<< 10 sec", action: () => videoEl.currentTime -= 10 },
    { label: ">> 10 sec", action: () => videoEl.currentTime += 10 },
    { label: "Restart", action: () => videoEl.currentTime = 0 }
  ];

  buttons.forEach((btn, i) => {
    let yOffset = -i * 0.5;
    let buttonEl = createButton(btn.label, `0 ${yOffset} 0`, btn.action);
    controlsGroup.appendChild(buttonEl);
  });

  menuEl.appendChild(controlsGroup);
}

function setupSceneButtons(config) {
  if (!config.scenes) return;

  let sceneGroup = document.createElement("a-entity");
  sceneGroup.setAttribute("position", "0 -1.5 -3");

  config.scenes.forEach((scene, i) => {
    let x = (i - config.scenes.length / 2) * 1.5;
    let buttonEl = createButton(scene.label, `${x} 0 0`, () => {
      videoEl.currentTime = scene.timestamp;
    });
    sceneGroup.appendChild(buttonEl);
  });

  menuEl.appendChild(sceneGroup);
}

function setupEndOptions(config) {
  if (!config.endOptions) return;

  videoEl.addEventListener("ended", () => {
    videoEl.pause(); // Stop looping

    let endGroup = document.createElement("a-entity");
    endGroup.setAttribute("position", "0 1 -2.5");

    config.endOptions.forEach((option, i) => {
      let y = -i * 0.6;
      let buttonEl = createButton(option.label, `0 ${y} 0`, () => {
        clearMenu();

        if (option.nextVideo) {
          videoEl.setAttribute("src", option.nextVideo);
          videoEl.load();
          videoEl.muted = false;
          videoEl.addEventListener("loadedmetadata", () => videoEl.play(), { once: true });

          fetch("data/" + option.nextVideo.replace(".mp4", ".json"))
            .then(res => res.json())
            .then(cfg => {
              setupBasicControls(cfg);
              setupSceneButtons(cfg);
              setupEndOptions(cfg);
            });

        } else if (option.menu) {
          loadMainMenu(); // back to main menu
        }
      });

      endGroup.appendChild(buttonEl);
    });

    menuEl.appendChild(endGroup);
  });
}

function clearMenu() {
  while (menuEl.firstChild) {
    menuEl.removeChild(menuEl.firstChild);
  }
}
