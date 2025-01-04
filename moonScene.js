import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function initMoonScene() {
  const moonScene = new THREE.Scene();
  const moonCamera = new THREE.PerspectiveCamera(
    45, // Narrower field of view
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  moonCamera.position.set(120, 200, -50); // Elevate the camera above the obstruction
  moonCamera.lookAt(120, 140, -150); // Focus on the moon

  const moonRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  moonRenderer.shadowMap.enabled = true;
  moonRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  moonScene.background = null;
  moonRenderer.setClearColor(0x000000, 0);
  moonRenderer.setSize(window.innerWidth, window.innerHeight);
  moonRenderer.domElement.style.position = "fixed";
  moonRenderer.domElement.style.top = "0";
  moonRenderer.domElement.style.left = "0";
  moonRenderer.domElement.style.zIndex = "0";
  moonRenderer.domElement.style.pointerEvents = "none";
  document.body.prepend(moonRenderer.domElement);

  const clock = new THREE.Clock();
  let mixer;
  const loader = new GLTFLoader();
  loader.load("moon.glb", (gltf) => {
    console.log("Moon loaded successfully in moonScene!");
    const moon = gltf.scene;

    moon.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffcc);
        child.material.emissiveIntensity = 0.6;
        console.log("Moon mesh found:", child);
      }
    });
    moon.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffffcc);
        child.material.emissiveIntensity = 0.6;
        // Enable shadows on the mesh
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    moon.scale.set(20, 20, 20);
    moon.position.set(120, 170, -150);
    moon.rotation.set(0, Math.PI / 5, 0);

    console.log("Moon position:", moon.position);
    moonScene.add(moon);
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(moon);
      const moonAction = gltf.animations.find(
        (clip) => clip.name === "moon|moonAction"
      );
      if (moonAction) {
        const action = mixer.clipAction(moonAction);
        action.timeScale = 0.1;
        action.play();
      }
    }

    moonScene.add(moon);
  });

  function animate() {
    requestAnimationFrame(animate);

    // Update mixer if it exists
    if (mixer) {
      const delta = clock.getDelta();
      mixer.update(delta);
    }

    moonRenderer.render(moonScene, moonCamera);
  }

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(50, 50, 50);
  dirLight.castShadow = true;
  // Configure shadow properties
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  moonScene.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 200, 0);
  moonScene.add(hemiLight);
  const moonLight = new THREE.PointLight(0xffffcc, 1, 200);
  const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
  moonScene.add(ambientLight);
  moonScene.add(moonLight);

  // Start animation
  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    moonCamera.aspect = window.innerWidth / window.innerHeight;
    moonCamera.updateProjectionMatrix();
    moonRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}
