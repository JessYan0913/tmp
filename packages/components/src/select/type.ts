import { TmpFormItemElement } from '@tmp/h5-schema';

export interface TmpSelect extends TmpFormItemElement {
  /** 文本提示 */
  placeholder?: string;
  /** 允许清除 */
  clearable?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 最多选几个 */
  multipleLimit?: number;
}
