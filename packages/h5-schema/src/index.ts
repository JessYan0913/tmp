export type TmpActionType = 'route-setting' | 'component-control';

/** ElementId */
export type Id = string;

export interface TmpRequestConfig {
  /** 请求ID */
  id: string;
  /** 请求名称 */
  name: string;
  /** 请求路径 */
  path: string;
  /** 请求方法 */
  method: string;
  /** 请求头 */
  headers: Record<string, any>;
  /** 请求参数 */
  data: Record<string, any>;
}

export const enum SourceScope {
  /**
   * 值来自事件参数
   *
   * name
   */
  EVENT = 'event',
  /**
   * 值来自表达式
   *
   * new Date()
   */
  EXPRESSION = 'expression',
  /**
   * 值来自模版
   *
   * ${event.name} 参数
   */
  TEMPLATE = 'template',
  /**
   * 值来自常量
   */
  CONST = 'const',
}

export const enum TmpMappingSpace {
  EVENT = 'event',
  EXPRESSION = 'expression',
  TEMPLATE = 'template',
}

export interface TmpPropMapping {
  /** 参数类型 */
  name: string;
  /** 是否忽略该参数 */
  ignore: boolean;
  /** 默认值 */
  defaultValue?: string;
  /** 来源 */
  source?: string;
  /** 取值空间 */
  sourceScope?: TmpMappingSpace;
  /** 表达式 */
  expression?: string;
  /** 模版 */
  template?: string;
}

export interface TmpEvent {
  /** 事件 */
  event: string;
  /** 动作类型 */
  actionType: TmpActionType;
  /** 作用目标元素 */
  target?: string;
  /** 触发方法 */
  method?: string;
  /** 路由页面 */
  page?: string;
  /** 参数映射 */
  propMappings?: TmpPropMapping[];
}

export interface TmpElement {
  /** 元素ID，应该是一个唯一值 */
  id: Id;
  /** 元素类型 */
  type: string;
  /** 元素名称 */
  name?: string;
  /** 观察目标元素 */
  events?: TmpEvent[];
  /** 样式 */
  style?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TmpContainer extends TmpElement {
  /** 布局 */
  layout: string;
  /** 自元素 */
  children: TmpElement[];
}

export interface TmpFormItemElement extends TmpElement {
  /** 表单label */
  label: string;
  /** 表单校验规则 */
  rules: any[];
  /** 禁用 */
  disabled?: boolean;
}

export interface TmpFormElement extends TmpContainer {
  type: 'form';
  /** 表单提交地址 */
  action?: string;
  /** 提交方法 */
  method?: string;
  /** 表单的元素ID */
  children: TmpFormItemElement[];
}

export type TmpFormModel = Record<string, any>;

export interface TmpPage extends TmpContainer {
  type: 'page';
}

export interface TmpApplication extends TmpContainer {
  type: 'app';
  curIndex?: Id;
  children: TmpPage[];
}

export interface TmpInstanceMethod {
  (...args: any[]): any;
  dependVariables?: string[];
}

export interface TmpElementInstance {
  el?: HTMLElement;
  methods?: Record<string, TmpInstanceMethod>;
  exports?: Record<string, any>;
}
