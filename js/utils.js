export function clearMenu() {
  const menu = document.getElementById("ui-menu");
  while (menu.firstChild) {
    menu.removeChild(menu.firstChild);
  }
}

export function createButton(label, position, onClick) {
  const btn = document.createElement("a-entity");

  btn.setAttribute("geometry", "primitive: plane; height: 0.4; width: 1.4");
  btn.setAttribute("material", "color: #111; opacity: 0.85; shader: flat; transparent: true");
  btn.setAttribute("text", `value: ${label}; align: center; color: #fff; width: 2.5; font: exo2bold`);
  btn.setAttribute("position", position);
  btn.setAttribute("class", "clickable");

  btn.setAttribute("animation__hovercolor", "property: material.color; startEvents: mouseenter; to: #0f0; dur: 200");
  btn.setAttribute("animation__leavecolor", "property: material.color; startEvents: mouseleave; to: #111; dur: 200");
  btn.setAttribute("animation__hoverpulse", "property: scale; startEvents: mouseenter; to: 1.1 1.1 1; dur: 200");
  btn.setAttribute("animation__leavepulse", "property: scale; startEvents: mouseleave; to: 1 1 1; dur: 200");

  btn.addEventListener("mouseenter", () => {
    btn.setAttribute("material", "color: #0f0; opacity: 0.95");
  });
  btn.addEventListener("mouseleave", () => {
    btn.setAttribute("material", "color: #111; opacity: 0.85");
  });
  btn.addEventListener("click", onClick);

  return btn;
}

export function createCircleButton(label, position, onClick, customRadius = 0.25) {
  const btn = document.createElement("a-entity");

  btn.setAttribute("geometry", `primitive: circle; radius: ${customRadius}`); // use custom radius
  btn.setAttribute("material", "color: #222; opacity: 0.8; shader: flat; transparent: true");
  btn.setAttribute("text", `value: ${label}; align: center; color: #fff; width: 2.5`);
  btn.setAttribute("position", position);
  btn.setAttribute("class", "clickable");

  btn.setAttribute("animation__hovercolor", "property: material.color; startEvents: mouseenter; to: #0f0; dur: 200");
  btn.setAttribute("animation__leavecolor", "property: material.color; startEvents: mouseleave; to: #222; dur: 200");
  btn.setAttribute("animation__hoverpulse", "property: scale; startEvents: mouseenter; to: 1.2 1.2 1; dur: 200");
  btn.setAttribute("animation__leavepulse", "property: scale; startEvents: mouseleave; to: 1 1 1; dur: 200");

  btn.addEventListener("click", () => {
  console.log(`🟢 CLICKED BUTTON: ${label}`);
  onClick();
});
btn.addEventListener("mouseenter", () => {
  console.log(`👆 HOVER: ${label}`);
});


  return btn;
}

