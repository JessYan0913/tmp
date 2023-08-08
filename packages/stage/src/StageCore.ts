import { Id } from '@tmp/schema';
import { BaseService, createDiv } from '@tmp/utils';

import StageMask from './StageMask';
import StageRender from './StageRender';
import { CanSelect, DomOfPoint, Point, Runtime, StageCoreConfig } from './types';

// stage 包裹曾（主要用于缩放）
const createStageZoomWrap = (zoom: number): HTMLDivElement =>
  createDiv({
    className: 'stage-zoom-wrap',
    cssText: `
    width: 100%;
    height: 100%;
    z-index: 0;
    position: relative;
    transition: transform .3s;
    box-sizing: content-box;
    box-shadow: rgba(0,0,0,.04) 0 3px 5px;
    transform: scale(${zoom});
    border: 1px solid #eee;
  `,
  });
export default class StageCore extends BaseService {
  // 外部挂载点
  public container?: HTMLDivElement;
  public stageZoomWrap: HTMLDivElement;
  public config: StageCoreConfig;
  public zoom: number;
  public renderer: any;
  public mask: any;
  private canSelect: CanSelect;
  private pageResizeObserver: ResizeObserver | null = null;
  private containerResizeObserver: ResizeObserver | null = null;
  constructor(config: StageCoreConfig) {
    super();

    this.config = config;
    this.zoom = config.zoom || 1;
    this.canSelect = config.canSelect || ((el: HTMLElement) => !!el.id);
    this.stageZoomWrap = createStageZoomWrap(this.zoom);
    // 负责加载 iframe
    this.renderer = new StageRender({ core: this });
    this.mask = new StageMask({ core: this });
    this.renderer.on('runtime-ready', (runtime: Runtime) => {
      this.emit('runtime-ready', runtime);
    });
    this.renderer.on('page-el-update', (el: HTMLElement) => {
      this.observePageResize(el);
      this.mask?.observe(el);
    });
  }
  /**
   * 单选选中元素
   * @param idOrEl 选中的id或者元素
   */
  public async select(idOrEl: Id | HTMLElement): Promise<void> {
    const el = this.renderer.getTargetElement(idOrEl);
    this.mask.observerIntersection(el);
  }
  /**
   * 挂载Dom节点
   * @param el 将stage挂载到该Dom节点上
   */
  public async mount(el: HTMLDivElement) {
    this.container = el;
    const { mask, renderer } = this;

    await renderer.mount(this.stageZoomWrap);
    mask.mount(this.stageZoomWrap);

    this.container.appendChild(this.stageZoomWrap);
    // this.initScrollViewer(el);
    this.observeContainer(this.container);
    this.emit('mounted', this);
  }
  /**
   * 销毁实例
   */
  public destroy(): void {
    const { mask, renderer, pageResizeObserver } = this;

    renderer.destroy();
    mask.destroy();
    pageResizeObserver?.disconnect();

    this.removeAllListeners();

    this.container = undefined;
  }
  // todo：缩放、外部容器宽高变化后，需要处理模拟器缩放以及与外部容器相对位置
  public setZoom(zoom: number) {
    this.zoom = zoom;
    this.stageZoomWrap.style.transform = `scale(${zoom})`;
    this.renderer.setZoom(zoom);
  }

  // 通过 mouse 事件对象 获取 runtime dom
  public getElementsInfoFromPoint(point: Point): DomOfPoint {
    return this.renderer.getElementsInfoFromPoint(point);
  }
  // 通过 id 获取 runtime dom
  public getTargetElement(idOrEl: Id | HTMLElement): Promise<void> {
    return this.renderer.getTargetElement(idOrEl);
  }

  // public async getElementFromEvent(event: MouseEvent) {
  //   const els = this.getElementsFromPoint(event);
  //   let stopped = false;
  //   const stop = () => (stopped = true);
  //   for (const el of els) {
  //     if (await this.isElCanSelect(el, event, stop)) {
  //       if (stopped) break;
  //       return el;
  //     }
  //   }
  // }

  /**
   * 监听页面大小变化
   */
  private observePageResize(page: HTMLElement): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.pageResizeObserver = new ResizeObserver((entries) => {
        this.mask.pageResize(entries);
      });

      this.pageResizeObserver.observe(page);
    }
  }
  private observeContainer(el: HTMLDivElement) {
    this.containerResizeObserver?.disconnect();
    this.containerResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      // const { clientHeight, clientWidth } = entry.target;
      console.log('dddd===', entry);
      for (const { contentRect } of entries) {
        console.log('sss===', {
          width: contentRect.width,
          height: contentRect.height,
        });
      }
    });
    this.containerResizeObserver.observe(el);
  }
  private async isElCanSelect(el: HTMLElement, event: MouseEvent, stop: () => boolean): Promise<Boolean> {
    // 执行业务方传入的判断逻辑
    const canSelectByProp = await this.canSelect(el, event, stop);
    if (!canSelectByProp) return false;
    return true;
  }
}
