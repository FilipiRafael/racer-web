import paths from "../config/paths.js";
import { getCamera } from "../core/renderer.js";

let car;

export const carParams = {
  speed: 0,
  maxSpeed: 2.0,
  baseAcceleration: 0.02,
  acceleration: 0.02,
  maxAcceleration: 0.1,
  accelerationIncrease: 0.0005,
  braking: 0.04,
  turnSpeed: 0.03,
  gravity: 9.8,
  verticalVelocity: 0,
  grounded: false,
};

export function loadCarModel(scene) {
  return new Promise((resolve) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      paths.CAR_MODEL,
      (gltf) => {
        car = gltf.scene;
        car.scale.set(1, 1, 1);
        car.position.y = 0.5;
        scene.add(car);
        resolve(car);
      },
      undefined,
      (error) => console.error("Car model load error:", error)
    );
  });
}

export function getCar() {
  return car;
}

export function updateCarMovement(keyState, composer) {
  if (!car) return;

  const camera = getCamera();
  const groundLevel = 0.5;

  if (car.position.y > groundLevel) {
    carParams.verticalVelocity -= carParams.gravity * 0.016;
    car.position.y += carParams.verticalVelocity * 0.016;
    carParams.grounded = false;
  } else {
    car.position.y = groundLevel;
    carParams.verticalVelocity = 0;
    carParams.grounded = true;
  }

  if (carParams.grounded) {
    if (keyState["w"]) {
      carParams.acceleration = Math.min(
        carParams.acceleration + carParams.accelerationIncrease,
        carParams.maxAcceleration
      );
      carParams.speed = Math.min(
        carParams.speed + carParams.acceleration,
        carParams.maxSpeed
      );
    } else if (keyState["s"]) {
      carParams.speed = Math.max(
        carParams.speed - carParams.acceleration,
        -carParams.maxSpeed / 2
      );
    } else {
      if (Math.abs(carParams.speed) < carParams.braking) {
        carParams.speed = 0;
      } else {
        carParams.speed *= 0.95;
      }
      carParams.acceleration = carParams.baseAcceleration;
    }

    if ((keyState["a"] || keyState["d"]) && Math.abs(carParams.speed) > 0.01) {
      const turnDirection = keyState["a"] ? 1 : -1;
      car.rotation.y +=
        carParams.turnSpeed * (carParams.speed > 0 ? 1 : -1) * turnDirection;
    }

    car.position.z += carParams.speed * Math.cos(car.rotation.y);
    car.position.x += carParams.speed * Math.sin(car.rotation.y);
  }

  updateCamera(camera);

  updateMotionBlur(composer);
}

function updateCamera(camera) {
  const cameraOffset = new THREE.Vector3(0, 6, -25);
  const rotatedOffset = cameraOffset.applyQuaternion(car.quaternion);

  camera.position.lerp(
    new THREE.Vector3(
      car.position.x + rotatedOffset.x,
      car.position.y + rotatedOffset.y,
      car.position.z + rotatedOffset.z
    ),
    0.1
  );
  camera.lookAt(car.position);

  if (Math.abs(carParams.speed) > 1.0) {
    const normalizedSpeed = Math.abs(carParams.speed) / carParams.maxSpeed;
    camera.position.y += (Math.random() - 0.5) * normalizedSpeed * 0.2;
  }
}

function updateMotionBlur(composer) {
  const normalizedSpeed = Math.abs(carParams.speed) / carParams.maxSpeed;
  composer.passes[1].uniforms.strength.value = normalizedSpeed * 4.0;
}
