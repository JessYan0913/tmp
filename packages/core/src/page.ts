import { Id, isTmpContainer, isTmpElement, TmpContainer, TmpElement, TmpPage } from '@tmp/schema';

import { App } from './app';
import { Component } from './component';
import { logger } from './logger';

export interface PageConfig {
  data: TmpPage;
  app: App;
}

export class Page extends Component {
  public components: Map<Id, Component> = new Map();

  constructor(config: PageConfig) {
    super(config);

    this.initComponent(this.data, this);
  }

  public initComponent(data: TmpElement | TmpContainer, parent: Component): void {
    const component = new Component({
      data,
      parent,
      page: this,
      app: this.app,
    });
    this.components.set(data.id, component);

    Object.values(data).forEach((item) => {
      if (isTmpElement(item)) {
        this.initComponent(item, component);
      } else if (Array.isArray(item) && item.every(isTmpElement)) {
        item.forEach((child) => this.initComponent(child, component));
      }
    });
  }

  public getComponent(id: Id): Component | undefined {
    return this.components.get(id);
  }

  public addComponent(data: TmpElement | TmpContainer, parent?: Id | Component, slot: string = 'children'): void {
    if (typeof parent === 'string') {
      parent = this.getComponent(parent);
    }
    if (!parent) {
      parent = this;
      logger.info(`Parent component does not exist. Defaulting to assign the parent component as the current page.`);
    }
    if (!isTmpContainer(parent.data)) {
      logger.error(`The parent component is not a container component.`, true);
      return;
    }
    if (!Reflect.has(parent.data, slot)) {
      logger.error(`The parent component do not has "${slot}" property.`, true);
      return;
    }
    let slotProperty = Reflect.get(parent.data, slot);
    if (Array.isArray(slotProperty)) {
      slotProperty.push(data);
      this.initComponent(data, parent);
    } else if (isTmpElement(slotProperty)) {
      Reflect.set(parent.data, slot, data);
      this.initComponent(data, parent);
    }
  }

  public delComponent(id: Id | Component): void {
    if (id instanceof Component) {
      id = id.data.id;
    }
    const component = this.getComponent(id);
    if (!component) {
      return;
    }
    if (component === this) {
      logger.error(`"${id}" is current page so it can not delete.`);
      return;
    }
    this.components.delete(id);
  }
}

export default Page;
