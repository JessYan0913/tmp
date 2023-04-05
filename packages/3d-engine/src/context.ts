import { BaseService } from '@tmp/utils';

import { Renderer } from './services/renderer';
import { Event } from './types';

export class Context extends BaseService<Event.ContextArgs> {
  public domElement: HTMLDivElement;
  public renderer: Renderer;

  constructor(container: HTMLDivElement) {
    super();

    this.domElement = container;

    this.renderer = new Renderer(this);
  }
}

export default Context;
