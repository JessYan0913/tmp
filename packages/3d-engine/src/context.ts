import { BaseService } from '@tmp/utils';
import { Camera, Mesh, Object3D, Scene, Vector3 } from 'three';

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
  public mainCamera: Camera;
  public viewportCamera: Camera;
  public objectMap: Map<string, Object3D>;
  public selected: Object3D | null;

  constructor(container: HTMLDivElement) {
    super();

    this.domElement = container;

    this.mainScene = new Scene();
    this.mainScene.name = 'main:scene';

    this.sceneMap = new Map();

    this.mainCamera = defaultCamera();
    this.mainCamera.name = 'main:camera';

    this.viewportCamera = this.mainCamera;

    this.objectMap = new Map();

    this.selected = null;

    this.renderer = new Renderer(this);

    this.mouse = new Mouse(this);

    this.history = new History(this);

    this.addObject(this.mainCamera);

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

  public get objects(): Object3D[] {
    return [...this.objectMap.values()];
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

  public setViewportCamera(camera: Camera | string): void {
    let viewCamera: Camera | undefined;
    if (typeof camera === 'string') {
      const object = this.objectMap.get(camera);
      if (object instanceof Camera) {
        viewCamera = object;
      }
    } else {
      viewCamera = camera;
    }
    if (!viewCamera) {
      return;
    }
    this.viewportCamera = viewCamera;
    this.emit('viewport:camera:changed', {
      viewportCamera: this.viewportCamera,
    });
  }

  public addObject(object: Object3D, parent?: Object3D, index?: number): void {
    object.children.forEach((child) => {
      this.addObject(child);
    });

    if (parent) {
      index = index === undefined ? parent.children.length : index;
      parent.children.splice(index, 0, object);
      object.parent = parent;
    } else {
      this.mainScene.add(object);
      this.objectMap.set(object.uuid, object);
    }

    if (object instanceof Mesh && !object.userData.initSize) {
      object.geometry.computeBoundingBox();
      object.userData.initSize = object.geometry.boundingBox.getSize(new Vector3()).toArray();
    }

    this.emit('object:added', {
      object: object,
    });
  }

  public removeObject(object: Object3D | string): void {
    let curObject: Object3D | undefined;
    if (typeof object === 'string') {
      curObject = this.objectMap.get(object);
    } else {
      curObject = object;
    }
    if (!curObject || !curObject.parent) {
      return;
    }
    curObject.parent?.remove(curObject);
    this.objectMap.delete(curObject.uuid);

    this.emit('object:removed', {
      object: curObject,
    });
  }

  public execute<T extends Cmd.Options>(command: BaseCmd | string, options?: T): void {
    this.history.execute(command, options);
  }

  public destroy(): void {
    this.renderer.destroy();
    this.history.destroy();
    this.mouse.destroy();
    this.removeAllListeners();
  }
}

export default Context;
