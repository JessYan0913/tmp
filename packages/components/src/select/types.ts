import { TmpFormItemElement } from '@tmp/h5-schema';

export interface TmpOption {
  /** 字段 */
  label: string;
  /** 字段值 */
  value: string;
}

export type TmpOptions = TmpOption[];

export interface TmpSelect extends TmpFormItemElement {
  /** 文本提示 */
  placeholder?: string;
  /** 允许清除 */
  clearable?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 最多选几个 */
  multipleLimit?: number;
  /** 备选项 */
  options: TmpOptions;
}
