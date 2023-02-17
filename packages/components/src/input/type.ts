import { TmpElement } from '@tmp/h5-schema';

export interface TmpInput extends TmpElement {
  /** 文本内容 */
  value?: string;
  /** 文本提示 */
  placeholder?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 允许清除 */
  allowClear?: boolean;
  /** 后置标签 */
  addonAfter?: string;
}
