export function fadeOutBackground() {
  const plane = document.getElementById("menu-background-plane");
  if (plane) {
    plane.setAttribute("animation__fade", {
      property: "material.opacity",
      to: 0,
      dur: 1000,
      easing: "easeInOutQuad"
    });
  }

  const sky = document.querySelector("a-sky");
  if (sky) {
    sky.setAttribute("visible", false); // 👈 hides background sky!
  }

  const sphere = document.getElementById("videosphere");
  if (sphere) sphere.setAttribute("visible", false);

  const screen = document.getElementById("menu-video-screen");
  if (screen) screen.setAttribute("visible", false);

  const bg = document.getElementById("menuBackground");
  if (bg) bg.pause();
}
