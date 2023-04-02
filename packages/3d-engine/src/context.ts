import { BaseService } from '@tmp/utils';
import { AnimationMixer, Camera, Material, Mesh, Object3D, PerspectiveCamera, Scene } from 'three';

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
  public mixer: AnimationMixer;
  public selected: Object3D | null;
  public objectMap: Map<string, Object3D>;
  public cameraMap: Map<string, Camera>;
  public materialMap: Map<string, Material>;
  public materialRefCounter: WeakMap<Material, number>;

  constructor() {
    super();

    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 'width: 100%; height: 100%; position: relative');

    this.camera = DEFAULT_CAMERA.clone();

    this.viewportCamera = this.camera;

    this.scene = new Scene();
    this.scene.name = 'MainScene';

    this.mixer = new AnimationMixer(this.scene);

    this.selected = null;

    this.objectMap = new Map();
    this.cameraMap = new Map();
    this.materialMap = new Map();
    this.materialRefCounter = new WeakMap();

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

  public get objects(): Object3D[] {
    return [...this.objectMap.values()];
  }

  public setScene(scene: Scene): void {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;

    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;

    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    while (scene.children.length > 0) {
      this.addObject(scene.children[0]);
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

  public setViewportCamera(camera: Camera | string): void {
    let viewportCamera: Camera | undefined;
    if (typeof camera === 'string') {
      viewportCamera = this.cameraMap.get(camera);
    }
    if (!viewportCamera) {
      return;
    }
    this.viewportCamera = viewportCamera;
    this.emit('viewport:camera:changed', {
      viewportCamera: this.viewportCamera,
    });
  }

  public addObject(object: Object3D, parent?: Object3D, index: number = 0): void {
    object.traverse((child) => {
      if (child instanceof Mesh) {
        // TODO: 添加几何和材质
        child.material && this.addMaterial(child.material);
      }
      this.addObject(child);
    });
    if (parent) {
      parent.children.splice(index, 0, object);
      object.parent = parent;
    } else {
      this.scene.add(object);
      object.parent = this.scene;
      this.objectMap.set(object.uuid, object);
    }
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  public removeObject(object: Object3D): void {
    if (!object.parent) {
      return;
    }
    object.traverse((child) => {
      this.removeObject(child);
    });
    this.objectMap.delete(object.uuid);
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  public moveObjectTree(object: Object3D, parent?: Object3D, beforeObject?: Object3D): void {
    if (!parent) {
      parent = this.scene;
    }
    if (!parent.getObjectById(object.id)) {
      parent.add(object);
      object.parent = parent;
    }
    if (beforeObject) {
      const index = parent.children.indexOf(beforeObject);
      parent.children.splice(index, 0, object);
      parent.children.pop();
    }
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  public setObjectName(object: Object3D, name: string): void {
    object.name = name;
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  public addMaterial(materials: Material | Material[]): void {
    if (!Array.isArray(materials)) {
      materials = [materials];
    }
    materials.forEach((material) => {
      let counter = this.materialRefCounter.get(material);
      if (counter) {
        counter++;
        this.materialRefCounter.set(material, counter);
      } else {
        counter = 1;
        this.materialRefCounter.set(material, counter);
        this.materialMap.set(material.uuid, material);
      }
    });
  }

  public removeMaterial(materials: Material | Material[]): void {
    if (!Array.isArray(materials)) {
      materials = [materials];
    }
    materials.forEach((material) => {
      let num = this.materialRefCounter.get(material) ?? 0;
      num--;
      if (num > 0) {
        this.materialRefCounter.set(material, num);
      } else {
        this.materialRefCounter.delete(material);
        this.materialMap.delete(material.uuid);
      }
    });
  }
}

export default Context;
