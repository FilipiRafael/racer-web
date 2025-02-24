const isGitHubPages = window.location.hostname.includes("github.io");

export const ENV_PATH = isGitHubPages
  ? "https://filipirafael.github.io/racer-web/assets"
  : "./assets";

export default {
  CAR_MODEL: `${ENV_PATH}/car.glb`,
  SKYBOX_TEXTURE: `${ENV_PATH}/envmap.jpg`,
  GROUND_TEXTURE:
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/terrain/grasslight-big.jpg",
};
