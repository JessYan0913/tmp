import { Id, isTmpElement, TmpContainer, TmpElement, TmpPage } from '@tmp/h5-schema';

import { App } from './app';
import { Component } from './component';

export interface PageConfig {
  data: TmpPage;
  app: App;
}

export class Page extends Component {
  public data: TmpPage;
  public app: App;

  public components: Map<Id, Component> = new Map();

  constructor(config: PageConfig) {
    super(config);
    this.data = config.data;
    this.app = config.app;

    this.initComponent(config.data, this);
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
      if (isTmpElement(data.content)) {
        this.initComponent(data.content, component);
      }
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
