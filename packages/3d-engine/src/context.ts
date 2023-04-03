import { BaseService } from '@tmp/utils';
import { AnimationMixer, Camera, Material, Mesh, Object3D, PerspectiveCamera, Scene, Texture } from 'three';

import commands from './commands/index';
import { History } from './services/history';
import { Mouse } from './services/mouse';
import { Renderer } from './services/renderer';
import { BaseCmd, Cmd, Event } from './types';
import { getFilteredObjectByPoint } from './utils';

/**
 * 默认相机是透视相机
 */
const DEFAULT_CAMERA = new PerspectiveCamera(50, 1, 0.01, 1000);

export class Context extends BaseService<Event.ContextArgs> {
  public domElement: HTMLDivElement;
  public viewportCamera: Camera;
  public scene: Scene;
  public history: History;
  public mouse: Mouse;
  public renderer: Renderer;
  public mixer: AnimationMixer;
  public selected: Object3D | null;
  public focused: Object3D | null;
  public objectMap: Map<string, Object3D>;
  public cameraMap: Map<string, Camera>;
  public materialMap: Map<string, Material>;
  public materialRefCounter: WeakMap<Material, number>;
  public textureMap: Map<string, Texture>;

  constructor(container: HTMLDivElement) {
    super();

    this.domElement = container;

    this.viewportCamera = DEFAULT_CAMERA.clone();

    this.scene = new Scene();
    this.scene.name = 'MainScene';

    this.mixer = new AnimationMixer(this.scene);

    this.selected = null;
    this.focused = null;

    this.objectMap = new Map();
    this.cameraMap = new Map();
    this.materialMap = new Map();
    this.materialRefCounter = new WeakMap();
    this.textureMap = new Map();

    this.history = new History(this);
    this.history.registerCommands(commands);

    this.mouse = new Mouse(this);

    this.renderer = new Renderer(this);

    this.mouse.on('mouse:click', ({ point }) => {
      const objects = getFilteredObjectByPoint(this.objects, this.viewportCamera, point);
      if (objects.length > 0) {
        const object = objects[0];
        this.selected = object;
        this.emit('object:selected', {
          selected: object,
        });
      }
    });

    this.mouse.on('mouse:dbclick', ({ point }) => {
      const objects = getFilteredObjectByPoint(this.objects, this.viewportCamera, point);
      if (objects.length > 0) {
        const object = objects[0];
        this.emit('object:focused', {
          focused: object,
        });
      }
    });

    this.addCamera(this.viewportCamera);
  }

  public get objects(): Object3D[] {
    return [...this.objectMap.values()];
  }

  /**
   * 设置场景
   *
   * @param scene
   */
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

  /**
   * 添加相机
   *
   * @param camera
   * @returns
   */
  public addCamera(camera: Camera): void {
    if (!camera.isCamera) {
      return;
    }
    this.cameraMap.set(camera.uuid, camera);
  }

  /**
   * 删除相机
   *
   * @param camera
   */
  public removeCamera(camera: Camera | string): void {
    let cameraUUID: string;
    if (typeof camera === 'string') {
      cameraUUID = camera;
    } else {
      cameraUUID = camera.uuid;
    }
    this.cameraMap.delete(cameraUUID);
  }

  /**
   * 设置视口相机
   *
   * @param camera
   * @returns
   */
  public setViewportCamera(camera: Camera | string): void {
    let viewportCamera: Camera | undefined;
    if (typeof camera === 'string') {
      viewportCamera = this.cameraMap.get(camera);
      if (!viewportCamera) {
        return;
      }
    } else {
      if (!this.cameraMap.has(camera.uuid)) {
        this.cameraMap.set(camera.uuid, camera);
      }
      viewportCamera = camera;
    }
    this.viewportCamera = viewportCamera;
    // if (this.viewportCamera instanceof PerspectiveCamera) {

    // }
    this.emit('viewport:camera:changed', {
      viewportCamera: this.viewportCamera,
    });
  }

  /**
   * 添加实体
   *
   * @param object
   * @param parent
   * @param index
   */
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

  /**
   * 删除实体
   *
   * @param object
   * @returns
   */
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

  /**
   * 移动实体树
   *
   * @param object
   * @param parent
   * @param beforeObject
   */
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

  /**
   * 重命名实体
   *
   * @param object
   * @param name
   */
  public setObjectName(object: Object3D, name: string): void {
    object.name = name;
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  /**
   * 添加材质
   *
   * @param materials
   */
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

  /**
   * 删除材质
   *
   * @param materials
   */
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

  /**
   * 根据uui获取材质
   *
   * @param uuid
   * @returns
   */
  public getMaterialByUUID(uuid: string): Material | undefined {
    return this.materialMap.get(uuid);
  }

  /**
   * 设置材质名称
   *
   * @param material
   * @param name
   */
  public setMaterialName(material: Material, name: string): void {
    material.name = name;
    this.emit('scene:changed', {
      scene: this.scene,
    });
  }

  /**
   * 添加纹理
   *
   * @param texture
   */
  public addTexture(texture: Texture): void {
    this.textureMap.set(texture.uuid, texture);
  }

  /**
   * 设置网格材质
   *
   * @param mesh
   * @param material
   * @param slot
   */
  public setMeshMaterial(mesh: Mesh, material: Material, slot: number = 0): void {
    if (Array.isArray(mesh.material)) {
      mesh.material[slot] = material;
    } else {
      mesh.material = [material];
    }
  }

  /**
   * 获取网格材质
   *
   * @param mesh
   * @param slot
   * @returns
   */
  public getMeshMaterial(mesh: Mesh): Material | Material[] {
    return mesh.material;
  }

  /**
   * 选中实体
   *
   * @param object
   * @returns
   */
  public select(object: Object3D): void {
    if (this.selected === object) {
      return;
    }

    this.selected = object;
    this.emit('object:selected', {
      selected: this.selected,
    });
  }

  /**
   * 根据实例uuid选择
   *
   * @param uuid
   */
  public selectByUUID(uuid: string): void {
    this.scene.traverse((child) => {
      if (child.uuid === uuid) {
        this.select(child);
      }
    });
  }

  /**
   * 取消选择
   */
  public deselect() {
    this.selected = null;
  }

  /**
   * 聚焦实例
   *
   * @param object
   * @returns
   */
  public focus(object: Object3D): void {
    if (this.focused === object) {
      return;
    }
    this.focused = object;
    this.emit('object:focused', {
      focused: object,
    });
  }

  /**
   * 根据实例uuid聚焦
   *
   * @param uuid
   * @returns
   */
  public focusByUUID(uuid: string): void {
    const object = this.objectMap.get(uuid);
    if (!object) {
      return;
    }
    this.focus(object);
  }

  /**
   * 根据uuid查询实例
   *
   * @param uuid
   * @returns
   */
  public findObjectByUUID(uuid: string): Object3D | undefined {
    return this.objects.find((object) => object.uuid === uuid);
  }

  /**
   * 执行命令
   *
   * @param command
   * @param options
   */
  public execute<T extends Cmd.Options>(command: BaseCmd | string, options: T): void {
    this.history.execute(command, options);
  }

  public destroy(): void {
    this.history.destroy();

    this.viewportCamera.copy(DEFAULT_CAMERA);
    this.emit('camera:reset', {
      camera: this.viewportCamera,
    });

    this.scene.name = 'MainScene';
    this.scene.userData = {};
    this.scene.background = null;
    this.scene.environment = null;
    this.scene.fog = null;

    const objects = this.scene.children;
    while (objects.length > 0) {
      this.removeObject(objects[0]);
    }

    this.objectMap.clear();
    this.materialMap.clear();
    this.cameraMap.clear();
    this.materialRefCounter = new WeakMap();
    this.textureMap.clear();

    this.deselect();

    this.removeAllListeners();

    this.emit('engine:destroy', {
      context: this,
    });
  }
}

export default Context;
