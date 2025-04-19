let sceneEl = document.querySelector("a-scene");
let menuEl = document.getElementById("ui-menu");
let videoEl = document.getElementById("tourVideo");
let jsonURL = "data/apartment1.json";

fetch(jsonURL)
  .then(res => res.json())
  .then(config => {
    // Load video dynamically from JSON
    if (config.video) {
      videoEl.setAttribute("src", config.video);
      videoEl.load();
      videoEl.play();
    }

    clearMenu();
    setupBasicControls(config);
    setupSceneButtons(config);
    setupEndOptions(config);
  });

function createButton(label, position, onClick) {
  let btn = document.createElement("a-entity");
  btn.setAttribute("geometry", "primitive: plane; height: 0.3; width: 1");
  btn.setAttribute("material", "color: black; opacity: 0.6; shader: flat");
  btn.setAttribute("text", `value: ${label}; align: center; color: white; width: 2`);
  btn.setAttribute("position", position);
  btn.setAttribute("class", "clickable");
  btn.addEventListener("click", onClick);
  return btn;
}

function setupBasicControls(config) {
  let controlsGroup = document.createElement("a-entity");
  controlsGroup.setAttribute("position", "1.2 0 -2.5");

  const buttons = [
    { label: "Play/Pause", action: () => videoEl.paused ? videoEl.play() : videoEl.pause() },
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
    let x = (i - config.scenes.length / 2) * 1.2;
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
    let endGroup = document.createElement("a-entity");
    endGroup.setAttribute("position", "0 1 -2.5");

    config.endOptions.forEach((option, i) => {
      let y = -i * 0.5;
      let buttonEl = createButton(option.label, `0 ${y} 0`, () => {
        clearMenu();

        if (option.nextVideo) {
          videoEl.setAttribute("src", option.nextVideo);
          videoEl.load();
          videoEl.play();

          fetch("data/" + option.nextVideo.replace(".mp4", ".json"))
            .then(res => res.json())
            .then(cfg => {
              setupBasicControls(cfg);
              setupSceneButtons(cfg);
              setupEndOptions(cfg);
            });

        } else if (option.menu) {
          alert("Opening menu: " + option.menu);
          // Add your menu loading logic here later
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
