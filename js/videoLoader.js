// videoLoader.js
import { enterVideoSceneMode } from './sceneManager.js';


export function loadVideoData(jsonPath) {
  console.log(`📥 Loading video data from ${jsonPath}`);

  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("✅ Successfully loaded video data:", data);

      // 1. Load the main video
      enterVideoSceneMode(data);


      // 2. Handle scenes (timestamps with labels)
      if (data.scenes && Array.isArray(data.scenes)) {
        setupSceneMarkers(data.scenes);
      }

      // 3. Handle end options (like branching to other JSONs)
      if (data.endOptions && Array.isArray(data.endOptions)) {
        setupEndOptions(data.endOptions);
      }

    })
    .catch(error => {
      console.error("❌ Error loading video data:", error);
    });
}

// Helper: setup scene markers (timestamps)
function setupSceneMarkers(scenes) {
  console.log("🎯 Setting up scene markers:", scenes);
  // You could create buttons, markers, etc. for each scene.
  scenes.forEach(scene => {
    console.log(`Scene: ${scene.label} at ${scene.timestamp} seconds`);
    // Example: dynamically create scene jump buttons if you want
    // (Implementation depends on your UI design)
  });
}

// Helper: setup end options
function setupEndOptions(endOptions) {
  console.log("🔚 Setting up end-of-video options:", endOptions);
  // Example: when video ends, show choices for next video
  // (Implementation depends on your UI design)
}
