import { TmpContainer, TmpElement, TmpElementInstance, TmpEventConfig, TmpPage } from '@tmp/h5-schema';
import { EventBus } from '@tmp/utils';

import { App } from './app';
import { Page } from './page';
import { EventArgs } from './types';

export interface ComponentConfig {
  data: TmpElement | TmpContainer;
  app: App;
  page?: Page;
  parent?: Component;
}

export class Component extends EventBus<EventArgs.Component> {
  public data: TmpElement | TmpContainer | TmpPage;
  public events?: Array<TmpEventConfig>;

  public instance: TmpElementInstance | null = null;
  public app: App;
  public page?: Page;
  public parent?: Component;

  constructor(config: ComponentConfig) {
    super();
    const { data, app, page, parent } = config;
    this.data = data;
    this.events = data.events;
    this.app = app;
    this.page = page;
    this.parent = parent;

    this.on('mounted', ({ instance }) => {
      this.instance = instance;
      this.flashEventCaches();
    });

    this.on('updated', ({ instance }) => {
      this.instance = instance;
      this.flashEventCaches();
    });

    this.on('unmounted', () => {
      this.instance = null;
      this.removeAllListeners('updated');
    });
  }

  public setInstance(instance: TmpElementInstance): void {
    this.emit('updated', { beforeInstance: this.instance, instance: instance });
  }

  public flashEventCaches() {
    const eventCaches = this.app.eventCaches.get(this.data.id);
    if (!Array.isArray(eventCaches) || eventCaches.length === 0) {
      return;
    }
    for (let eventCache = eventCaches.shift(); eventCache; eventCache = eventCaches.shift()) {
      this.app.handleEvent(eventCache.fromComponent, eventCache.eventConfig, eventCache.props);
    }
  }
}

export default Component;
