import { TmpFormItemElement } from '@tmp/h5-schema';

export interface TmpInput extends TmpFormItemElement {
  /** 文本内容 */
  defaultValue?: string;
  /** 文本提示 */
  placeholder?: string;
  /** 强制提示始终可见 */
  persistentPlaceholder?: boolean;
  /** 允许清除 */
  clearable?: boolean;
  /** 前缀 */
  prefix?: string;
  /** 后缀 */
  suffix?: string;
  /** 是否为密码 */
  isPassword?: boolean;
  /** 背景颜色 */
  bgColor?: string;
  /** 未聚焦时颜色 */
  baseColor?: string;
  /** 计数器 */
  counter?: number;
  /** 强制计数器始终可见 */
  persistentCounter?: boolean;
  /** 聚焦时输入框下方显示提示文本 */
  hint?: string;
  /** 强制提示始终可见 */
  persistentHint?: boolean;
  /** 显示线性进度条 */
  loading?: string | boolean;
  /** 只读 */
  readonly?: boolean;
  /** 反转输入方向 */
  reverse?: boolean;
  /** 隐藏提示和验证信息 */
  hideDetails?: boolean | 'auto';
  /** 外部图标 */
  prependIcon?: string;
  /** 插槽后图标 */
  appendIcon?: string;
}
