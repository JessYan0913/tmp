import { Box3, Camera, Object3D, Sphere, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class SceneControls extends OrbitControls {
  private box: Box3;
  private sphere: Sphere;
  private delta: Vector3;

  constructor(camera: Camera, domElement: HTMLDivElement) {
    super(camera, domElement);
    this.box = new Box3();
    this.sphere = new Sphere();
    this.delta = new Vector3();
  }

  public focus(targetObject: Object3D): void {
    let distance: number;

    this.box.setFromObject(targetObject);

    if (this.box.isEmpty() === false) {
      this.box.getCenter(this.target);
      distance = this.box.getBoundingSphere(this.sphere).radius;
    } else {
      this.target.setFromMatrixPosition(targetObject.matrixWorld);
      distance = 0.1;
    }

    this.delta.set(0, 0, 1);
    this.delta.applyQuaternion(this.object.quaternion);
    this.delta.multiplyScalar(distance * 4);

    this.object.position.copy(this.target).add(this.delta);

    this.dispatchEvent({
      type: 'change',
      target: this.target,
    });
  }
}

export default SceneControls;
