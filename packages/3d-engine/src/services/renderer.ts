import { BaseService } from '@tmp/utils';
import { DirectionalLight, PerspectiveCamera, PMREMGenerator, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Context } from '../context';
import { RendererNotReadyError } from '../errors';
import { Event } from '../types';
import { updatePerspectiveCameraAspectRatio } from '../utils';

const directionalLight1 = new DirectionalLight(0xffffff);
directionalLight1.position.set(5, 10, 7.5);
directionalLight1.name = 'DirectionalLight';

const directionalLight2 = new DirectionalLight(0xffffff);
directionalLight2.position.set(-5, -10, -7.5);
directionalLight2.name = 'DirectionalLight';

export class Renderer extends BaseService<Event.RendererArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private scene: Scene;
  private renderer?: WebGLRenderer;
  private css2Renderer?: CSS2DRenderer;
  private pmremGenerator?: PMREMGenerator;

  constructor(context: Context) {
    super();

    this.context = context;
    this.domElement = context.domElement;

    this.scene = this.context.scene;

    this.context.on('webgl:renderer:created', ({ renderer }) => {
      if (this.renderer) {
        this.renderer.dispose();
        this.pmremGenerator?.dispose();
        this.domElement.removeChild(this.renderer.domElement);
      }
      this.renderer = renderer;
      this.renderer.setClearColor(0x24282e);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight);
      this.pmremGenerator = new PMREMGenerator(this.renderer);
      this.pmremGenerator.compileEquirectangularShader();

      this.domElement.appendChild(this.renderer.domElement);

      this.render();
    });

    this.context.on('css2:renderer:created', ({ renderer }) => {
      if (this.css2Renderer) {
        this.domElement.removeChild(this.css2Renderer.domElement);
      }
      this.css2Renderer = renderer;
      this.css2Renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight);
      this.css2Renderer.domElement.style.position = 'absolute';
      this.css2Renderer.domElement.style.top = '0px';
      this.css2Renderer.domElement.style.pointerEvents = 'none';

      this.domElement.appendChild(this.css2Renderer.domElement);

      this.render();
    });

    this.context.on('camera:reset', ({ camera }) => {
      if (camera instanceof PerspectiveCamera) {
        updatePerspectiveCameraAspectRatio(camera, this.domElement);
      }
    });

    this.context.on('viewport:camera:changed', () => {
      this.render();
    });

    this.context.on('engine:destroy', () => {
      if (!this.renderer) {
        return;
      }

      this.renderer.setAnimationLoop(null);
      this.renderer.clear();
      this.renderer.dispose();
      this.pmremGenerator?.dispose();
      this.renderer.forceContextLoss();
      this.renderer = undefined;
    });
  }

  /**
   * 渲染
   */
  public render(): void {
    if (!this.renderer) {
      throw new RendererNotReadyError();
    }
    const startTime = performance.now();

    this.scene.add(directionalLight1);
    this.scene.add(directionalLight2);

    this.renderer.setViewport(0, 0, this.domElement.offsetWidth, this.domElement.offsetHeight);
    this.renderer.render(this.scene, this.context.viewportCamera);

    this.scene.remove(directionalLight1);
    this.scene.remove(directionalLight2);

    const endTime = performance.now();
    this.emit('scene:rendered', {
      time: endTime - startTime,
    });
  }

  /**
   * 销毁
   */
  public destroy(): void {
    this.removeAllListeners();
  }

  /**
   * 创建渲染器
   *
   * @param context
   */
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

  /**
   * 创建CSS渲染器
   *
   * @param context
   */
  static createCSS2Renderer(context: Context): void {
    const css2Renderer = new CSS2DRenderer();
    context.emit('css2:renderer:created', {
      renderer: css2Renderer,
    });
  }
}

export default Renderer;
