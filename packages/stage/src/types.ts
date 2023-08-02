import { App } from '@tmp/core';
import { Id, TmpApplication } from '@tmp/schema';

import StageCore from './StageCore';

export type StageCoreConfig = {
  /** runtime 的HTML地址，可以是一个HTTP地址，如果和编辑器不同域，需要设置跨域，也可以是一个相对或绝对路径 */
  runtimeUrl?: string;
  render?: (renderer: StageCore) => Promise<HTMLElement> | HTMLElement;
  autoScrollIntoView?: boolean;
};

export interface Runtime {
  getApp?: () => App;
  beforeSelect?: (el: HTMLElement) => Promise<boolean> | boolean;
  getSnapElements?: (el?: HTMLElement) => HTMLElement[];
  updateRootConfig?: (config: TmpApplication) => void;
  updatePageId?: (id: Id) => void;
  select?: (id: Id) => Promise<HTMLElement> | HTMLElement;
  add?: (data: any) => void;
  update?: (data: any) => void;
  sortNode?: (data: any) => void;
  remove?: (data: any) => void;
}
export interface Tmp {
  /** 当前页面的根节点变化时调用该方法，编辑器会同步该el和stage的大小，该方法由stage注入到iframe.contentWindow中 */
  onPageElUpdate: (el: HTMLElement) => void;

  onRuntimeReady: (runtime: Runtime) => void;
}
export interface RuntimeWindow extends Window {
  tmp: Tmp;
}

export interface StageRenderConfig {
  core: StageCore;
}

export interface StageMaskConfig {
  core: StageCore;
}
