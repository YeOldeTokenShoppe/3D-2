import * as THREE from "three";

class ParticleSky {
  constructor() {
    this.particles = [];
    this.dustParticles = [];
    this.ripples = [];
    this.fireworkParticles = [];
    this.backgroundHue = 0;
    this.frameCount = 0;
    this.autoDrift = true;

    // Mouse state for particle interaction
    this.mouse = {
      x: null,
      y: null,
      set: function ({ x, y }) {
        this.x = x;
        this.y = y;
      },
      reset: function () {
        this.x = null;
        this.y = null;
      },
    };
  }

  init(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    // Create particle geometry
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: window.devicePixelRatio },
        uSize: { value: 30 },
        uTime: { value: 0 },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create background plane for gradient
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBackgroundHue: { value: 0 },
      },
      vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float uTime;
                uniform float uBackgroundHue;
                
                vec3 hsl2rgb(vec3 c) {
                    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
                    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
                }

                void main() {
                    float hue = mod(uBackgroundHue + uTime * 0.1, 360.0) / 360.0;
                    vec3 color1 = hsl2rgb(vec3(hue, 0.4, 0.15));
                    vec3 color2 = hsl2rgb(vec3(mod(hue + 0.333, 1.0), 0.4, 0.25));
                    gl_FragColor = vec4(mix(color1, color2, gl_FragCoord.y / 900.0), 1.0);
                }
            `,
    });

    this.backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.backgroundPlane.position.z = -1;
    this.scene.add(this.backgroundPlane);

    this.createParticles();
    this.setupEventListeners();
  }

  createParticles() {
    const count = this.adjustParticleCount();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      scales[i] = Math.random();
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.particleGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scales, 1)
    );
    this.velocities = velocities;

    this.particlePoints = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial
    );
    this.scene.add(this.particlePoints);

    // Create connecting lines geometry
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.lines);
  }

  adjustParticleCount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 450) return 40;
    if (width < 600) return 50;
    if (width < 900) return 70;
    if (width < 1200) return 90;
    return 110;
  }

  setupEventListeners() {
    window.addEventListener("mousemove", (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.mouse.set({ x, y });
      this.autoDrift = false;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.reset();
      this.autoDrift = true;
    });

    window.addEventListener("click", (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.createExplosion(x, y);
    });
  }

  createExplosion(x, y) {
    const count = 15;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.1 + 0.05;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = 0;

      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.sin(angle) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;

      scales[i] = Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const points = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(points);

    const explosion = {
      points,
      positions,
      velocities,
      life: 1.0,
    };

    this.fireworkParticles.push(explosion);
  }

  updateParticleConnections() {
    const positions = this.particleGeometry.attributes.position.array;
    const connections = [];
    const indices = [];

    for (let i = 0; i < positions.length; i += 3) {
      const x1 = positions[i];
      const y1 = positions[i + 1];
      const z1 = positions[i + 2];

      for (let j = i + 3; j < positions.length; j += 3) {
        const x2 = positions[j];
        const y2 = positions[j + 1];
        const z2 = positions[j + 2];

        const dist = Math.sqrt(
          (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
        );

        if (dist < 2) {
          connections.push(x1, y1, z1, x2, y2, z2);
          indices.push(indices.length, indices.length + 1);
        }
      }
    }

    this.lines.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connections, 3)
    );
    this.lines.geometry.setIndex(indices);
  }

  update() {
    const time = performance.now() * 0.001;

    // Update uniforms
    this.particleMaterial.uniforms.uTime.value = time;
    this.backgroundPlane.material.uniforms.uTime.value = time;
    this.backgroundPlane.material.uniforms.uBackgroundHue.value =
      this.backgroundHue;

    // Update background hue
    this.backgroundHue = (this.backgroundHue + 0.2) % 360;

    // Update particle positions
    const positions = this.particleGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const i3 = i;

      if (this.autoDrift) {
        this.velocities[i3] += (Math.random() - 0.5) * 0.001;
        this.velocities[i3 + 1] += (Math.random() - 0.5) * 0.001;
        this.velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;
      }

      if (this.mouse.x !== null) {
        const dx = this.mouse.x - positions[i3];
        const dy = this.mouse.y - positions[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
          this.velocities[i3] += dx * 0.0001;
          this.velocities[i3 + 1] += dy * 0.0001;
        }
      }

      // Apply velocities
      positions[i3] += this.velocities[i3];
      positions[i3 + 1] += this.velocities[i3 + 1];
      positions[i3 + 2] += this.velocities[i3 + 2];

      // Dampen velocities
      this.velocities[i3] *= 0.99;
      this.velocities[i3 + 1] *= 0.99;
      this.velocities[i3 + 2] *= 0.99;

      // Bounce off boundaries
      const bounds = 10;
      if (Math.abs(positions[i3]) > bounds) {
        positions[i3] = Math.sign(positions[i3]) * bounds;
        this.velocities[i3] *= -0.8;
      }
      if (Math.abs(positions[i3 + 1]) > bounds) {
        positions[i3 + 1] = Math.sign(positions[i3 + 1]) * bounds;
        this.velocities[i3 + 1] *= -0.8;
      }
      if (Math.abs(positions[i3 + 2]) > bounds) {
        positions[i3 + 2] = Math.sign(positions[i3 + 2]) * bounds;
        this.velocities[i3 + 2] *= -0.8;
      }
    }

    this.particleGeometry.attributes.position.needsUpdate = true;

    // Update firework particles
    for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
      const explosion = this.fireworkParticles[i];
      const positions = explosion.points.geometry.attributes.position.array;

      for (let j = 0; j < positions.length; j += 3) {
        positions[j] += explosion.velocities[j];
        positions[j + 1] += explosion.velocities[j + 1];
        positions[j + 2] += explosion.velocities[j + 2];

        explosion.velocities[j + 1] -= 0.001; // gravity
      }

      explosion.points.geometry.attributes.position.needsUpdate = true;
      explosion.life -= 0.02;

      if (explosion.life <= 0) {
        this.scene.remove(explosion.points);
        this.fireworkParticles.splice(i, 1);
      }
    }

    this.updateParticleConnections();
    this.frameCount++;
  }
}

export { ParticleSky };
