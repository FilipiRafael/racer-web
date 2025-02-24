import { MotionBlurShader } from "../effects/shaders.js";

let renderer, composer, camera;
let scene;

export function setupRenderer(sceneRef) {
  scene = sceneRef;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 5, 15);

  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  const motionBlurPass = new THREE.ShaderPass(MotionBlurShader);
  composer.addPass(motionBlurPass);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  window.addEventListener("resize", onWindowResize, false);

  return {
    renderer,
    composer,
    camera,
  };
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

export function render() {
  composer.render();
}

export function getCamera() {
  return camera;
}

export function getComposer() {
  return composer;
}
