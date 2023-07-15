import { Id, isTmpContainer, isTmpElement, TmpContainer, TmpElement, TmpPage } from '@tmp/schema';

import { App } from './app';
import { Component } from './component';
import { debugOnly } from './decorator';
import { logger } from './logger';

export interface PageConfig {
  data: TmpPage;
  app: App;
}

const isPropertyMountable = (property: string): boolean =>
  !['id', 'type', 'events', 'styles', 'rules', 'disabled', 'method', 'path', 'curIndex'].includes(property);

export class Page extends Component {
  public components: Map<Id, Component> = new Map();

  constructor(config: PageConfig) {
    super(config);

    this.initComponent(this.data, this);
  }

  @(debugOnly<Page>)
  public initComponent(data: TmpElement | TmpContainer, parent?: Component, parentProperty?: string): void {
    const component = new Component({
      data,
      parent,
      parentProperty,
      page: this,
      app: this.app,
    });
    this.components.set(data.id, component);

    /** 处理data中的子组件 */
    Object.entries(data).forEach(([property, item]) => {
      if (!isPropertyMountable(property)) {
        return;
      }
      if (isTmpElement(item)) {
        this.initComponent(item, component, property);
      } else if (Array.isArray(item) && item.every(isTmpElement)) {
        item.forEach((child) => this.initComponent(child, component, property));
      }
    });
  }

  public getComponent(id: Id): Component | undefined {
    return this.components.get(id);
  }

  public addComponent(data: TmpElement | TmpContainer, parent?: Id | Component, property: string = 'children'): void {
    if (!isPropertyMountable(property)) {
      logger.error(`"${property}" prohibits mounting components.`);
      return;
    }
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
    if (!Reflect.has(parent.data, property)) {
      logger.error(`The parent component do not has "${property}" property.`, true);
      return;
    }
    /** 处理添加组件到父组件的指定属性逻辑，指定属性例如：children、title、action */
    let parentProperty = Reflect.get(parent.data, property);
    if (Array.isArray(parentProperty)) {
      parentProperty.push(data);
      this.initComponent(data, parent, property);
    } else {
      Reflect.set(parent.data, property, data);
      this.initComponent(data, parent, property);
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
    if (component.parent && component.parentProperty) {
      const parentProperty = Reflect.get(component.parent.data, component.parentProperty);
      if (Array.isArray(parentProperty)) {
        parentProperty.splice(
          parentProperty.findIndex((item) => item.id === component.data.id),
          1
        );
      } else {
        Reflect.set(component.parent.data, component.parentProperty, undefined);
      }
    }
    this.components.delete(id);
  }
}

export default Page;
