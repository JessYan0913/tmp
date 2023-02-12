export type TmpActionType = 'route-setting' | 'element-linkage';

export interface TmpPropMapping {
  /** 参数类型 */
  name: string;
  /** 默认值 */
  defaultValue?: string;
}

export interface TmpEvent {
  /** 事件 */
  event: string;
  /** 作用目标元素 */
  targetId: string;
  /** 动作类型 */
  actionType: TmpActionType;
  /** 触发方法 */
  method?: string;
  /** 路由页面 */
  page?: string;
  /** 参数映射 */
  propMapping?: Record<string, any>;
}

export interface TmpElement {
  /** 元素ID，应该是一个唯一值 */
  id: string;
  /** 元素类型 */
  type: string;
  /** 元素名称 */
  name: string;
  /** 观察目标元素 */
  events?: TmpEvent[];
}

export interface TmpFormItemElement extends TmpElement {
  /** 表单label */
  label: string;
  /** 表单校验规则 */
  rules: any[];
}

export interface TmpFormElement extends TmpElement {
  /** 表单提交地址 */
  action: string;
  /** 提交方法 */
  method: string;
  /** 表单的元素ID */
  elementIds: string[];
}
