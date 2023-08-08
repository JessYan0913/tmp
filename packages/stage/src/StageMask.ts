import { BaseService, createDiv } from '@tmp/utils';

import { Mode, ZIndex } from './const';
import type StageCore from './StageCore';
import type { StageMaskConfig } from './types';
import { getScrollParent } from './util';

const wrapperClassName = 'editor-mask-wrapper';

// runtime 区域面罩
const createContent = (): HTMLDivElement =>
  createDiv({
    className: 'editor-mask',
    cssText: `
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
  `,
  });
// 编辑器整体面罩（与 iframe 一级）
const createWrapper = (): HTMLDivElement => {
  const el = createDiv({
    className: wrapperClassName,
    cssText: `
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      z-index: ${ZIndex.MASK};
    `,
  });

  return el;
};

/**
 * 蒙层
 * @description 用于拦截页面的点击动作，避免点击时触发组件自身动作；在编辑器中点击组件应当是选中组件；
 */
export default class StageMask extends BaseService {
  // 蒙层
  public content: HTMLDivElement = createContent();
  // 蒙层外部
  public wrapper: HTMLDivElement;
  public core: StageCore;
  public page: HTMLElement | null = null;
  public scrollTop = 0;
  public scrollLeft = 0;
  // 蒙层宽高
  public width = 0;
  public height = 0;
  public wrapperHeight = 0;
  public wrapperWidth = 0;
  public maxScrollTop = 0;
  public maxScrollLeft = 0;

  private mode: Mode = Mode.ABSOLUTE;
  private pageScrollParent: HTMLElement | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private wrapperResizeObserver: ResizeObserver | null = null;

  constructor(config: StageMaskConfig) {
    const wrapper = createWrapper();
    super();

    this.wrapper = wrapper;
    this.core = config.core;

    this.content.addEventListener('mousedown', this.mouseDownHandler);
    this.content.addEventListener('mouseup', this.mouseUpHandler);
    this.wrapper.appendChild(this.content);
    this.content.addEventListener('wheel', this.mouseWheelHandler);
    this.content.addEventListener('mousemove', this.mouseMoveHandler);
    this.content.addEventListener('mouseleave', this.mouseLeaveHandler);
  }
  /**
   * 初始化视窗和蒙层监听，监听元素是否在视窗区域、监听mask蒙层所在的wrapper大小变化
   * @description 初始化视窗和蒙层监听
   * @param page 页面Dom节点
   */
  public observe(page: HTMLElement): void {
    if (!page) return;

    this.page = page;
    this.initObserverIntersection();
    this.initObserverWrapper();
  }
  public scrollIntoView(el: Element): void {
    el.scrollIntoView();
    if (!this.pageScrollParent) return;
    this.scrollLeft = this.pageScrollParent.scrollLeft;
    this.scrollTop = this.pageScrollParent.scrollTop;
    this.scroll();
  }
  /**
   * 处理页面大小变更，同步页面和mask大小
   * @param entries ResizeObserverEntry，获取页面最新大小
   */
  public pageResize(entries: ResizeObserverEntry[]): void {
    const [entry] = entries;
    const { clientHeight, clientWidth } = entry.target;
    this.setHeight(clientHeight);
    this.setWidth(clientWidth);

    this.scroll();
  }
  /**
   * 监听一个组件是否在画布可视区域内
   * @param el 被选中的组件，可能是左侧目录树中选中的
   */
  public observerIntersection(el: HTMLElement): void {
    this.intersectionObserver?.observe(el);
  }
  /**
   * 监听mask的容器大小变化
   */
  private initObserverWrapper(): void {
    this.wrapperResizeObserver?.disconnect();
    if (typeof ResizeObserver !== 'undefined') {
      this.wrapperResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.wrapperHeight = clientHeight;
        this.wrapperWidth = clientWidth;
        this.setMaxScrollLeft();
        this.setMaxScrollTop();
      });
      this.wrapperResizeObserver.observe(this.wrapper);
    }
  }
  /**
   * 监听选中元素是否在画布可视区域内，如果目标元素不在可视区域内，通过滚动使该元素出现在可视区域
   */
  private initObserverIntersection(): void {
    // runtime page 的外层 dom，用于滚动
    this.pageScrollParent = getScrollParent(this.page as HTMLElement) || null;
    this.intersectionObserver?.disconnect();

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const { target, intersectionRatio } = entry;
            if (intersectionRatio <= 0) {
              this.scrollIntoView(target);
            }
            this.intersectionObserver?.unobserve(target);
          });
        },
        {
          root: this.pageScrollParent,
          rootMargin: '0px',
          threshold: 1.0,
        }
      );
    }
  }

  /**
   * 挂载Dom节点
   * @param el 将蒙层挂载到该Dom节点上
   */
  public mount(el: HTMLDivElement): void {
    if (!this.content) throw new Error('content 不存在');

    el.appendChild(this.wrapper);
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    this.content?.remove();
    this.page = null;
    this.pageScrollParent = null;
    this.wrapperResizeObserver?.disconnect();

    this.content.removeEventListener('mousedown', this.mouseDownHandler);
    this.content.removeEventListener('mouseup', this.mouseUpHandler);
    this.content.removeEventListener('wheel', this.mouseWheelHandler);
    this.content.removeEventListener('mousemove', this.mouseMoveHandler);
    this.content.removeEventListener('mouseleave', this.mouseLeaveHandler);
  }
  /**
   * 计算并设置最大滚动宽度
   */
  private setMaxScrollLeft(): void {
    this.maxScrollLeft = Math.max(this.width - this.wrapperWidth, 0);
  }

  /**
   * 计算并设置最大滚动高度
   */
  private setMaxScrollTop(): void {
    this.maxScrollTop = Math.max(this.height - this.wrapperHeight, 0);
  }
  private setHeight(height: number): void {
    this.height = height;
    this.content.style.height = `${height}px`;
  }

  private setWidth(width: number): void {
    this.width = width;
    this.content.style.width = `${width}px`;
  }
  /**
   * 修复滚动距离
   * 由于滚动容器变化等因素，会导致当前滚动的距离不正确
   */
  private fixScrollValue(): void {
    if (this.scrollTop < 0) this.scrollTop = 0;
    if (this.scrollLeft < 0) this.scrollLeft = 0;
    if (this.maxScrollTop < this.scrollTop) this.scrollTop = this.maxScrollTop;
    if (this.maxScrollLeft < this.scrollLeft) this.scrollLeft = this.maxScrollLeft;
  }
  private scroll() {
    this.fixScrollValue();

    let { scrollLeft, scrollTop } = this;

    if (this.pageScrollParent) {
      this.pageScrollParent.scrollTo({
        top: scrollTop,
        left: scrollLeft,
      });
    }

    if (this.mode === Mode.FIXED) {
      scrollLeft = 0;
      scrollTop = 0;
    }

    this.scrollTo(scrollLeft, scrollTop);
  }
  private scrollTo(scrollLeft: number, scrollTop: number): void {
    this.content.style.transform = `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`;

    // const event = new CustomEvent<{
    //   scrollLeft: number;
    //   scrollTop: number;
    // }>('customScroll', {
    //   detail: {
    //     scrollLeft: this.scrollLeft,
    //     scrollTop: this.scrollTop,
    //   },
    // });
    // this.content.dispatchEvent(event);
  }
  private getEvent(event: MouseEvent) {
    const res = this.core.getElementsInfoFromPoint(event);
    return {
      runtimeDom: res.domList[0],
      stageCore: this.core,
      x: res.x,
      y: res.y,
    };
  }
  // mask eventObj  ->  runtime dom  -> {dom core {iframe x\y}}
  private mouseDownHandler = (event: MouseEvent): void => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    // console.log('mouseDownHandler===', event);
    // console.log('mouseDownHandler=getEvent==', this.getEvent(event));

    this.emit('mousedown', this.getEvent(event));
  };

  private mouseUpHandler = (event: MouseEvent): void => {
    // console.log('mouseUpHandler===', event);
    // console.log('mouseUpHandler=getEvent==', this.getEvent(event));
    this.emit('mouseup', this.getEvent(event));
  };

  private mouseWheelHandler = (event: WheelEvent) => {
    // console.log('mouseWheelHandler===', event);
    // console.log('mouseWheelHandler=getEvent==', this.getEvent(event));
    if (!this.page) throw new Error('page 未初始化');

    const { deltaY, deltaX } = event;

    if (this.page.clientHeight < this.wrapperHeight && deltaY) return;
    if (this.page.clientWidth < this.wrapperWidth && deltaX) return;

    if (this.maxScrollTop > 0) {
      this.scrollTop = this.scrollTop + deltaY;
    }

    if (this.maxScrollLeft > 0) {
      this.scrollLeft = this.scrollLeft + deltaX;
    }

    this.scroll();

    this.emit('scroll', this.getEvent(event));
  };

  private mouseMoveHandler = (event: MouseEvent): void => {
    // console.log('mouseMoveHandler===', event);
    // console.log('mouseMoveHandler=getEvent==', this.getEvent(event));
    this.emit('mousemove', this.getEvent(event));
  };

  private mouseLeaveHandler = (event: MouseEvent) => {
    // console.log('mouseLeaveHandler===', event);
    // console.log('mouseLeaveHandler=getEvent==', this.getEvent(event));
    this.emit('mousedown', this.getEvent(event));
  };
}
