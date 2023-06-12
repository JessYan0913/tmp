import { Id, TmpApplication, TmpEvent, TmpMappingSpace, TmpPage, TmpPropMapping } from '@tmp/h5-schema';
import { EventBus } from '@tmp/utils';
import dot from 'dot';

import { Component } from './component';
import { Page } from './page';

const computeTargetByMapping = (
  fromComponent: Component,
  mapping: TmpPropMapping,
  eventArgs: Record<string, any> = {}
): any => {
  const mappingClassify = {
    [TmpMappingSpace.EVENT]: ({ source, defaultValue }: TmpPropMapping) => {
      if (!source) {
        return defaultValue;
      }
      return Reflect.get(eventArgs, source);
    },
    [TmpMappingSpace.EXPRESSION]: ({ expression }: TmpPropMapping) => {
      return new Function('event,fcpt', `return ${expression}`)(eventArgs, fromComponent);
    },
    [TmpMappingSpace.TEMPLATE]: ({ template }: TmpPropMapping) => {
      return dot.template(template ?? '')({ event: eventArgs, fcpt: fromComponent });
    },
  };
  if (mapping.ignore || !mapping.sourceScope || !Reflect.has(mappingClassify, mapping.sourceScope ?? '')) {
    return mapping.defaultValue;
  }
  return mappingClassify[mapping.sourceScope](mapping);
};

export interface AppConfig {
  data: TmpApplication;
  curPage?: Id;
}

export interface EventCache {
  event: TmpEvent;
  formComponent: Component;
  props: Record<string, any>;
}

export class App extends EventBus {
  public data: TmpApplication;
  public curPage?: Page;

  public pages: Map<Id, Page> = new Map();
  public eventCaches: Map<Id, EventCache[]> = new Map();

  constructor(config: AppConfig) {
    super();
    this.data = config.data;
  }

  public setData(data: TmpApplication, curPage: Id): void {
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
      if (this.data.curIndex) {
        curPage = this.data.curIndex;
      } else {
        curPage = this.pages.keys().next().value;
      }
    }
    this.curPage = this.pages.get(curPage ?? '');
  }

  public bindEvents(): void {
    if (!this.curPage) {
      return;
    }
    this.removeAllListeners();
    for (const component of this.curPage.components.values()) {
      component.events?.forEach((event) => {
        this.on(
          `${component.data.name}::${component.data.id}`,
          (fromComponent: Component, args?: Record<string, any>) => {
            const props = this.calComponentMethodProps(fromComponent, event, args);
            console.log('====>', props);
          }
        );
      });
    }
  }

  private calComponentMethodProps(
    fromComponent: Component,
    event: TmpEvent,
    eventArgs?: Record<string, any>
  ): Record<string, any> {
    const { propMappings } = event;
    if (!propMappings) {
      return {};
    }
    return propMappings.reduce<Record<string, any>>(
      (props, mapping) => ({ ...props, [mapping.name]: computeTargetByMapping(fromComponent, mapping, eventArgs) }),
      {}
    );
  }
}

export default App;
