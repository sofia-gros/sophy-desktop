import * as THREE from 'three';

import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const FIXED_FPS = 60;
const FIXED_DELTA = 1.0 / FIXED_FPS;

// --- VRMViewerクラス：モデル表示・描画処理 ---
export class VRMViewer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  currentVrm: VRM | null = null;
  clock: THREE.Clock = new THREE.Clock();
  mixer: THREE.AnimationMixer | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId)!;

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      20
    );
    const radian = Math.PI;
    this.camera.position.set(4.0 * Math.sin(radian), 1, 4.0 * Math.cos(radian));
    this.camera.lookAt(new THREE.Vector3(0, 1.0, 0));

    // Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 1.0, 0);
    controls.update();

    // Light
    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);

    // Helpers
    this.scene.add(new THREE.GridHelper(10, 10));
    this.scene.add(new THREE.AxesHelper(5));
  }

  async loadVRM(vrmUrl: string): Promise<void> {
    const loader = new GLTFLoader();
    loader.register(parser => new VRMLoaderPlugin(parser));

    return new Promise((resolve, reject) => {
      loader.load(
        vrmUrl,
        gltf => {
          const vrm = gltf.userData.vrm;

          VRMUtils.removeUnnecessaryVertices(gltf.scene);
          VRMUtils.combineSkeletons(gltf.scene);
          VRMUtils.combineMorphs(vrm);

          vrm.scene.traverse(obj => {
            obj.frustumCulled = false;
          });

          this.currentVrm = vrm;
          this.scene.add(vrm.scene);

          this.mixer = new THREE.AnimationMixer(vrm.scene);

          resolve();
        },
        progress => {
          console.log('Loading VRM...', (progress.loaded / progress.total) * 100, '%');
        },
        error => {
          console.error('VRM Load Error:', error);
          reject(error);
        }
      );
    });
  }

  animate(onUpdate?: (delta: number) => void) {
    const loop = () => {
      requestAnimationFrame(loop);
      const delta = this.clock.getDelta();
      this.currentVrm?.update(delta);
      if (onUpdate) onUpdate(delta);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}

// --- VRMAAnimationManagerクラス：アニメーション制御 ---
export class VRMAAnimationManager {
  viewer: VRMViewer;
  clips: Map<string, THREE.AnimationClip> = new Map();
  currentAction: THREE.AnimationAction | null = null;

  constructor(viewer: VRMViewer) {
    this.viewer = viewer;
  }

  async loadVRMA(name: string, vrmaUrl: string): Promise<void> {
    if (!this.viewer.currentVrm) throw new Error("VRM not loaded yet");

    const loader = new GLTFLoader();
    loader.register(parser => new VRMAnimationLoaderPlugin(parser));

    return new Promise((resolve, reject) => {
      loader.load(
        vrmaUrl,
        gltf => {
          console.log("Loaded GLTF data:", gltf); // デバッグ用ログ
      
          // 修正: vrmAnimations を使用
          const vrma = gltf.userData?.vrmAnimations?.[0];
          console.log("Loaded VRMA data:", vrma); // デバッグ用ログ
      
          if (!vrma || !vrma.humanoidTracks) {
            console.error("Invalid VRMA data:", vrma);
            reject(new Error("Invalid VRMA data"));
            return;
          }
      
          const clip = createVRMAnimationClip(vrma, this.viewer.currentVrm!);
          this.clips.set(name, clip);
          console.log(`Loaded animation "${name}"`);
          resolve();
        },
        undefined,
        error => {
          console.error('VRMA Load Error:', error);
          reject(error);
        }
      );
    });
  }

  play(name: string, speed: number = 1) {
    const clip = this.clips.get(name);
    if (!clip) {
      console.warn(`Animation "${name}" not found`);
      return;
    }

    if (!this.viewer.mixer) {
      console.warn("Animation mixer not initialized");
      return;
    }

    if (this.currentAction) {
      this.currentAction.stop();
    }

    this.currentAction = this.viewer.mixer.clipAction(clip);
    this.currentAction.reset();
    this.currentAction.timeScale = speed;
    console.log(`Playing animation "${name}" with speed: ${speed}`); // デバッグ用ログ
    this.currentAction.play();
  }

  update() {
    this.viewer.mixer?.update(FIXED_DELTA);
  }
}