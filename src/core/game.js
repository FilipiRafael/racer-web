import { setupRenderer, render, getComposer } from "./renderer.js";
import { initInputHandlers, keyState } from "./input.js";
import { createSkyDome, updateSkyDome } from "../entities/skyDome.js";
import { loadCarModel, updateCarMovement, carParams } from "../entities/car.js";

import {
  createGround,
  createTrack,
  populateForest,
} from "../entities/terrain.js";


let scene;

export async function initGame() {
  scene = new THREE.Scene();

  const { composer } = setupRenderer(scene);

  initInputHandlers();

  const skyDome = createSkyDome(scene);
  const ground = createGround(scene);
  const { trackRadius } = createTrack(scene);
  populateForest(scene, trackRadius);

  await loadCarModel(scene);

  animate();

  return {
    scene,
  };
}

function animate() {
  requestAnimationFrame(animate);

  updateCarMovement(keyState, getComposer());
  updateSkyDome(keyState, carParams.speed);

  render();
}
