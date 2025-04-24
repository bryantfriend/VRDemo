import { generateThumbnail } from './thumbnails.js';
import { createButton } from './utils.js';
import { fadeOutBackground } from './transitions.js';
import { loadSceneConfig } from './sceneManager.js';

export function buildMenu(items) {
  const menuEl = document.getElementById("ui-menu");
  const menuGroup = document.createElement("a-entity");
  menuGroup.setAttribute("position", "0 0 -2.3");
  menuGroup.setAttribute("id", "menu-group");

  items.forEach((item, i) => {
    const x = i * 1.6;
    const posStr = `${x} 0 0`;

    console.log(`🔹 Creating button for: ${item.label} at position ${posStr}`);

    const btn = createButton(item.label, posStr, () => {
      fadeOutBackground();
      // ✅ Use loadSceneConfig instead of the removed loadVideoData
      loadSceneConfig("data/" + item.json);
    });

    btn.setAttribute("material", "color: #111; opacity: 0.85; shader: flat; transparent: true");

    if (item.video) {
      const currentLabel = item.label;
      const currentVideo = item.video;

      console.log("🎞 Generating thumbnail from video:", currentVideo);
      generateThumbnail(currentVideo, (thumbUrl) => {
        console.log(`✅ Thumbnail generated for ${currentLabel}:`, thumbUrl);

        const preview = document.createElement("a-image");
        preview.setAttribute("src", thumbUrl);
        preview.setAttribute("position", "0 0.8 0.05"); // relative to button
        preview.setAttribute("width", "1.5");
        preview.setAttribute("height", "0.9");
        preview.setAttribute("visible", "false");
        preview.setAttribute("material", "opacity: 1; transparent: false");
        preview.setAttribute("look-at", "[camera]");

        btn.appendChild(preview);

        btn.addEventListener("mouseenter", () => preview.setAttribute("visible", "true"));
        btn.addEventListener("mouseleave", () => preview.setAttribute("visible", "false"));
      });
    }

    menuGroup.appendChild(btn);
  });

  menuEl.appendChild(menuGroup);
}
