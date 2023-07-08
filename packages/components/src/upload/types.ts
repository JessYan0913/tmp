import { TmpFormItemElement } from '@tmp/schema';
import { Method } from '@tmp/utils';

export interface TmpFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  webkitRelativePath?: string;
  resourceId?: string;
  loading?: boolean;
}

export interface TmpPicture extends TmpFile {
  previewSrc: string;
}

export interface TmpUpload extends TmpFormItemElement {
  /** 上传内容 */
  value?: TmpFile[];
  /** 文件列表类型 */
  listType?: 'list' | 'picture';
  /** 允许上传的最大文件个数 */
  limit?: number;
  /** 允许文件类型 */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 上传地址 */
  action?: string;
  /** 上传方法 */
  method?: Method;
  /** 上传方法的请求头 */
  headers?: Record<string, any>;
  /** 参数 */
  parameters?: Record<string, any>;
  /** 预览地址 */
  previewUrl?: string;
}
