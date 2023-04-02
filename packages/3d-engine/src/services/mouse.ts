import { BaseService } from '@tmp/utils';
import { Vector2 } from 'three';

import Context from '../context';
import { Event } from '../types';
import { normalizeScreenCoords } from '../utils';

export class Mouse extends BaseService<Event.MouseArgs> {
  private context: Context;
  private domElement: HTMLDivElement;
  private downPoint: Vector2 = new Vector2();
  private upPoint: Vector2 = new Vector2();
  private dbclickPoint: Vector2 = new Vector2();
  private handleMouseDownFun = this.handleMouseDown.bind(this);
  private handleMouseUpFun = this.handleMouseUp.bind(this);
  private handleDoubleClickFun = this.handleDoubleClick.bind(this);

  constructor(context: Context) {
    super();
    this.context = context;
    this.domElement = this.context.domElement;

    this.domElement.addEventListener('mousedown', this.handleMouseDownFun, false);
    this.domElement.addEventListener('dblclick', this.handleDoubleClickFun, false);
  }

  public destroy(): void {
    this.domElement.removeEventListener('mousedown', this.handleMouseDownFun, false);
    this.domElement.removeEventListener('dblclick', this.handleDoubleClickFun, false);
    this.removeAllListeners();
  }

  private handleMouseDown(event: MouseEvent): void {
    this.downPoint.copy(normalizeScreenCoords(this.context.domElement, new Vector2(event.clientX, event.clientY)));
    this.emit('mouse:down', {
      point: this.downPoint,
    });
    this.domElement.addEventListener('mouseup', this.handleMouseUpFun, false);
  }

  private handleMouseUp(event: MouseEvent): void {
    this.upPoint.copy(normalizeScreenCoords(this.context.domElement, new Vector2(event.clientX, event.clientY)));
    this.emit('mouse:up', {
      point: this.upPoint,
    });
    this.handleMouseClick();
    this.domElement.removeEventListener('mouseup', this.handleMouseUpFun, false);
  }

  private handleMouseClick(): void {
    if (this.downPoint.distanceTo(this.upPoint) === 0) {
      this.emit('mouse:click', {
        point: this.upPoint,
      });
    }
  }

  private handleDoubleClick(event: MouseEvent): void {
    this.dbclickPoint.copy(normalizeScreenCoords(this.context.domElement, new Vector2(event.clientX, event.clientY)));
    this.emit('mouse:dbclick', {
      point: this.dbclickPoint,
    });
  }
}
