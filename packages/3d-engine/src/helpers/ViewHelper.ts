import {
  BoxGeometry,
  Camera,
  CanvasTexture,
  Color,
  Euler,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  Quaternion,
  Raycaster,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { SceneControls } from './SceneControls';

const getAxisMaterial = (color: Color): MeshBasicMaterial => new MeshBasicMaterial({ color, toneMapped: false });

const getSpriteMaterial = (color: Color, text: string = ''): SpriteMaterial => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    context.beginPath();
    context.arc(32, 32, 16, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = color.getStyle();
    context.fill();

    if (text) {
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#000000';
      context.fillText(text, 32, 41);
    }
    const texture = new CanvasTexture(canvas);
    return new SpriteMaterial({
      map: texture,
      toneMapped: false,
    });
  }
  return new SpriteMaterial({
    toneMapped: false,
  });
};

export class ViewHelper extends Object3D {
  private renderCamera: Camera;
  private domELement: HTMLDivElement;
  private controls: SceneControls;
  private paneElement: HTMLDivElement;
  private point: Vector3;
  private dim: number;
  private turnRate: number;
  private camera: Camera;
  private posXAxisHelper: Sprite;
  private posYAxisHelper: Sprite;
  private posZAxisHelper: Sprite;
  private negXAxisHelper: Sprite;
  private negYAxisHelper: Sprite;
  private negZAxisHelper: Sprite;
  private dummy: Object3D;
  private interactiveObjects: Object3D[] = [];
  private radius: number = 0;
  private q1: Quaternion = new Quaternion();
  private q2: Quaternion = new Quaternion();
  private targetQuaternion: Quaternion = new Quaternion();

  public animating: boolean;
  public visible: boolean;
  public xColor: Color;
  public yColor: Color;
  public zColor: Color;

  constructor(renderCamera: Camera, domElement: HTMLDivElement, controls: SceneControls) {
    super();
    this.renderCamera = renderCamera;
    this.domELement = domElement;
    this.controls = controls;
    this.animating = false;

    this.paneElement = document.createElement('div');
    this.domELement.appendChild(this.paneElement);

    this.paneElement.addEventListener('pointerup', (event) => {
      event.stopPropagation();
      this.handleClick(event);
    });

    this.paneElement.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });

    this.visible = true;
    this.setVisible(this.visible);

    this.xColor = new Color(0xff3653);
    this.yColor = new Color(0x8adb00);
    this.zColor = new Color(0x2c8fff);

    this.dummy = new Object3D();

    this.camera = new OrthographicCamera(-2, 2, 2, -2, 0, 4);
    this.camera.position.set(0, 0, 2);

    const geometry = new BoxGeometry(0.8, 0.05, 0.05).translate(0.4, 0, 0);

    const xAxis = new Mesh(geometry, getAxisMaterial(this.xColor));
    const yAxis = new Mesh(geometry, getAxisMaterial(this.yColor));
    const zAxis = new Mesh(geometry, getAxisMaterial(this.zColor));

    yAxis.rotation.z = Math.PI / 2;
    zAxis.rotation.y = -Math.PI / 2;
    this.add(xAxis);
    this.add(yAxis);
    this.add(zAxis);

    this.posXAxisHelper = new Sprite(getSpriteMaterial(this.xColor, 'X'));
    this.posXAxisHelper.userData.type = 'posX';
    this.posYAxisHelper = new Sprite(getSpriteMaterial(this.yColor, 'Y'));
    this.posYAxisHelper.userData.type = 'posY';
    this.posZAxisHelper = new Sprite(getSpriteMaterial(this.zColor, 'Z'));
    this.posZAxisHelper.userData.type = 'posZ';

    this.negXAxisHelper = new Sprite(getSpriteMaterial(this.xColor));
    this.negXAxisHelper.userData.type = 'negX';
    this.negYAxisHelper = new Sprite(getSpriteMaterial(this.yColor));
    this.negYAxisHelper.userData.type = 'negY';
    this.negZAxisHelper = new Sprite(getSpriteMaterial(this.zColor));
    this.negZAxisHelper.userData.type = 'negZ';

    this.posXAxisHelper.position.x = 1;
    this.posYAxisHelper.position.y = 1;
    this.posZAxisHelper.position.z = 1;
    this.negXAxisHelper.position.x = -1;
    this.negXAxisHelper.scale.setScalar(0.8);
    this.negYAxisHelper.position.y = -1;
    this.negYAxisHelper.scale.setScalar(0.8);
    this.negZAxisHelper.position.z = -1;
    this.negZAxisHelper.scale.setScalar(0.8);

    this.add(this.posXAxisHelper);
    this.add(this.posYAxisHelper);
    this.add(this.posZAxisHelper);
    this.add(this.negXAxisHelper);
    this.add(this.negYAxisHelper);
    this.add(this.negZAxisHelper);

    this.interactiveObjects.push(this.posXAxisHelper);
    this.interactiveObjects.push(this.posYAxisHelper);
    this.interactiveObjects.push(this.posZAxisHelper);
    this.interactiveObjects.push(this.negXAxisHelper);
    this.interactiveObjects.push(this.negYAxisHelper);
    this.interactiveObjects.push(this.negZAxisHelper);

    this.point = new Vector3();
    this.dim = 128;
    this.turnRate = 2 * Math.PI;
  }

  public render(renderer: WebGLRenderer): void {
    this.quaternion.copy(this.renderCamera.quaternion).invert();
    this.updateMatrixWorld();
    this.point.set(0, 0, 1);
    this.point.applyQuaternion(this.renderCamera.quaternion);

    this.posXAxisHelper.material.opacity = this.point.x >= 0 ? 1 : 0.5;
    this.negXAxisHelper.material.opacity = this.point.x >= 0 ? 0.5 : 1;

    this.posYAxisHelper.material.opacity = this.point.y >= 0 ? 1 : 0.5;
    this.negYAxisHelper.material.opacity = this.point.y >= 0 ? 0.5 : 1;

    this.posZAxisHelper.material.opacity = this.point.z >= 0 ? 1 : 0.5;
    this.negZAxisHelper.material.opacity = this.point.z >= 0 ? 0.5 : 1;

    const x = this.domELement.offsetWidth - this.dim;
    renderer.clearDepth();
    renderer.setViewport(x, 0, this.dim, this.dim);
    renderer.render(this, this.camera);
  }

  public handleClick(event: PointerEvent) {
    if (this.animating === true) {
      return false;
    }

    const rect = this.paneElement.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;
    const mousePoint = new Vector2();
    mousePoint.x = ((event.clientX - offsetX) / rect.width) * 2 - 1;
    mousePoint.y = -((event.clientY - offsetY) / rect.height) * 2 + 1;

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mousePoint, this.camera);

    const intersects = raycaster.intersectObjects(this.interactiveObjects);
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const object = intersection.object;

      this.prepareAnimationData(object, this.controls.target);

      this.animating = true;

      return true;
    } else {
      return false;
    }
  }

  public update(delta: number): void {
    const step = delta * this.turnRate;
    const focusPoint = this.controls.target;

    this.q1.rotateTowards(this.q2, step);
    this.renderCamera.position.set(0, 0, 1).applyQuaternion(this.q1).multiplyScalar(this.radius).add(focusPoint);

    this.renderCamera.quaternion.rotateTowards(this.targetQuaternion, step);

    if (this.q1.angleTo(this.q2) === 0) {
      this.animating = false;
    }
  }

  private prepareAnimationData(object: Object3D, focusPoint: Vector3) {
    const targetPosition = new Vector3();
    this.targetQuaternion = new Quaternion();
    switch (object.userData.type) {
      case 'posX':
        targetPosition.set(1, 0, 0);
        this.targetQuaternion.setFromEuler(new Euler(0, Math.PI * 0.5, 0));
        break;

      case 'posY':
        targetPosition.set(0, 1, 0);
        this.targetQuaternion.setFromEuler(new Euler(-Math.PI * 0.5, 0, 0));
        break;

      case 'posZ':
        targetPosition.set(0, 0, 1);
        this.targetQuaternion.setFromEuler(new Euler());
        break;

      case 'negX':
        targetPosition.set(-1, 0, 0);
        this.targetQuaternion.setFromEuler(new Euler(0, -Math.PI * 0.5, 0));
        break;

      case 'negY':
        targetPosition.set(0, -1, 0);
        this.targetQuaternion.setFromEuler(new Euler(Math.PI * 0.5, 0, 0));
        break;

      case 'negZ':
        targetPosition.set(0, 0, -1);
        this.targetQuaternion.setFromEuler(new Euler(0, Math.PI, 0));
        break;

      default:
        console.error('ViewHelper: Invalid axis.');
    }

    this.radius = this.renderCamera.position.distanceTo(focusPoint);
    targetPosition.multiplyScalar(this.radius).add(focusPoint);

    this.dummy.position.copy(focusPoint);

    this.dummy.lookAt(this.renderCamera.position);
    this.q1.copy(this.dummy.quaternion);

    this.dummy.lookAt(targetPosition);
    this.q2.copy(this.dummy.quaternion);
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
    if (visible) {
      this.paneElement.setAttribute('style', 'position:absolute; right: 0px; bottom: 0px; height: 128px; width: 128px');
    } else {
      this.paneElement.setAttribute('style', 'display: none');
    }
  }
}

export default ViewHelper;
