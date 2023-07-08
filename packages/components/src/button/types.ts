import { TmpElement } from '@tmp/schema';

export interface TmpButton extends TmpElement {
  /** 文本 */
  text?: string;
  /** 禁用文本 */
  disableText?: string;
  /** 禁用 */
  disabled?: boolean;
}
