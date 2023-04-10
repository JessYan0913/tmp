import { BaseService } from '@tmp/utils';
import { Camera, Clock, ColorRepresentation, Mesh, Object3D, Scene, sRGBEncoding, WebGLRenderer } from 'three';

import { Context } from '../context';
import { RendererNotReadyError } from '../errors';
import { DoubleGrid } from '../helpers/DoubleGrid';
import { SceneControls } from '../helpers/SceneControls';
import { Direction, ViewHelper } from '../helpers/ViewHelper';
import { Event, SceneControlsEnabled } from '../types';

export class Renderer extends BaseService<Event.RendererArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private scene: Scene;
  private camera: Camera;
  private renderer?: WebGLRenderer;
  private controls: SceneControls;
  private grid: DoubleGrid;
  private viewHelper: ViewHelper;

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
      size: 100,
      divisions: 100,
      ticks: 10,
    });

    this.viewHelper = new ViewHelper(this.camera, this.domElement, this.controls);

    const clock = new Clock(); // only used for animations

    const animate = () => {
      const delta = clock.getDelta();

      let needsUpdate = false;

      if (this.viewHelper.animating === true) {
        this.viewHelper.update(delta);
        needsUpdate = true;
      }

      if (needsUpdate === true) this.render();
    };

    this.context.on('webgl:renderer:created', ({ renderer }) => {
      if (this.renderer) {
        this.renderer.dispose();
        this.domElement.removeChild(this.renderer.domElement);
      }

      this.renderer = renderer;
      this.renderer.setAnimationLoop(animate);
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

  public triggerControlsEnable(enable: boolean | SceneControlsEnabled): void {
    if (typeof enable === 'boolean') {
      this.controls.enabled = enable;
    } else {
      Reflect.has(enable, 'enabledPan') && (this.controls.enablePan = Boolean(enable.enablePan));
      Reflect.has(enable, 'enableRotate') && (this.controls.enableRotate = Boolean(enable.enableRotate));
      Reflect.has(enable, 'enableZoom') && (this.controls.enableZoom = Boolean(enable.enableZoom));
      Reflect.has(enable, 'enableDamping') && (this.controls.enableDamping = Boolean(enable.enableDamping));
    }
    this.render();
  }

  public focus(object: Object3D): void {
    this.controls.focus(object);
    this.render();
  }

  public triggerGridVisible(visible: boolean): void {
    this.grid.visible = visible;
    this.render();
  }

  public updateGridColor(color: ColorRepresentation, subColor: ColorRepresentation): void {
    this.grid.updateColors(color, subColor);
    this.render();
  }

  public triggerViewHelperVisible(visible: boolean): void {
    this.viewHelper.setVisible(visible);
    this.render();
  }

  public setViewHelperDirection(direction: Direction): void {
    this.viewHelper.setDirection(direction);
    this.render();
  }

  public render(): void {
    if (!this.renderer) {
      throw new RendererNotReadyError();
    }

    const start = performance.now();

    this.scene.add(this.grid);

    this.renderer.setViewport(0, 0, this.domElement.offsetWidth, this.domElement.offsetHeight);
    this.renderer.render(this.scene, this.camera);

    this.scene.remove(this.grid);

    if (this.camera === this.context.viewportCamera) {
      this.renderer.autoClear = false;
      this.viewHelper.render(this.renderer);
      this.renderer.autoClear = true;
    }

    const end = performance.now();
    this.emit('scene:rendered', {
      time: end - start,
    });
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
