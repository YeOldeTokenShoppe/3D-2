import "./styles/style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { gsap } from "gsap";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { MathUtils } from "three";
import { Vector3 } from "three";

const loadingManager = new THREE.LoadingManager();

// Show the loading screen when loading starts
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    `Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
  );
  document.getElementById("loadingScreen").style.display = "flex";
};

// Hide the loading screen when all items are loaded
loadingManager.onLoad = function () {
  console.log("Loading complete!");
  document.getElementById("loadingScreen").style.display = "none";
};

// Use the loading manager with the GLTFLoader

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const gltfLoader = new GLTFLoader(loadingManager);
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(
  10, // Field of view
  sizes.width / sizes.height, // Aspect ratio
  0.1, // Near clipping plane
  200 // Far clipping plane
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});

const effect = new OutlineEffect(renderer, {
  defaultThickness: 0.00085,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.5,
  defaultKeepAlive: true,
  defaultVisible: true,
});

const fixedYPosition = 0;
const controls = new OrbitControls(camera, canvas);
const minPan = new THREE.Vector3(-1, -1, -1);
const maxPan = new THREE.Vector3(1, 1, 1);
const clock = new THREE.Clock(),
  clockFF = new THREE.Clock();
let vampireMixer, vampireAnimations, vampire2Mixer, vampire2Animations;
let animations,
  animation01,
  animation02,
  animation03,
  mixer04,
  mixer01,
  mixer02,
  mixer03,
  stake,
  isPlaying01 = false,
  isPlaying02 = false,
  candleISO,
  coffinMarker = null,
  isCoffinClickable = false,
  isDragging = false,
  isStakeRisen = false,
  stakeMesh = null,
  isStakeHovered = false,
  isCoffinMarkerVisible = false,
  dragControls = null,
  vampire2,
  chart,
  arrow,
  moon,
  chest,
  chestMarker = null;

const getCamera = () => {
  camera.position.x = 80;
  camera.position.y = 50;
  camera.position.z = 80;
  scene.add(camera);
};

const getRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true; // Enable shadow rendering
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
};

const getControls = () => {
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 50;
  controls.maxDistance = 180;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minAzimuthAngle = -Math.PI * 0.1;
  controls.maxAzimuthAngle = Math.PI * 0.5;
};

const getLights = () => {
  // scene.add(new THREE.AmbientLight(0xffffff, .025))
  scene.add(new THREE.AmbientLight(0x4b2e2a, 0.08));

  // const window1 = new THREE.PointLight(0xffffff, 0.5, 5);
  // window1.position.set(-10, 6, -10);
  // scene.add(window1);

  // const window2 = new THREE.PointLight(0xffffff, 0.5, 5);
  // window2.position.set(-12, 6, -8);
  // scene.add(window2);

  // const window3 = new THREE.PointLight(0xffffff, 0.5, 4);
  // window3.position.set(-12, 6, -8);
  // window3.intensity = 0.4; // Further reduce the fill light to avoid over-brightness
  // scene.add(window3);

  const lgBottom = new THREE.PointLight(0xff0000, 5, 6, 2);
  lgBottom.position.set(0, -6, -2);
  scene.add(lgBottom);

  const lgChest = new THREE.PointLight(0xe9c46a, 2, 2);
  lgChest.position.set(0, -6.5, 1);
  scene.add(lgChest);

  const lgCandelabra01 = new THREE.PointLight(0xffffff, 1, 5, 2);
  lgCandelabra01.position.set(6, -3, -4.5);
  scene.add(lgCandelabra01);

  const lgCandelabra02 = new THREE.PointLight(0xffffff, 2, 5, 2);
  lgCandelabra02.position.set(6.5, 3.5, 0);
  scene.add(lgCandelabra02);

  const lgCandelabra04 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra04.position.set(-7, -6, 4);
  scene.add(lgCandelabra04);

  const lgCandelabra05 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra05.position.set(-7, -4, 2);
  scene.add(lgCandelabra05);

  const lgCandelabra06 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra06.position.set(-7, -2, 0);
  scene.add(lgCandelabra06);

  const lgCandelabra07 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra07.position.set(-7, 0, -2);
  scene.add(lgCandelabra07);

  const lgCandelabra08 = new THREE.PointLight(0xffffff, 2.5, 12, 3);
  lgCandelabra08.position.set(-1, 4, -4);
  scene.add(lgCandelabra08);

  const lgCandelabra09 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra09.position.set(-7, -2, 2);
  scene.add(lgCandelabra09);

  const lgCandelabra10 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra10.position.set(-7, 0, 0);
  scene.add(lgCandelabra10);

  const lgCandelabra11 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra11.position.set(-7, 2, -2);
  scene.add(lgCandelabra11);

  const lgFire01 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire01.position.set(-2, -5.5, -4.5);
  scene.add(lgFire01);

  const lgFire02 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire02.position.set(2, -5.5, -4.5);
  scene.add(lgFire02);

  const lgFire03 = new THREE.PointLight(0xf4a261, 2.5, 7, 2);
  lgFire03.position.set(5, 3.5, -4.5);
  scene.add(lgFire03);

  const lgFire04 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire04.position.set(-5, 2.5, -4.5);
  scene.add(lgFire04);

  const lgFire05 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire05.position.set(-5, 2.5, 1);
  scene.add(lgFire05);

  const lgFire06 = new THREE.PointLight(0xf4a261, 1.45, 5, 2);
  lgFire06.position.set(0, -6, 3);
  scene.add(lgFire06);

  const lgFire07 = new THREE.PointLight(0xffffff, 0.5, 2, 1);
  lgFire07.position.set(6, -4.75, 4);
  scene.add(lgFire07);
};

const candleMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe9c46a,
  emissiveIntensity: 1,
});

const candleISOMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe63946,
  emissiveIntensity: 1,
});

const fireMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe36414,
  emissiveIntensity: 1,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe2d1,
  roughness: 0.35,
  metalness: 0.1,
});

const loader = new THREE.TextureLoader();
const heart = loader.load("heart.png");
const heartMaterial = new THREE.MeshStandardMaterial({
  map: heart,
  transparent: true,
});

const noise = loader.load("noise.jpg");
const noiseMaterial = new THREE.MeshStandardMaterial({
  map: noise,
  transparent: true,
});

const getModel = () => {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.src =
    "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room14/a50f65020e8781fc118b6626a3bd6044482dd478/static/video.mp4";
  video.play();
  video.setAttribute("crossorigin", "anonymous");

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.crossOrigin = "anonymous";

  const videoMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  });
  // Spotlight for the arrow
  const arrowLight = new THREE.SpotLight(0x00ff00, 2); // Green spotlight for emphasis
  arrowLight.position.set(0, 20, -15); // Position behind and above the arrow
  arrowLight.target.position.set(0, 12, -20); // Aim at the arrow
  arrowLight.angle = Math.PI / 4; // Spotlight angle
  arrowLight.penumbra = 0.5; // Soft edges

  // Ensure the light affects only the arrow's layer
  arrowLight.layers.set(1);
  scene.add(arrowLight);
  scene.add(arrowLight.target); // Add the light's target to the scene

  gltfLoader.load("room.glb", (gltf) => {
    const room = gltf.scene;

    // Traverse the room scene and apply materials/shadows
    room.traverse((child) => {
      if (child.isMesh) {
        // Apply materials to the room objects
        child.material = concreteMaterial; // Assign concrete material
        child.material = noiseMaterial; // Optionally assign noise material

        // Enable shadows for specific room objects (if necessary)
        if (
          child.name === "WindowRock.003" ||
          child.name === "Cylinder.006" ||
          child.name === "RoomWindow"
        ) {
          child.castShadow = true; // Cast shadows
          child.receiveShadow = true; // Receive shadows
        }
      }
    });

    // Add the room to the scene
    scene.add(room);
  });
  gltfLoader.load("moon.glb", (gltf) => {
    const moon = gltf.scene;

    // Set the scale and position to place it in the sky
    moon.scale.set(2, 2, 2); // Adjust the size of the moon
    moon.position.set(15, 15, -50); // Position in the sky (adjust as needed)
    moon.rotation.set(0, Math.PI / 5, 0);

    moon.layers.set(1); // Place the moon on layer 1

    // Add the moon to the scene
    scene.add(moon);

    // Check if there are animations in the GLTF file
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(moon);
      const moonAction = gltf.animations.find(
        (clip) => clip.name === "moon|moonAction"
      );
      if (moonAction) {
        const action = mixer.clipAction(moonAction);
        action.timeScale = 0.1; // Slow down the animation to half speed
        action.play();
      }

      // Update the animation mixer in the animation loop
      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        mixer.update(delta); // Update the mixer on each frame
        renderer.render(scene, camera);
      }
      animate();
    }

    // Adjust the spotlight to reduce shadows on the lower right
    const moonLight = new THREE.SpotLight(0xffffff, 1.2); // Soft white light
    moonLight.position.set(12, 18, -40); // Slightly adjusted position (closer to the moon and higher)
    moonLight.angle = Math.PI / 3; // Widen the spotlight cone a little more
    moonLight.penumbra = 0.5; // Softer edges
    moonLight.decay = 2; // Light intensity diminishes with distance
    moonLight.distance = 100; // Maximum range of the light
    moonLight.castShadow = true;

    // Target the center of the moon more precisely
    moonLight.target.position.set(15, 15, -50); // Adjusted to align perfectly with the moon's center

    scene.add(moonLight);
    scene.add(moonLight.target); // Add the light's target to the scene

    // Ambient light for subtle moon glow (layer 1 only)
    const moonAmbientLight = new THREE.AmbientLight(0xffffff, 0.2); // Very soft ambient light
    moonAmbientLight.layers.set(1); // Affects only the moon
    scene.add(moonAmbientLight);

    // Optional: Tone mapping to handle brightness control
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.5; // Adjust exposure to handle brightness
  });

  // Ensure your room objects remain on the default layer (layer 0)
  gltfLoader.load("Things15.glb", (gltf) => {
    scene.add(gltf.scene);
  });

  gltfLoader.load("coffin.glb", (gltf) => {
    animations = gltf.animations;
    mixer01 = new THREE.AnimationMixer(gltf.scene);
    animation01 = mixer01.clipAction(animations[0]);
    scene.add(gltf.scene);
  });

  gltfLoader.load(
    "arrow.glb",
    (gltf) => {
      // Load the arrow into the scene
      arrow = gltf.scene;

      console.log("Arrow loaded:", arrow);

      // Set scale, position, and rotation of the arrow
      arrow.scale.set(3, 3, 3); // Scale up for visibility
      arrow.position.set(0, 7, -29); // Adjust position (closer if necessary)
      // arrow.rotation.set(0, Math.PI, 0); // Rotate if necessary
      arrow.layers.set(1); // Set layer to ensure it's affected by the right light

      // Traverse through arrow to set its material and visibility
      arrow.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // Green color
            emissive: new THREE.Color(0x00ff00), // Add green emission
            emissiveIntensity: 2, // Brighter emissive intensity
            side: THREE.DoubleSide, // Ensure it's visible from all angles
          });
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving
        }
      });

      // Add arrow to the scene
      scene.add(arrow);
    },
    undefined,
    (error) => {
      console.error("Error loading arrow:", error);
    }
  );

  // Load vampire2 separately outside the vampire loader
  // gltfLoader.load("customVampire.glb", (gltf) => {
  //   vampire2 = gltf.scene;
  //   const vampire2Animations = gltf.animations;

  //   vampire2.scale.set(100, 100, 100); // Final size
  //   vampire2.position.set(4, -26.3, 2); // Coffin position
  //   vampire2.rotation.set(0, Math.PI, 0); // Adjust rotation to match
  //   vampire2.visible = false; // Initially hidden
  //   const removeFirstKeyframe = (clip) => {
  //     clip.tracks.forEach((track) => {
  //       track.times = track.times.slice(1);
  //       track.values = track.values.slice(track.getValueSize());
  //     });
  //     clip.resetDuration();
  //   };

  //   // Apply the same keyframe removal to vampire2 animations
  //   vampire2Animations.forEach((clip) => removeFirstKeyframe(clip));

  //   scene.add(vampire2); // Add vampire2 to the scene
  // });
  gltfLoader.load("customVampire.glb", (gltf) => {
    vampire2 = gltf.scene;
    const vampire2Animations = gltf.animations;

    vampire2.scale.set(100, 100, 100); // Final size
    vampire2.position.set(4, -27, 2); // Coffin position
    vampire2.rotation.set(0, Math.PI, 0); // Adjust rotation to match
    vampire2.visible = false; // Initially hidden

    // Initialize an AnimationMixer for vampire2
    vampire2Mixer = new THREE.AnimationMixer(vampire2);

    // Look for an animation (the action pose)
    if (vampire2Animations && vampire2Animations.length > 0) {
      const actionPose = vampire2Animations[0]; // Assuming the first animation is the "Action" pose

      // Play the action pose to set the model's pose
      const action = vampire2Mixer.clipAction(actionPose);
      action.play(); // Play the pose

      // Optionally, set the time to 0 to ensure it's the correct frame
      vampire2Mixer.setTime(0); // Applies the first frame (pose)
    } else {
      console.error("No animations found for vampire2");
    }

    // Add vampire2 to the scene
    scene.add(vampire2);
  });
  gltfLoader.load(
    "vampire.glb",
    (gltf) => {
      const vampire = gltf.scene;
      vampireAnimations = gltf.animations;

      vampire.scale.set(1.1, 1.1, 1.1);
      vampire.position.set(0.2, -6.0, -11.1);
      vampire.rotation.set(0, Math.PI, 0);

      vampireMixer = new THREE.AnimationMixer(vampire);

      // Helper function to remove the first keyframe from each track
      const removeFirstKeyframe = (clip) => {
        clip.tracks.forEach((track) => {
          track.times = track.times.slice(1);
          track.values = track.values.slice(track.getValueSize());
        });
        clip.resetDuration();
      };

      const idleClip = vampireAnimations.find((anim) => anim.name === "idle");
      const walkClip = vampireAnimations.find((anim) => anim.name === "Walk");
      const attackClip = vampireAnimations.find(
        (anim) => anim.name === "attack"
      );

      if (!idleClip || !walkClip || !attackClip) {
        console.error("Error: Missing one or more animations.");
        return;
      }

      // Remove the first keyframe from each clip
      removeFirstKeyframe(idleClip);
      removeFirstKeyframe(walkClip);
      removeFirstKeyframe(attackClip);

      const idleAction = vampireMixer.clipAction(idleClip);
      const walkAction = vampireMixer.clipAction(walkClip);
      const attackAction = vampireMixer.clipAction(attackClip);

      attackAction.setLoop(THREE.LoopRepeat, 2);
      attackAction.clampWhenFinished = true;

      // Play the base idle animation first
      idleAction.play();

      // Function to smoothly switch animations
      const switchAnimation = (fromClip, toClip) => {
        console.log("Switching animation:", { fromClip, toClip });
        fromClip.fadeOut(1); // Fade out the current clip
        toClip.reset().fadeIn(1).play(); // Fade in the new clip
      };

      // Move vampire forward and slightly down during Walk animation
      const moveVampireForwardAndDown = () => {
        const duration = 1.5; // Move duration (1-2 seconds)

        gsap.to(vampire.position, {
          z: -8.2,
          y: vampire.position.y - 1,
          duration: duration,
          ease: "power1.inOut",
          onComplete: () => {
            switchAnimation(walkAction, attackAction); // Start attack after walking
          },
        });

        // Trigger the fade effect 2 seconds after the walking action starts
        setTimeout(() => {
          fadeToRedAndShowDeathMessage(); // Start the fade to red
        }, 2500); // 2000ms = 2 seconds
      };

      // Function to handle No button click
      const handleNoButton = () => {
        console.log("No button was clicked");

        const popupBox = document.getElementById("popupBox");
        if (popupBox) {
          popupBox.remove();
        }

        // Start the movement and walking animation
        setTimeout(() => {
          console.log("Switching vampire animation");
          switchAnimation(idleAction, walkAction);
          moveVampireForwardAndDown(); // Start moving and trigger the fade after 2s
        }, 100); // Slight delay for smoother transition (can adjust)
      };

      // Event listener for when the animation finishes
      vampireMixer.addEventListener("finished", () => {
        console.log("Vampire attack complete");

        // Trigger the fade effect immediately after the attack finishes
        fadeToRedAndShowDeathMessage();
      });
      // Function to fade the screen to red and show the death message
      const fadeToRedAndShowDeathMessage = () => {
        const deathOverlay = document.getElementById("deathOverlay");
        const deathTextBox = document.getElementById("deathTextBox");

        // Show the red overlay with a fade-in effect
        deathOverlay.style.display = "block";
        gsap.to(deathOverlay, {
          opacity: 1, // Fade in to full opacity
          duration: 1,
          onComplete: () => {
            // After the fade-in, show the death message
            deathTextBox.style.display = "block";
            gsap.to(deathTextBox, { opacity: 1, duration: 1 }); // Fade in the text box
          },
        });
      };

      // Event listener to trigger animation on coffin click
      const onCoffinClick = (event) => {
        if (!isCoffinClickable) {
          console.log("Coffin is not clickable yet!");
          return; // Exit if the coffin is not clickable yet
        }

        const coords = new THREE.Vector2(
          (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
          -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
        );

        raycaster.setFromCamera(coords, camera);
        const intersections = raycaster.intersectObjects(scene.children, true);

        if (intersections.length > 0) {
          const selectedObject = intersections[0].object;

          if (
            selectedObject.name === "Plane001" ||
            selectedObject.name === "Plane001_1"
          ) {
            console.log("Coffin clicked! Opening it...");

            // Play the coffin opening animation
            if (animation01) {
              animation01.repetitions = 1;

              if (!isPlaying01) {
                mixer01.timeScale = 1;
                animation01.reset().play(); // Play the coffin opening animation
                isPlaying01 = true;
                animation01.clampWhenFinished = true;

                // Vampire in idle animation (if not already playing)
                if (vampireMixer) {
                  idleAction.play(); // Play the idle animation
                }

                // Show a pop-up box after 2 seconds
                setTimeout(() => {
                  showStakePopup(); // Call the function to display the new popup
                }, 2000); // Wait 2 seconds before showing the popup
              }
            }
          }
        }
      };
      const handleYesButton = () => {
        console.log("Yes button was clicked");

        const popupBox = document.getElementById("popupBox");
        if (popupBox) {
          popupBox.remove();
        }

        const vampireChestPosition = {
          x: vampire.position.x - 0.09, // Adjust to be slightly in front of vampire
          y: vampire.position.y + 2.1, // Adjust slightly higher to hit the chest
          z: vampire.position.z + 6.3, // Adjust z-axis to be slightly in front
        };
        gsap.to(stakeMesh.position, {
          duration: 1,
          x: vampireChestPosition.x,
          y: vampireChestPosition.y,
          z: vampireChestPosition.z,
          ease: "power1.inOut",
          onComplete: () => {
            console.log("Stake placed into the vampire's chest.");
            vampire.visible = false;

            loadVampireHurtModel(); // Call to load the hurt vampire
            vampire2.visible = true;
          },
        });
        gsap.to(stakeMesh.rotation, {
          duration: 1, // Adjust the duration as desired
          x: Math.PI / 4, // Rotate 90 degrees on the X axis
          y: Math.PI / 2, // Keep the Y axis the same or adjust as needed
          z: Math.PI / 4, // Rotate 45 degrees on the Z axis (adjust as needed)
          ease: "power2.inOut", // Easing function for smooth rotation
          onComplete: () => {
            console.log("Stake rotation completed.");
          },
        });
      };

      const loadVampireHurtModel = () => {
        if (!vampire2) {
          gltfLoader.load("vampire2.glb", (gltf) => {
            vampire2 = gltf.scene;
            vampire2.scale.set(100, 100, 100);
            vampire2.position.set(4, -26.5, 2);
            vampire2.rotation.set(0, Math.PI, 0);

            vampire2.visible = true; // Ensure it's visible
            scene.add(vampire2);
            console.log("Vampire in hurt pose loaded and displayed.");
          });
        } else {
          vampire2.visible = true;
          vampire2.position.set(4, -26.2, 2);
          console.log("Vampire in hurt pose displayed.");
        }
        // Remove the glow by resetting the emissive properties
        // stakeMesh.material.emissive = new THREE.Color(0x000000); // Set emissive to black
        // stakeMesh.material.emissiveIntensity = 0; // Set emissive intensity to 0 to remove glow
        // console.log("Glow removed from stake.");
      };
      // Add event listener to trigger animation on click
      document.addEventListener("mousedown", onCoffinClick);

      // Add vampire to the scene
      scene.add(vampire);

      // Event listener for the No button click inside the vampire loader
      document.addEventListener("mousedown", (event) => {
        const noButton = event.target.closest("button");
        if (noButton && noButton.textContent === "No") {
          handleNoButton();
        }
      });
      document.addEventListener("mousedown", (event) => {
        const yesButton = event.target.closest("button");
        if (yesButton && yesButton.textContent === "Yes") {
          handleYesButton();
        }
      });
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the vampire:", error);
    }
  );
  let chest; // Declare the chest variable to store the chest object

  gltfLoader.load("chest.glb", (gltf) => {
    animations = gltf.animations;
    mixer02 = new THREE.AnimationMixer(gltf.scene);
    animation02 = mixer02.clipAction(animations[0]);

    // Store the chest in the chest variable and set its name
    chest = gltf.scene;
    chest.name = "chest"; // Assign a name to the chest

    scene.add(chest); // Add the chest to the scene
  });

  gltfLoader.load("stake.glb", (gltf) => {
    stake = gltf.scene; // Assign the whole scene of the stake model
    scene.add(gltf.scene); // Add the model to the scene

    // Traverse the stake object to find the actual stake mesh
    stake.traverse((child) => {
      if (child.isMesh) {
        stakeMesh = child; // Assign the actual mesh to stakeMesh

        // Now initialize and set up drag controls after the stake mesh is ready
        dragControls = new DragControls(
          [stakeMesh],
          camera,
          renderer.domElement
        );
        setupDragControls(); // Call this function after initializing dragControls
      }
    });
  });
  gltfLoader.load("fire.glb", (gltf) => {
    // gltf.scene.traverse((child) => (child.material = fireMaterial));
    animations = gltf.animations;
    console.log("--s", gltf);
    mixer04 = new THREE.AnimationMixer(gltf.scene);
    animations.forEach((clip) => mixer04.clipAction(clip).play());
    scene.add(gltf.scene);
  });
  gltfLoader.load("maryGLB.glb", (gltf) => {
    const statue = gltf.scene;
    statue.scale.set(3.5, 3.5, 3.5);
    statue.position.set(5.5, 2, -6.5);
    statue.rotation.y = 0.5;

    // Enable shadows for the statue
    statue.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(statue);

    // Spotlight for the statue's face (ethereal glow)
    const faceLight = new THREE.SpotLight(0xffffff, 0.5); // White light with lower intensity
    faceLight.position.set(6, 6, -5); // Position above and slightly in front of the statue
    faceLight.target.position.set(5.5, 3, -6.5); // Aim directly at the face (adjust as needed)
    faceLight.angle = Math.PI / 20; // Very narrow beam for focused light
    faceLight.penumbra = 0.6; // Soft shadow edges for the ethereal effect
    faceLight.decay = 2; // Adjust for more realistic light falloff
    faceLight.distance = 20; // Limit the light range so it only affects the face

    // Optional: Add slight color tint for ethereal glow
    faceLight.color.set(0xadd8e6); // Soft blue light for a subtle ethereal effect

    faceLight.castShadow = true;
    faceLight.shadow.mapSize.width = 1024;
    faceLight.shadow.mapSize.height = 1024;
    faceLight.shadow.camera.near = 1;
    faceLight.shadow.camera.far = 20;

    scene.add(faceLight);
    scene.add(faceLight.target);
  });

  gltfLoader.load("heart.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = heartMaterial));
    scene.add(gltf.scene);
  });

  const video2 = document.createElement("video");
  video2.src = "./noise.jpg"; // Path to your video file
  video2.muted = true;
  video2.loop = true;
  video2.play();

  const videoTexture2 = new THREE.VideoTexture(video2);

  gltfLoader.load("laptop.glb", (gltf) => {
    const laptop = gltf.scene;
    laptop.scale.set(0.05, 0.05, 0.05);
    laptop.position.set(0.25, 2.25, -4);

    laptop.traverse((child) => {
      if (child.isMesh && child.name === "Screen_ComputerScreen_0") {
        // Apply the video texture to the laptop screen
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture2 });
      }
    });

    scene.add(laptop);
  });

  gltfLoader.load("chair.glb", (gltf) => {
    const chair = gltf.scene;
    chair.scale.set(0.41, 0.41, 0.41);
    chair.position.z = -1.5;
    chair.position.x = 1;
    chair.rotation.y = Math.PI / 4; // Rotate 45 degrees

    // Traverse through the chair parts and change their material colors
    chair.traverse((child) => {
      if (child.isMesh) {
        switch (child.name) {
          case "Object_4": // Change the color of part 1
            child.material.color.set(0xff0000); // Red color
            break;
          case "Object_5": // Change the color of part 2
            child.material.color.set(0xff0000);
            break;
          case "Object_6": // Change the color of part 3
            child.material.color.set(0x000000); // Blue color
            break;
          default:
            break;
        }
      }
    });

    scene.add(chair);
  });

  gltfLoader.load("candle.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleMaterial));
    scene.add(gltf.scene);
  });

  gltfLoader.load("candleISO.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleISOMaterial));
    candleISO = gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.position.y = -1000;
  });

  // gltfLoader.load("screen01.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
  // gltfLoader.load("screen02.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
  // gltfLoader.load("screen03.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
  // gltfLoader.load("screen04.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
  // gltfLoader.load("screen05.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
  // gltfLoader.load("screen06.glb", (gltf) => {
  //   gltf.scene.traverse((child) => (child.material = videoMaterial));
  //   scene.add(gltf.scene);
  // });
};

// Hovering function with smooth up-and-down animation
const animateHover = (riseHeight, hoverHeight, hoverDuration) => {
  gsap.to(stakeMesh.position, {
    y: riseHeight + hoverHeight,
    duration: hoverDuration,
    // repeat: -1, // Infinite repeat for continuous hovering
    // yoyo: true, // Smooth back-and-forth movement
    ease: "none", // Constant ease for smooth animation
  });
};

// Spin animation
const animateSpin = () => {
  gsap.to(stakeMesh.rotation, {
    // rotate: 3, // 360 degrees in radians
    duration: 3, // Duration for one full rotation
    repeat: -1, // Infinite repeat
    ease: "none", // Constant ease for smooth spinning
  });
};

// Function to initialize drag controls for the stake
const setupDragControls = () => {
  dragControls.addEventListener("dragstart", (event) => {
    console.log("Drag started on the stake");
    isDragging = true;
    controls.enabled = false; // Disable OrbitControls while dragging
    gsap.killTweensOf(stakeMesh.position); // Stop hover animation
    gsap.killTweensOf(stakeMesh.rotation); // Stop spin animation

    // Ensure stakeMesh is valid before proceeding
    if (stakeMesh && isStakeHovered && !isCoffinMarkerVisible) {
      isCoffinMarkerVisible = true; // Prevent creating the marker multiple times
      setTimeout(() => {
        console.log("Displaying coffin marker");
        createCoffinMarker(); // Create the coffin marker after the drag starts
      }, 500); // Add a slight delay for effect
    }
  });

  // Allow free movement in the X and Z directions but lock the Y axis
  dragControls.addEventListener("drag", (event) => {
    if (stakeMesh) {
      stakeMesh.position.x = event.object.position.x;
      stakeMesh.position.z = event.object.position.z;
    } else {
      console.warn("stakeMesh is undefined during drag event");
    }
  });

  // Event listener for when the drag ends
  dragControls.addEventListener("dragend", () => {
    console.log("Drag ended on the stake");
    isDragging = false;
    controls.enabled = true; // Re-enable OrbitControls after dragging

    // Restart hover and spin animations
    animateSpin();
  });
};

const pulseGlow = (sprite) => {
  gsap.to(sprite.material.map.image, {
    shadowBlur: 30, // Increase blur for pulsing effect
    duration: 1.5, // Duration of one pulse
    ease: "power1.inOut", // Smooth pulsing effect
    repeat: -1, // Infinite repetition
    yoyo: true, // Reverse animation back to original state
  });
};
// Chest Marker (with delay)
const createChestMarker = () => {
  if (chestMarker) return;

  // Delay loading the chest marker by 2 seconds (adjustable)
  setTimeout(() => {
    const markerCanvas = document.createElement("canvas");
    const context = markerCanvas.getContext("2d");
    markerCanvas.width = 128;
    markerCanvas.height = 128;

    context.shadowColor = "#FFD700"; // Gold glow color
    context.shadowBlur = 20; // Initial glow blur

    context.fillStyle = "#FFD700"; // Bright gold color
    context.beginPath();
    context.arc(64, 64, 60, 0, Math.PI * 2);
    context.fill();

    context.font = "bold 60px Arial";
    context.fillStyle = "#000000"; // Black text color
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("1", 64, 64);

    const texture = new THREE.CanvasTexture(markerCanvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    chestMarker = new THREE.Sprite(spriteMaterial);

    chestMarker.scale.set(0.6, 0.6, 1);
    chestMarker.position.set(-1.3, -6, 2);
    chestMarker.name = "chestMarker";

    scene.add(chestMarker);

    // Start pulsing the glow for the chest marker
    pulseGlow(chestMarker);
  }, 2000); // Delay of 2000ms (2 seconds)
};

// Function to handle clicking the chest marker
const onChestMarkerClick = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  console.log(intersections); // Check what is being intersected

  if (intersections.length > 0) {
    let selectedObject = intersections.find(
      (intersect) => intersect.object.name === "chestMarker"
    );

    if (selectedObject) {
      console.log("Chest marker clicked!");

      // Example of showing a text box or modal
      showInstructionText("A locked chest? Open it to see what's inside.");

      camera.fov = 7; // Update the FOV for a wider or narrower view if needed
      camera.position.set(
        // coffin.position.x,
        // coffin.position.y - 25,
        // coffin.position.z + 2,
        (controls.target.y = -4.5),
        (controls.target.z = -6),
        (controls.target.x = 3)
      );

      // Assuming you're using gsap or TWEEN library
      gsap.to(camera.position, {
        duration: 3, // duration of the tween (in seconds)
        // Set new camera position
        onUpdate: () => {
          camera.lookAt(chest.position);
          controls.update();
        },
        onComplete: () => {
          console.log("Camera zoomed in on the chest.");
        },
      });

      // Remove the chest marker after clicking
      scene.remove(chestMarker);
      chestMarker = null;
    } else {
      console.log("Chest marker not found or clicked.");
    }
  } else {
    console.log("No intersections detected.");
  }
};

// Function to display a styled text box in the center of the screen
const showInstructionText = (text) => {
  let messageBox = document.getElementById("messageBox");

  // Check if the messageBox already exists, if not create it
  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    document.body.appendChild(messageBox);

    // Apply styles to the messageBox
    messageBox.style.position = "fixed";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.padding = "20px";
    messageBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    messageBox.style.color = "#fff"; // White text
    messageBox.style.fontFamily = "Arial, sans-serif";
    messageBox.style.fontSize = "18px";
    messageBox.style.textAlign = "center";
    messageBox.style.border = "2px solid white"; // White border
    messageBox.style.borderRadius = "10px";
    messageBox.style.maxWidth = "80%";
    messageBox.style.zIndex = "1000"; // Make sure it's on top of other elements
  }

  // Set the text and show the message box
  messageBox.innerHTML = text;

  // Automatically hide the message box after 5 seconds
  setTimeout(() => {
    messageBox.remove();
  }, 5000); // Adjust the timeout value as needed
};

const createCoffinMarker = () => {
  if (coffinMarker) return;

  const markerCanvas = document.createElement("canvas");
  const context = markerCanvas.getContext("2d");
  markerCanvas.width = 128;
  markerCanvas.height = 128;

  context.shadowColor = "#FFD700"; // Gold glow color
  context.shadowBlur = 20; // Initial glow blur

  context.fillStyle = "#FFD700"; // Bright gold color
  context.beginPath();
  context.arc(64, 64, 60, 0, Math.PI * 2);
  context.fill();

  context.font = "bold 60px Arial";
  context.fillStyle = "#000000"; // Black text color
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("2", 64, 64);

  const texture = new THREE.CanvasTexture(markerCanvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  coffinMarker = new THREE.Sprite(spriteMaterial);

  coffinMarker.scale.set(0.6, 0.6, 1);
  coffinMarker.position.set(-1.5, -3, -4);
  coffinMarker.name = "coffinMarker";

  scene.add(coffinMarker);

  // Start pulsing the glow for the coffin marker
  pulseGlow(coffinMarker);
};

const onCoffinMarkerClick = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    // Check if the clicked object is the coffin marker
    if (selectedObject.name === "coffinMarker") {
      console.log("Coffin marker clicked!");

      // Get the coffin mesh (assuming 'Plane001' is the coffin mesh name)
      const coffin = scene.getObjectByName("Plane001");

      if (coffin) {
        // Update the camera FOV and position immediately
        camera.fov = 7; // Update the FOV for a wider or narrower view if needed
        camera.position.set(
          // coffin.position.x,
          // coffin.position.y - 25,
          // coffin.position.z + 2,
          (controls.target.y = -4.5),
          (controls.target.z = -8),
          (controls.target.x = 1),
          controls.update()
        ); // Set new camera position
        camera.lookAt(coffin.position); // Make the camera look at the coffin's position

        // After updating the camera settings, you need to call this to apply the changes:
        camera.updateProjectionMatrix();

        // Optionally, show the instruction text
        showInstructionText("Do you dare open it?");
        isCoffinClickable = true;

        // Move the stake closer to the coffin, if necessary
        if (stakeMesh) {
          stakeMesh.position.set(
            coffin.position.x + 0,
            coffin.position.y - 1,
            coffin.position.z + 1
          );
          console.log("Stake moved near the coffin.");
        }

        // Optionally remove the coffin marker after it's clicked
        scene.remove(coffinMarker);
        coffinMarker = null;
      } else {
        console.error("Coffin (Plane001) not found in the scene!");
      }
    }
  }
};

const showStakePopup = () => {
  let popupBox = document.getElementById("popupBox");

  // Check if the popupBox already exists, if not create it
  if (!popupBox) {
    popupBox = document.createElement("div");
    popupBox.id = "popupBox";
    document.body.appendChild(popupBox);

    // Apply styles to the popupBox and initially hide it
    popupBox.style.position = "fixed";
    popupBox.style.top = "50%";
    popupBox.style.left = "50%";
    popupBox.style.transform = "translate(-50%, -50%)";
    popupBox.style.padding = "20px";
    popupBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    popupBox.style.color = "#fff"; // White text
    popupBox.style.fontFamily = "Arial, sans-serif";
    popupBox.style.fontSize = "18px";
    popupBox.style.textAlign = "center";
    popupBox.style.border = "2px solid white"; // White border
    popupBox.style.borderRadius = "10px";
    popupBox.style.maxWidth = "80%";
    popupBox.style.zIndex = "1000"; // Ensure it's on top of other elements
    popupBox.style.visibility = "hidden"; // Initially hidden

    // Add the message and buttons with a 3-second delay
    setTimeout(() => {
      // Make the popupBox visible after delay
      popupBox.style.visibility = "visible";

      const message = document.createElement("p");
      message.textContent =
        "Do you want to stake your tokens to slay the vampire?";
      popupBox.appendChild(message);

      // Add the "Yes" button
      const yesButton = document.createElement("button");
      yesButton.textContent = "Yes";
      yesButton.style.margin = "10px";
      yesButton.style.padding = "10px";
      yesButton.style.backgroundColor = "#4CAF50";
      yesButton.style.color = "#fff";
      yesButton.style.border = "none";
      yesButton.style.borderRadius = "5px";
      yesButton.style.cursor = "pointer";

      yesButton.onclick = () => {
        console.log("User clicked Yes!");
        handleYesButton(); // Handle the action when user clicks "Yes"
        popupBox.remove(); // Remove the popup after clicking
      };
      popupBox.appendChild(yesButton);

      // Add the "No" button
      const noButton = document.createElement("button");
      noButton.textContent = "No";
      noButton.style.margin = "10px";
      noButton.style.padding = "10px";
      noButton.style.backgroundColor = "#f44336";
      noButton.style.color = "#fff";
      noButton.style.border = "none";
      noButton.style.borderRadius = "5px";
      noButton.style.cursor = "pointer";

      noButton.onclick = () => {
        console.log("User clicked No.");
        handleNoButton();
        popupBox.remove(); // Remove the popup after clicking
      };
      popupBox.appendChild(noButton);
    }, 3000); // 3-second delay for the message and buttons
  }
};

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 10 },
  },
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const getFireflies = () => {
  const firefliesGeometry = new THREE.BufferGeometry();
  const firefliesCount = 40;
  const positionArray = new Float32Array(firefliesCount * 3);
  const scaleArray = new Float32Array(firefliesCount * 1);

  for (let i = 0; i < firefliesCount; i++) {
    new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      1 + Math.random() * 2 * 2,
      -2 + (Math.random() - 0.5) * 8
    ).toArray(positionArray, i * 3);

    scaleArray[i] = Math.random();
    scaleArray[i] = Math.random();
  }

  firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  firefliesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scaleArray, 1)
  );

  const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
  scene.add(fireflies);
};

getFireflies();

const onMouseDown = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (selectedObject.name === "StakeBAse") {
      console.log("StakeBAse was clicked!");

      if (!isStakeRisen) {
        isStakeRisen = true; // Mark the stake as risen

        // Ensure the chest opens first
        if (!isPlaying02) {
          animation02.repetitions = 1; // Chest will open once
          mixer02.timeScale = 1; // Normal playback
          animation02.reset().play(); // Play the chest opening animation
          animation02.clampWhenFinished = true; // Keep the chest open
          isPlaying02 = true; // Prevent the chest from re-opening
        }

        // Remove the chest marker after the chest opens
        if (chestMarker) {
          scene.remove(chestMarker); // Remove the chest marker from the scene
          console.log("Chest marker removed.");
        }

        // Apply the glow effect to the stake before it rises
        stakeMesh.material.emissive = new THREE.Color(0xfdd017); // Yellow glow
        stakeMesh.material.emissiveIntensity = 1.5; // Increase the glow intensity

        // Animate the stake rise up
        gsap.to(stakeMesh.position, {
          y: stakeMesh.position.y + 2.5, // Rise above the chest
          duration: 2,
          ease: "power1.out",
          onComplete: () => {
            isStakeHovered = true; // Mark the stake as hovering
            animateHover(stakeMesh.position.y, 0.01, 2); // Hover animation
          },
        });
        // Show the instruction after a delay
        setTimeout(() => {
          showInstructionText(
            "A wooden stake might come in handy. Better grab it!"
          );
        }, 2000);

        // Initialize drag controls once the stake is hovering
        setupDragControls();
      }
    }

    // Check for CandleBase056 here inside the intersection block
    if (selectedObject.name == "CandleBase056") {
      scene.remove(selectedObject.parent);
    }

    console.log(`${selectedObject.name} was clicked!`);
  }
};

// The animate function
const animate = () => {
  requestAnimationFrame(animate);

  const elapsedTime = clockFF.getElapsedTime();
  let delta = clock.getDelta();
  controls.update();
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

  // Update the annotations positions and opacity
  // updateAnnotationOpacity();
  // updateScreenPosition();

  // Render the scene
  renderer.render(scene, camera);
  effect.render(scene, camera);

  // Update mixers for animations
  if (mixer01) mixer01.update(delta);
  if (mixer02) mixer02.update(delta);
  if (mixer03) mixer03.update(delta);
  if (mixer04) mixer04.update(delta);
  if (vampireMixer) vampireMixer.update(delta);
};

// Resize listener
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();

window.addEventListener("mousemove", (e) => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousedown", onChestMarkerClick);
document.addEventListener("mousedown", onCoffinMarkerClick);

// Call the function to create the chest marker when initializing the scene
createChestMarker();

window.addEventListener("dblclick", () => {
  if (!candleISO) {
    console.error("candleISO is not loaded yet!");
    return;
  }

  // Ignore clicks on the floor or specific objects like 'RoomFloor02'
  if (
    intersectionPoint &&
    intersectionPoint.object &&
    intersectionPoint.object.name === "RoomFloor02"
  ) {
    console.log("Ignoring clicks on the floor for candle placement.");
    return;
  }

  // Clone the candleISO model
  // const clonedCandle = candleISO.clone();
  // scene.add(clonedCandle);

  // // Set its position using the intersection point of the raycaster
  // const { x, z } = intersectionPoint;
  // clonedCandle.position.set(x, 0.5, z); // Adjust height (y-axis) as needed, keep candles on the floor

  // // Debug the position of the candle
  // console.log("Candle added at position:", clonedCandle.position);

  // // Optional: Add a scale factor for better visibility (if needed)
  // clonedCandle.scale.set(1, 1, 1); // Adjust scale as needed

  // Optional: Add a bounding box for debugging
  // const boundingBox = new THREE.BoxHelper(clonedCandle, 0xffff00); // Yellow bounding box for debugging
  // scene.add(boundingBox);

  // Optional: Remove the candle after 2 seconds (uncomment if needed)
  // setTimeout(() => {
  //   clonedCandle.visible = false;
  //   console.log("Candle removed");
  // }, 2000);
});

getModel();
getRenderer();
getCamera();
getControls();
getLights();
animate();
