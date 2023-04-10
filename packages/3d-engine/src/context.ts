import { BaseService } from '@tmp/utils';
import { Camera, Object3D, Scene } from 'three';

import { History } from './services/history';
import { Mouse } from './services/mouse';
import { Renderer } from './services/renderer';
import { BaseCmd, Cmd, Event } from './types';
import { defaultCamera, getFilteredObjectByPoint } from './utils';

export class Context extends BaseService<Event.ContextArgs> {
  public domElement: HTMLDivElement;
  public renderer: Renderer;
  public mouse: Mouse;
  public history: History;
  public sceneMap: Map<string, Scene>;
  public mainScene: Scene;
  public cameraMap: Map<string, Camera>;
  public mainCamera: Camera;
  public viewportCamera: Camera;
  public objects: Object3D[];
  public selected: Object3D | null;

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

    this.objects = [];

    this.selected = null;

    this.renderer = new Renderer(this);

    this.mouse = new Mouse(this);

    this.history = new History(this);

    this.addCamera(this.mainCamera);

    this.mouse.on('mouse:dbclick', ({ point }) => {
      this.emit('mouse:dbclick', { point });
      const objects = getFilteredObjectByPoint(this.objects, this.mainCamera, point);
      if (objects.length > 0) {
        this.focus(objects[0]);
      }
    });

    this.mouse.on('mouse:click', ({ point }) => {
      this.emit('mouse:click', { point });
      const objects = getFilteredObjectByPoint(this.objects, this.mainCamera, point);
      if (objects.length > 0) {
        this.select(objects[0]);
      }
    });

    this.mouse.on('mouse:down', ({ point }) => {
      this.emit('mouse:down', { point });
    });

    this.mouse.on('mouse:up', ({ point }) => {
      this.emit('mouse:up', { point });
    });
  }

  public select(object: Object3D): void {
    if (this.selected === object) {
      return;
    }
    this.selected = object;
    this.emit('object:selected', {
      selected: object,
    });
  }

  public focus(object: Object3D): void {
    this.renderer.focus(object);
    this.emit('object:focused', {
      focused: object,
    });
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

  public execute<T extends Cmd.Options>(command: BaseCmd | string, options?: T): void {
    this.history.execute(command, options);
  }
}

export default Context;
