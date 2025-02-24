let scene, camera, renderer, car, ground, composer, skyDome;
const keyState = {};
const carParams = {
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

const MotionBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    strength: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float strength;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 dir = normalize(vUv - vec2(0.5));
      float dist = length(vUv - vec2(0.5));
      float blur = max(dist - 0.1, 0.0) * strength * 0.5;

      vec4 sum = vec4(0.0);
      for(int i = 0; i < 12; i++) {
        float offset = float(i) * 0.004 * blur;
        vec2 pos = vUv + dir * offset;
        sum += texture2D(tDiffuse, pos);
      }
      gl_FragColor = sum / 12.0;
    }
  `,
};

function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 10, 8);
  const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2f1b });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

  const leavesGeometry = new THREE.ConeGeometry(7.5, 15, 8);
  const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0f5f13 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 12.5;

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);
  tree.position.set(x, -2, z);
  return tree;
}

function createSkyDome() {
  const geometry = new THREE.SphereGeometry(1000, 32, 32);
  geometry.scale(-1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load("/assets/envmap.jpg", (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
    }),
  });
  skyDome = new THREE.Mesh(geometry, material);
  scene.add(skyDome);
}

function init() {
  scene = new THREE.Scene();

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

  createSkyDome();

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

  const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load(
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/terrain/grasslight-big.jpg",
    (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(200, 200);
    }
  );

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.2,
  });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  scene.add(ground);

  const trackRadius = 500;
  const trackWidth = 30;
  const trackGeometry = new THREE.RingGeometry(
    trackRadius - trackWidth / 2,
    trackRadius + trackWidth / 2,
    128
  );
  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.8,
  });
  const track = new THREE.Mesh(trackGeometry, trackMaterial);
  track.rotation.x = -Math.PI / 2;
  track.position.y = -2.9;
  scene.add(track);

  const lineGeometry = new THREE.PlaneGeometry(2, trackWidth * 0.1);
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2;
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.x = Math.cos(angle) * trackRadius;
    line.position.z = Math.sin(angle) * trackRadius;
    line.position.y = -2.8;
    line.rotation.x = -Math.PI / 2;
    line.rotation.z = angle;
    scene.add(line);
  }

  const forestRadius = 2000;
  const numTrees = 2000;

  for (let i = 0; i < numTrees; i++) {
    const angle = (i / numTrees) * Math.PI * 2;
    const randomRadius = forestRadius + (Math.random() - 0.5) * 1000;
    const x = Math.cos(angle) * randomRadius;
    const z = Math.sin(angle) * randomRadius;
    if (Math.abs(x) > trackRadius + 50 || Math.abs(z) > trackRadius + 50) {
      scene.add(createTree(x, z));
    }
  }

  for (let i = 0; i < 500; i++) {
    const angle = Math.random() * Math.PI * 2;
    const randomRadius = trackRadius + 100 + Math.random() * 300;
    const x = Math.cos(angle) * randomRadius;
    const z = Math.sin(angle) * randomRadius;
    scene.add(createTree(x, z));
  }

  const loader = new THREE.GLTFLoader();
  loader.load(
    "/assets/car.glb",
    (gltf) => {
      car = gltf.scene;
      car.scale.set(1, 1, 1);
      car.position.y = 0.5;
      scene.add(car);
    },
    undefined,
    (error) => console.error("Car model load error:", error)
  );

  window.addEventListener(
    "keydown",
    (e) => (keyState[e.key.toLowerCase()] = true)
  );
  window.addEventListener(
    "keyup",
    (e) => (keyState[e.key.toLowerCase()] = false)
  );
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function updateCarMovement() {
  if (!car) return;

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

  const normalizedSpeed = Math.abs(carParams.speed) / carParams.maxSpeed;
  composer.passes[1].uniforms.strength.value = normalizedSpeed * 4.0;

  if (Math.abs(carParams.speed) > 1.0) {
    camera.position.y += (Math.random() - 0.5) * normalizedSpeed * 0.2;
  }

  if (skyDome && Math.abs(carParams.speed) > 0.01) {
    if (keyState["a"]) skyDome.rotation.y += 0.01;
    if (keyState["d"]) skyDome.rotation.y -= 0.01;
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateCarMovement();
  composer.render();
}

init();
