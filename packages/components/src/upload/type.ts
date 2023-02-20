import { TmpFormItemElement } from '@tmp/h5-schema';

export interface TmpFile extends File {
  resourceId?: string;
}

export interface TmpUpload extends TmpFormItemElement {
  /** 上传内容 */
  value?: TmpFile[];
  /** 文件列表类型 */
  listType?: 'list' | 'picture';
  /** 允许上传的最大文件个数 */
  limie?: number;
  /** 允许文件类型 */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
}
