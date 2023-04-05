import { Camera, DirectionalLight, Object3D, PerspectiveCamera, Raycaster, Vector2, Vector3 } from 'three';

export const getFilteredObjectByPoint = (
  objects: Object3D[],
  camera: Camera,
  point: Vector2,
  recursive: boolean = true
): Object3D[] => {
  const coords = new Vector2();
  coords.set(point.x * 2 - 1, -(point.y * 2) + 1);

  const rayCaster = new Raycaster();
  rayCaster.setFromCamera(coords, camera);
  return rayCaster
    .intersectObjects(objects, recursive)
    .filter(({ object }) => object.visible)
    .map(({ object }) => object);
};

export const normalizeScreenCoords = (divElement: HTMLDivElement, coords: Vector2): Vector2 => {
  const rect = divElement.getBoundingClientRect();
  return new Vector2().fromArray([(coords.x - rect.left) / rect.width, (coords.y - rect.top) / rect.height]);
};

export const updatePerspectiveCameraAspectRatio = (camera: PerspectiveCamera, domElement: HTMLDivElement): void => {
  camera.aspect = domElement.offsetWidth / domElement.offsetHeight;
  camera.updateProjectionMatrix();
};

export const directionalLight1 = new DirectionalLight(0xffffff);
directionalLight1.position.set(5, 10, 7.5);
directionalLight1.name = 'DirectionalLight';

export const directionalLight2 = new DirectionalLight(0xffffff);
directionalLight2.position.set(-5, -10, -7.5);
directionalLight2.name = 'DirectionalLight';

export const defaultCamera = (): PerspectiveCamera => {
  const DEFAULT_CAMERA = new PerspectiveCamera(50, 1, 0.01, 1000);
  DEFAULT_CAMERA.name = 'DefaultCamera';
  DEFAULT_CAMERA.position.set(0, 5, 10);
  DEFAULT_CAMERA.lookAt(new Vector3());
  return DEFAULT_CAMERA;
};
