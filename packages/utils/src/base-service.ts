import { EventEmitter } from 'events';

export class BaseService extends EventEmitter {
  constructor() {
    super();
  }
}
