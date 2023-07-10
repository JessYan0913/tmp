import { TmpFormItemElement } from '@tmp/schema';

export interface TmpItem {
  /** 字段 */
  title: string;
  /** 字段值 */
  value: string;
}

export type TmpItems = TmpItem[];

export interface TmpSelect extends TmpFormItemElement {
  /** 文本提示 */
  placeholder?: string;
  /** 强制提示总是可见 */
  persistentPlaceholder?: boolean;
  /** 允许清除 */
  clearable?: boolean;
  /** 前缀 */
  prefix?: string;
  /** 后缀 */
  suffix?: string;
  /** 颜色 */
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
  /** 是否多选 */
  multiple?: boolean;
  /** 备选项 */
  items: TmpItems;
}
