import paths from "../config/paths.js";

let ground;

export function createGround(scene) {
  const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load(paths.GROUND_TEXTURE, (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(200, 200);
  });

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.2,
  });

  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  scene.add(ground);

  return ground;
}

export function createTrack(scene) {
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

  createTrackMarkings(scene, trackRadius, trackWidth);

  return { trackRadius, trackWidth };
}

function createTrackMarkings(scene, trackRadius, trackWidth) {
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
}

export function createTree(x, z) {
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

export function populateForest(scene, trackRadius) {
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
}
