import { BaseService } from '@tmp/utils';
import { Camera, PMREMGenerator, sRGBEncoding, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Context } from '../context';
import { Event } from '../types';

export class Renderer extends BaseService<Event.RendererArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private camera: Camera;
  private renderer?: WebGLRenderer;
  private css2Renderer?: CSS2DRenderer;
  private pmremGenerator?: PMREMGenerator;

  constructor(context: Context) {
    super();

    this.context = context;
    this.domElement = context.domElement;

    this.camera = this.context.camera;

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
  }

  public render(): void {
    const startTime = performance.now();
    const endTime = performance.now();
    this.emit('scene:rendered', {
      time: endTime - startTime,
    });
  }

  public destroy(): void {
    this.removeAllListeners();
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

  static createCSS2Renderer(context: Context): void {
    const css2Renderer = new CSS2DRenderer();
    context.emit('css2:renderer:created', {
      renderer: css2Renderer,
    });
  }
}

export default Renderer;
