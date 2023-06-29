import { TmpContainer, TmpElement } from '@tmp/h5-schema';

export interface TmpCard extends TmpContainer {
  /** 标题 */
  title?: string | TmpElement;
  /** 副标题 */
  subtitle?: string | TmpElement;
  /** 内容 */
  content?: string | TmpElement;
  /** 操作区内容 */
  actions?: TmpElement[];
}
