import { EventArgs, EventBus } from './event';

export class BaseService<T extends EventArgs = EventArgs> extends EventBus<T> {
  constructor() {
    super();
  }
}
