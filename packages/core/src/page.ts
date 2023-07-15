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
    if (data.type === 'card') {
      if (isTmpElement(data.title)) {
        this.initComponent(data.title, component);
      }
      if (isTmpElement(data.subtitle)) {
        this.initComponent(data.subtitle, component);
      }
      if (Array.isArray(data.actions)) {
        data.actions.forEach((action) => {
          if (isTmpElement(action)) {
            this.initComponent(action, component);
          }
        });
      }
    }
    data.children?.forEach((child: TmpElement) => this.initComponent(child, component));
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
    // 判断parent是否存在slot属性，如果不存在则抛出警告并返回
    if (!Reflect.has(parent.data, slot)) {
      logger.error(`The parent component do not has "${slot}" property.`, true);
      return;
    }
    let slotProperty = Reflect.get(parent.data, slot);
    if (Array.isArray(slotProperty)) {
      slotProperty.push(data);
    } else if (isTmpElement(slotProperty)) {
      Reflect.set(parent.data, slot, data);
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
      throw new Error(`${id} 是当前页面无法删除`);
    }
    this.components.delete(id);
  }
}

export default Page;
