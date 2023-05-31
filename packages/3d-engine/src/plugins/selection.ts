import { Box3, BoxHelper, Camera, Euler, Object3D, Scene, SkeletonHelper, Vector3 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { Context } from '../context';
import { PluginInterface } from '../types';

export interface SelectionPluginOptions {
  context: Context;
}

export class SelectionPlugin implements PluginInterface {
  private context: Context;
  private objectPositionOnDown?: Vector3;
  private objectRotationOnDown?: Euler;
  private objectScaleOnDown?: Vector3;

  public box: Box3;
  public scene: Scene;
  public camera: Camera;
  public domElement: HTMLElement;
  public transformControls: TransformControls;
  public selectionBox?: BoxHelper;
  public helpers: Map<string, Object3D>;

  constructor(options: SelectionPluginOptions) {
    this.context = options.context;
    this.camera = options.context.mainCamera;
    this.domElement = options.context.domElement;

    this.box = new Box3();
    this.scene = new Scene();
    this.transformControls = new TransformControls(this.camera, this.domElement);
    this.helpers = new Map();

    this.scene.add(this.transformControls);
  }

  public get name(): string {
    return 'SelectPlugin';
  }

  public init(): void {
    this.transformControls.addEventListener('change', this.onTransformControlsChange);
    this.transformControls.addEventListener('mouseDown', this.onTransformControlsMouseDown);
    this.transformControls.addEventListener('mouseUp', this.onTransformControlsMouseUp);
  }

  public enable(): void {
    this.render();
  }

  public disable(): void {
    this.selectionBox?.visible;
    this.transformControls.detach();
  }

  public destroy(): void {
    this.transformControls.removeEventListener('change', this.onTransformControlsChange);
    this.transformControls.removeEventListener('mouseDown', this.onTransformControlsMouseDown);
    this.transformControls.removeEventListener('mouseUp', this.onTransformControlsMouseUp);
  }

  private onTransformControlsChange() {
    // 实体控制器作用的实体
    const object = this.transformControls.object;

    if (object) {
      // 实体存在给实体套上最小盒子
      this.selectionBox?.setFromObject(object);

      // 获取实体对应的辅助对象
      const helper = this.helpers.get(object.uuid);

      if (helper instanceof SkeletonHelper) {
        // 如果辅助对象是骨架辅助，则更新辅助对象
        helper.update();
      }

      // 触发模型更新中事件
      this.context.emit('object:changing', { object });
    }
    this.render();
  }

  private onTransformControlsMouseDown() {
    // 实体控制器作用的实体
    const object = this.transformControls.object;
    if (!object) {
      return;
    }

    // 保存按下时的实体位置
    this.objectPositionOnDown = object.position.clone();
    // 保存按下时的实体旋转角
    this.objectRotationOnDown = object.rotation.clone();
    // 保存按下时的实体缩放比
    this.objectScaleOnDown = object.scale.clone();

    // 禁用场景控制器
    this.context.renderer.triggerControlsEnable(false);
  }

  private onTransformControlsMouseUp() {
    // 实体控制器作用的实体
    const object = this.transformControls.object;
    if (!object) {
      return;
    }

    // 根据当前实体控制器的模式，选择处理的方式
    const transformControlMode = {
      translate: () => {
        if (this.objectPositionOnDown && !this.objectPositionOnDown.equals(object.position)) {
          // 如果实体位置变化，则执行位置设置命令
          // this.context.execute(new SetPositionCmd(this.context, object, object.position, objectPositionOnDown));
        }
      },
      rotate: () => {
        if (this.objectRotationOnDown && !this.objectRotationOnDown.equals(object.rotation)) {
          // 如果实体旋转角变化，则执行旋转角设置命令
          // context.execute(new SetRotationCmd(context, object, object.rotation, objectRotationOnDown));
        }
      },
      scale: () => {
        if (this.objectScaleOnDown && !this.objectScaleOnDown.equals(object.scale)) {
          // 如果实体缩放比变化，则执行缩放比设置命令
          // context.execute(new SetScaleCmd(context, object, object.scale, objectScaleOnDown));
        }
      },
    };

    transformControlMode[this.transformControls.getMode()]();
    this.context.renderer.triggerControlsEnable(true);
  }

  private render(): void {
    this.context.render();
  }
}

export default SelectionPlugin;
