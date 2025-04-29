import { generateThumbnail } from './thumbnails.js';
import { createButton } from './utils.js';
import { fadeOutBackground } from './transitions.js';
import { loadVideoData } from './videoLoader.js';


export function buildMenu(items) {
  const menuEl = document.getElementById("ui-menu");
  const group = document.createElement("a-entity");
  group.setAttribute("position", "0 0 -2.3");
  group.setAttribute("id", "circle-menu");

  let currentIndex = 0;

  function renderMenu() {
    while (group.firstChild) group.removeChild(group.firstChild);

    const visibleItems = [
      items[(currentIndex - 1 + items.length) % items.length],
      items[currentIndex],
      items[(currentIndex + 1) % items.length]
    ];

    visibleItems.forEach((item, i) => {
      const isCenter = i === 1;
      const position = `${(i - 1) * 2} 0 0`;

      const circle = document.createElement("a-circle");
      if (item.video) {
        generateThumbnail(item.video, (thumbUrl) => {
          const preview = document.createElement("a-image");
          preview.setAttribute("src", thumbUrl);
          preview.setAttribute("position", "0 0 0.01");
          preview.setAttribute("width", isCenter ? "1.3" : "0.9");
          preview.setAttribute("height", isCenter ? "1.3" : "0.9");
          circle.appendChild(preview);
        });
      }

      circle.setAttribute("radius", isCenter ? "0.75" : "0.5");
      circle.setAttribute("material", `color: #222; opacity: ${isCenter ? "0.95" : "0.6"}; shader: flat`);
      circle.setAttribute("position", position);
      circle.setAttribute("class", "clickable");

      const label = document.createElement("a-text");
      label.setAttribute("value", item.label);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.8 0");
      label.setAttribute("scale", "0.5 0.5 0.5");
      circle.appendChild(label);

      if (isCenter) {
        circle.addEventListener("click", () => {
          fadeOutBackground();
          loadVideoData("data/" + item.json);
        });
      }

      group.appendChild(circle);
    });

    // ⬅ LEFT ARROW
    const leftArrow = document.createElement("a-text");
    leftArrow.setAttribute("value", "<");
    leftArrow.setAttribute("color", "white");
    leftArrow.setAttribute("position", "-3 0 0");
    leftArrow.setAttribute("scale", "1.5 1.5 1");
    leftArrow.setAttribute("class", "clickable");
    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderMenu();
    });
    group.appendChild(leftArrow);

    // ➡ RIGHT ARROW
    const rightArrow = document.createElement("a-text");
    rightArrow.setAttribute("value", ">");
    rightArrow.setAttribute("color", "white");
    rightArrow.setAttribute("position", "3 0 0");
    rightArrow.setAttribute("scale", "1.5 1.5 1");
    rightArrow.setAttribute("class", "clickable");
    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      renderMenu();
    });
    group.appendChild(rightArrow);
  }

  renderMenu();
  menuEl.appendChild(group);
}
