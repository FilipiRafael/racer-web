import { initGame } from "./core/game.js";

document.addEventListener("DOMContentLoaded", () => {
  initGame()
    .then(() => {
      console.log("Game initialized successfully");
    })
    .catch((error) => {
      console.error("Failed to initialize game:", error);
    });
});
