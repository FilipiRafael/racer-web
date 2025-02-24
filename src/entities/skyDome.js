import paths from "../config/paths.js";

let skyDome;

export function createSkyDome(scene) {
  const geometry = new THREE.SphereGeometry(1000, 32, 32);
  geometry.scale(-1, 1, 1);

  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(paths.SKYBOX_TEXTURE, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
    }),
  });

  skyDome = new THREE.Mesh(geometry, material);
  scene.add(skyDome);

  return skyDome;
}

export function getSkyDome() {
  return skyDome;
}

export function updateSkyDome(keyState, carSpeed) {
  if (skyDome && Math.abs(carSpeed) > 0.01) {
    if (keyState["a"]) skyDome.rotation.y += 0.01;
    if (keyState["d"]) skyDome.rotation.y -= 0.01;
  }
}
