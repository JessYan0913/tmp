import { Camera, Object3D, PerspectiveCamera, Raycaster, Vector2 } from 'three';

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
