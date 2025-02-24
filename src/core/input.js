export const keyState = {};

export function initInputHandlers() {
  window.addEventListener(
    "keydown",
    (e) => (keyState[e.key.toLowerCase()] = true)
  );

  window.addEventListener(
    "keyup",
    (e) => (keyState[e.key.toLowerCase()] = false)
  );
}
