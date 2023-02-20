import { TmpFormItemElement } from '@tmp/h5-schema';

export interface TmpInput extends TmpFormItemElement {
  /** 文本内容 */
  value?: string;
  /** 文本提示 */
  placeholder?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 允许清除 */
  clearable?: boolean;
  /** 前缀 */
  prepend?: string;
  /** 后缀 */
  append?: string;
  /** 最大长度 */
  maxLength?: number;
  /** 最小长度 */
  minLength?: number;
  /** 是否为密码 */
  isPassword?: boolean;
}
