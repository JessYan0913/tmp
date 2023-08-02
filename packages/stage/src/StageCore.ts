import { BaseService } from '@tmp/utils';

import StageMask from './StageMask';
import StageRender from './StageRender';
import { Runtime, StageCoreConfig } from './types';
export default class StageCore extends BaseService {
  public container?: HTMLDivElement;
  public config: StageCoreConfig;
  public renderer: any;
  public mask: any;
  constructor(config: StageCoreConfig) {
    super();

    this.config = config;
    // 负责加载 iframe
    this.renderer = new StageRender({ core: this });
    this.mask = new StageMask({ core: this });
    this.renderer.on('runtime-ready', (runtime: Runtime) => {
      this.emit('runtime-ready', runtime);
    });
    this.renderer.on('page-el-update', (el: HTMLElement) => {
      this.mask?.observe(el);
    });
  }
  /**
   * 挂载Dom节点
   * @param el 将stage挂载到该Dom节点上
   */
  public async mount(el: HTMLDivElement) {
    this.container = el;
    const { mask, renderer } = this;

    await renderer.mount(el);
    mask.mount(el);

    this.emit('mounted', this);
  }
}
