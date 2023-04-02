import { BaseService } from '@tmp/utils';
import { AnimationMixer, Camera, Mesh, Object3D, PerspectiveCamera, Scene } from 'three';

import commands from './commands/index';
import { History } from './services/history';
import { Mouse } from './services/mouse';
import { Renderer } from './services/renderer';
import { Event } from './types';
import { getFilteredObjectByPoint } from './utils';

/**
 * 默认相机是透视相机
 */
const DEFAULT_CAMERA = new PerspectiveCamera(50, 1, 0.01, 1000);

export class Context extends BaseService<Event.Context> {
  public domElement: HTMLDivElement;
  public camera: Camera;
  public viewportCamera: Camera;
  public scene: Scene;
  public history: History;
  public mouse: Mouse;
  public renderer: Renderer;
  public objects: Object3D[];
  public mixer: AnimationMixer;
  public selected: Object3D | null;
  public cameraMap: Map<string, Camera>;

  constructor() {
    super();

    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 'width: 100%; height: 100%; position: relative');

    this.camera = DEFAULT_CAMERA.clone();

    this.viewportCamera = this.camera;

    this.scene = new Scene();
    this.scene.name = 'MainScene';

    this.objects = [];

    this.mixer = new AnimationMixer(this.scene);

    this.selected = null;

    this.cameraMap = new Map();

    this.history = new History(this);
    this.history.registerCommands(commands);

    this.mouse = new Mouse(this);

    this.renderer = new Renderer(this);

    this.mouse.on('mouse:click', ({ point }) => {
      const objects = getFilteredObjectByPoint(this.objects, this.camera, point);
      if (objects.length > 0) {
        const object = objects[0];
        this.selected = object;
        this.emit('object:selected', {
          selected: object,
        });
      }
    });

    this.mouse.on('mouse:dbclick', ({ point }) => {
      const objects = getFilteredObjectByPoint(this.objects, this.camera, point);
      if (objects.length > 0) {
        const object = objects[0];
        this.emit('object:focused', {
          focused: object,
        });
      }
    });

    this.addCamera(this.camera);
  }

  public setScene(scene: Scene): void {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;

    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;

    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    while (scene.children.length > 0) {
      this.objects.push(scene.children[0]);
    }

    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  public addCamera(camera: Camera): void {
    if (!camera.isCamera) {
      return;
    }
    this.cameraMap.set(camera.uuid, camera);
  }

  public removeCamera(camera: Camera | string): void {
    let cameraUUID: string;
    if (typeof camera === 'string') {
      cameraUUID = camera;
    } else {
      cameraUUID = camera.uuid;
    }
    this.cameraMap.delete(cameraUUID);
  }

  public addObject(object: Object3D, parent?: Object3D, index: number = 0): void {
    object.traverse((child) => {
      if (child instanceof Mesh) {
        // TODO: 添加几何和材质
      }
      this.addObject(child);
    });
    if (parent) {
      parent.children.splice(index, 0, object);
      object.parent = parent;
    } else {
      this.scene.add(object);
      this.objects.push(object);
    }
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }
}

export default Context;
