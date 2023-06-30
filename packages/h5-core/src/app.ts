import { unref } from 'vue';
import { Id, TmpApplication, TmpEvent, TmpInstanceMethod, TmpPage, TmpPropMapping } from '@tmp/h5-schema';
import { EventBus } from '@tmp/utils';
import dot from 'dot';

import { Component } from './component';
import { Page } from './page';

export interface AppConfig {
  data?: TmpApplication;
  curPage?: Id;
}

export interface EventCache {
  event: TmpEvent;
  fromComponent: Component;
  props: Record<string, any>;
}

export interface AppEmitArgs {
  component?: Component;
  [key: string | number | symbol]: any;
}

export class App extends EventBus {
  public data?: TmpApplication;
  public curPage?: Page;

  public pages: Map<Id, Page> = new Map();
  public eventCaches: Map<Id, EventCache[]> = new Map();

  constructor(config: AppConfig) {
    super();
    if (config.data) {
      this.setData(config.data);
    }
  }

  public setData(data: TmpApplication, curPage?: Id): void {
    this.data = data;
    this.pages.clear();
    this.eventCaches.clear();

    data.children.forEach((page: TmpPage) => {
      this.pages.set(page.id, new Page({ data: page, app: this }));
    });

    this.setPage(curPage);
  }

  public setPage(curPage?: Id): void {
    if (curPage === void 0) {
      if (this.data?.curIndex) {
        curPage = this.data.curIndex;
      } else {
        curPage = this.pages.keys().next().value;
      }
    }
    this.curPage = this.pages.get(curPage ?? '');
    this.bindEvents();
  }

  public get namespace(): Record<string, any> {
    const result: Record<string, any> = {};
    if (this.curPage) {
      for (const { data, instance } of this.curPage.components.values()) {
        const exposed = instance?.exposed ?? {};
        result[data.id] = new Proxy(exposed, {
          get(target, p, receiver) {
            return unref(Reflect.get(target, p, receiver));
          },
        });
      }
    }
    return result;
  }

  public bindEvents(): void {
    if (!this.curPage) {
      return;
    }
    this.removeAllListeners();
    for (const component of this.curPage.components.values()) {
      component.events?.forEach((event) => {
        this.on(`${component.data.id}::${event.event}`, (args: AppEmitArgs) => {
          const props = this.calComponentMethodProps(event, args);
          this.handleEvent(component, event, props);
        });
      });
    }
  }

  public handleEvent(component: Component, event: TmpEvent, props: Record<string, any>): void {
    if (event.actionType === 'component-control') {
      this.controlComponent(component, event, props);
    }
  }

  private controlComponent(fromComponent: Component, event: TmpEvent, props: Record<string, any>): void {
    if (!this.curPage) {
      throw new Error('当前页面不存在');
    }
    if (!event.target || !event.method) {
      return;
    }
    const targetComponent = this.curPage.getComponent(event.target);
    if (!targetComponent) {
      console.error(`${event.target}组件不存在，无法响应${fromComponent.data.id}的${event.event}事件`);
      return;
    }

    if (!targetComponent.instance) {
      this.pushEventCache({ event, fromComponent, props });
    } else if (
      targetComponent.instance.methods &&
      typeof targetComponent.instance.methods[event.method] === 'function'
    ) {
      const targetMethod = targetComponent.instance.methods[event.method] as TmpInstanceMethod;
      let targetMethodProps: Record<string, any> = { fromComponent, app: this };
      if (targetMethod.dependVariables) {
        targetMethodProps = targetMethod.dependVariables.reduce(
          (targetMethodProps, key) => ({ ...targetMethodProps, [key]: props[key] }),
          targetMethodProps
        );
      }
      targetMethod(targetMethodProps);
    }
  }

  private calComponentMethodProps(event: TmpEvent, eventArgs?: Record<string, any>): Record<string, any> {
    const { propMappings } = event;
    if (!propMappings) {
      return {};
    }
    const namespace = { ...this.namespace };
    const computeTargetByMapping = (mapping: TmpPropMapping, eventArgs: Record<string, any> = {}): any => {
      const mappingClassify = {
        ['event']: ({ source, defaultValue }: TmpPropMapping) => {
          if (!source) {
            return defaultValue;
          }
          return Reflect.get(eventArgs, source);
        },
        ['expression']: ({ expression }: TmpPropMapping) => {
          const keys = Object.keys(namespace);
          keys.push('event');

          const values = Object.values(namespace);
          values.push(eventArgs);

          return new Function(keys.join(','), `return ${expression}`)(...values);
        },
        ['template']: ({ template }: TmpPropMapping) => {
          return dot.template(template ?? '')({ event: eventArgs, $: namespace });
        },
      };
      if (mapping.ignore || !mapping.sourceScope || !Reflect.has(mappingClassify, mapping.sourceScope ?? '')) {
        return mapping.defaultValue;
      }
      return mappingClassify[mapping.sourceScope](mapping);
    };
    return propMappings.reduce<Record<string, any>>(
      (props, mapping) => ({ ...props, [mapping.name]: computeTargetByMapping(mapping, eventArgs) }),
      {}
    );
  }

  private pushEventCache(cache: EventCache): void {
    if (!cache.event.target) {
      return;
    }
    const caches = this.eventCaches.get(cache.event.target);
    if (caches) {
      caches.push(cache);
    } else {
      this.eventCaches.set(cache.event.target, [cache]);
    }
  }
}

export default App;
