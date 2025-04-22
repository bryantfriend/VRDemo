export function generateThumbnail(videoSrc, callback) {
  const hiddenVideo = document.getElementById("hiddenVideo");
  const canvas = document.getElementById("thumbnailCanvas");
  const ctx = canvas.getContext("2d");

  hiddenVideo.crossOrigin = "anonymous";
  hiddenVideo.src = videoSrc;
  hiddenVideo.currentTime = 1;
  hiddenVideo.load();

  let triggered = false;

  hiddenVideo.addEventListener("loadeddata", () => {
    if (triggered) return;
    triggered = true;

    setTimeout(() => {
      try {
        ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      } catch (err) {
        console.warn("❌ Thumbnail generation failed for", videoSrc, err);
      }
    }, 200); // Increased to 200ms for better reliability
  }, { once: true });

  // Fallback safety net
  setTimeout(() => {
    if (!triggered) {
      console.warn("⚠️ Fallback triggered for thumbnail of:", videoSrc);
    }
  }, 1000);
}
