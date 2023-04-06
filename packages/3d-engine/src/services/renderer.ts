import { BaseService } from '@tmp/utils';
import { Camera, Mesh, Scene, sRGBEncoding, WebGLRenderer } from 'three';

import { Context } from '../context';
import { RendererNotReadyError } from '../errors';
import { DoubleGrid } from '../helpers/DoubleGrid';
import { SceneControls } from '../helpers/SceneControls';
import { Event } from '../types';

export class Renderer extends BaseService<Event.RendererArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private scene: Scene;
  private camera: Camera;
  private renderer?: WebGLRenderer;
  private controls: SceneControls;
  private grid: DoubleGrid;

  constructor(context: Context) {
    super();

    this.context = context;
    this.domElement = context.domElement;

    this.scene = context.mainScene;
    this.camera = context.mainCamera;

    this.controls = new SceneControls(this.camera, this.domElement);
    this.controls.addEventListener('change', () => {
      this.render();
    });

    this.grid = new DoubleGrid({
      size: 400,
      divisions: 50,
      ticks: 10,
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

      this.scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.material.needsUpdate = true;
        }
      });

      this.render();
    });
  }

  public render(): void {
    if (!this.renderer) {
      throw new RendererNotReadyError();
    }

    this.scene.add(this.grid);

    this.renderer.setViewport(0, 0, this.domElement.offsetWidth, this.domElement.offsetHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = true;
  }

  static createRenderer(context: Context): void {
    const webglRenderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    webglRenderer.outputEncoding = sRGBEncoding;

    context.emit('webgl:renderer:created', {
      renderer: webglRenderer,
    });
  }
}

export default Renderer;
