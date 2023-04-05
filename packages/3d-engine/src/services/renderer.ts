import { BaseService } from '@tmp/utils';
import { Camera, Scene, WebGLRenderer } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Context } from '../context';
import { RendererNotReadyError } from '../errors';
import { Event } from '../types';
import { DEFAULT_CAMERA } from '../utils';

export class Renderer extends BaseService<Event.RendererArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private scene: Scene;
  private camera: Camera;
  private renderer?: WebGLRenderer;
  private controls: OrbitControls;

  constructor(context: Context) {
    super();

    this.context = context;
    this.domElement = context.domElement;

    this.scene = new Scene();
    this.camera = DEFAULT_CAMERA.clone();

    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.addEventListener('change', () => {
      this.emit('camera:changed', {
        camera: this.camera,
      });
    });

    this.context.on('webgl:renderer:created', ({ renderer }) => {
      if (this.renderer) {
        this.renderer.dispose();
        this.domElement.removeChild(this.renderer.domElement);
      }

      this.renderer = renderer;
      this.renderer.setClearColor('#999');
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight);
      this.domElement.appendChild(this.renderer.domElement);

      this.render();
    });

    this.on('camera:changed', () => {
      this.render();
    });
  }

  public render(): void {
    if (!this.renderer) {
      throw new RendererNotReadyError();
    }
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  static createRenderer(context: Context): void {
    const webglRenderer = new WebGLRenderer();

    context.emit('webgl:renderer:created', {
      renderer: webglRenderer,
    });
  }
}

export default Renderer;
