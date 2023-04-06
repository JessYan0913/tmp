import { BaseService } from '@tmp/utils';
import { Camera, Scene } from 'three';

import { Renderer } from './services/renderer';
import { Event } from './types';
import { defaultCamera } from './utils';

export class Context extends BaseService<Event.ContextArgs> {
  public domElement: HTMLDivElement;
  public renderer: Renderer;
  public sceneMap: Map<string, Scene>;
  public mainScene: Scene;
  public cameraMap: Map<string, Camera>;
  public mainCamera: Camera;
  public viewportCamera: Camera;

  constructor(container: HTMLDivElement) {
    super();

    this.domElement = container;

    this.mainScene = new Scene();
    this.mainScene.name = 'main:scene';

    this.sceneMap = new Map();

    this.mainCamera = defaultCamera();
    this.mainCamera.name = 'main:camera';

    this.cameraMap = new Map();

    this.viewportCamera = this.mainCamera;

    this.renderer = new Renderer(this);

    this.addCamera(this.mainCamera);
  }

  public addCamera(camera: Camera): void {
    if (!camera.isCamera) {
      return;
    }
    this.cameraMap.set(camera.uuid, camera);
  }

  public removeCamera(camera: Camera | string): void {
    let cameraId: string;
    if (typeof camera === 'string') {
      cameraId = camera;
    } else {
      cameraId = camera.uuid;
    }
    this.cameraMap.delete(cameraId);
  }
}

export default Context;
