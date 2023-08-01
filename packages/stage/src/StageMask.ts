import { EventEmitter } from 'events';

import { createDiv, injectStyle } from '@tmp/utils';
// import KeyController from 'keycon';
import { throttle } from 'lodash-es';

import { Mode, ZIndex } from './const';
import type StageCore from './StageCore';
import type { StageMaskConfig } from './types';
import { getScrollParent } from './util';
// import { getScrollParent, isFixedParent } from './util';

const wrapperClassName = 'editor-mask-wrapper';
const throttleTime = 100;

const hideScrollbar = () => {
  injectStyle(globalThis.document, `.${wrapperClassName}::-webkit-scrollbar { width: 0 !important; display: none }`);
};
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

  hideScrollbar();

  return el;
};

/**
 * 蒙层
 * @description 用于拦截页面的点击动作，避免点击时触发组件自身动作；在编辑器中点击组件应当是选中组件；
 */
export default class StageMask extends EventEmitter {
  public content: HTMLDivElement = createContent();
  public wrapper: HTMLDivElement;
  public core: StageCore;
  public page: HTMLElement | null = null;
  public pageScrollParent: HTMLElement | null = null;
  public scrollTop = 0;
  public scrollLeft = 0;
  public width = 0;
  public height = 0;
  public wrapperHeight = 0;
  public wrapperWidth = 0;
  public maxScrollTop = 0;
  public maxScrollLeft = 0;
  public intersectionObserver: IntersectionObserver | null = null;
  public isMultiSelectStatus: Boolean = false;

  private mode: Mode = Mode.ABSOLUTE;
  private pageResizeObserver: ResizeObserver | null = null;
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
    // KeyController.global.keydown('shift', (e) => {
    //   e.inputEvent.preventDefault();
    //   this.isMultiSelectStatus = true;
    // });
    // KeyController.global.keyup('shift', (e) => {
    //   e.inputEvent.preventDefault();
    //   this.isMultiSelectStatus = false;
    // });
  }

  // public setMode(mode: Mode) {
  //   this.mode = mode;
  //   this.scroll();
  //   if (mode === Mode.FIXED) {
  //     this.content.style.width = `${this.wrapperWidth}px`;
  //     this.content.style.height = `${this.wrapperHeight}px`;
  //   } else {
  //     this.content.style.width = `${this.width}px`;
  //     this.content.style.height = `${this.height}px`;
  //   }
  // }

  /**
   * 监听页面大小变化
   * @description 同步页面与mask的大小
   * @param page 页面Dom节点
   */
  public observe(page: HTMLElement): void {
    if (!page) return;

    this.page = page;
    this.pageScrollParent = getScrollParent(page) || this.core.renderer.contentWindow?.document.documentElement || null;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    // if (typeof IntersectionObserver !== 'undefined') {
    //   this.intersectionObserver = new IntersectionObserver(
    //     (entries) => {
    //       entries.forEach((entry) => {
    //         const { target, intersectionRatio } = entry;
    //         if (intersectionRatio <= 0) {
    //           this.scrollIntoView(target);
    //         }
    //         this.intersectionObserver?.unobserve(target);
    //       });
    //     },
    //     {
    //       root: this.pageScrollParent,
    //       rootMargin: '0px',
    //       threshold: 1.0,
    //     }
    //   );
    // }

    if (typeof ResizeObserver !== 'undefined') {
      this.pageResizeObserver = new ResizeObserver((entries) => {
        // console.log('page entries===', entries);
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.setHeight(clientHeight);
        this.setWidth(clientWidth);

        // this.scroll();
        // if (this.core.dr.moveable) {
        //   this.core.dr.updateMoveable();
        // }
      });

      this.pageResizeObserver.observe(page);

      this.wrapperResizeObserver = new ResizeObserver((entries) => {
        // console.log('wrapper entries===', entries);
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.wrapperHeight = clientHeight;
        this.wrapperWidth = clientWidth;
        // this.setMaxScrollLeft();
        // this.setMaxScrollTop();
      });
      this.wrapperResizeObserver.observe(this.wrapper);
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

  // public setLayout(el: HTMLElement): void {
  //   this.setMode(isFixedParent(el) ? Mode.FIXED : Mode.ABSOLUTE);
  // }

  // public scrollIntoView(el: Element): void {
  //   el.scrollIntoView();
  //   if (!this.pageScrollParent) return;
  //   this.scrollLeft = this.pageScrollParent.scrollLeft;
  //   this.scrollTop = this.pageScrollParent.scrollTop;
  //   this.scroll();
  // }

  /**
   * 销毁实例
   */
  public destroy(): void {
    this.content?.remove();
    this.page = null;
    this.pageScrollParent = null;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();

    this.content.removeEventListener('mousedown', this.mouseDownHandler);
    this.content.removeEventListener('mouseup', this.mouseUpHandler);
    this.content.removeEventListener('wheel', this.mouseWheelHandler);
    this.content.removeEventListener('mousemove', this.mouseMoveHandler);
    this.content.removeEventListener('mouseleave', this.mouseLeaveHandler);
  }

  // private scroll() {
  //   this.fixScrollValue();

  //   let { scrollLeft, scrollTop } = this;

  //   if (this.pageScrollParent) {
  //     this.pageScrollParent.scrollTo({
  //       top: scrollTop,
  //       left: scrollLeft,
  //     });
  //   }

  //   if (this.mode === Mode.FIXED) {
  //     scrollLeft = 0;
  //     scrollTop = 0;
  //   }

  //   this.scrollTo(scrollLeft, scrollTop);
  // }

  // private scrollTo(scrollLeft: number, scrollTop: number): void {
  //   this.content.style.transform = `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`;
  // }

  /**
   * 设置蒙层高度
   * @param height 高度
   */
  private setHeight(height: number): void {
    this.height = height;
    // this.setMaxScrollTop();
    this.content.style.height = `${height}px`;
  }

  /**
   * 设置蒙层宽度
   * @param width 宽度
   */
  private setWidth(width: number): void {
    this.width = width;
    // this.setMaxScrollLeft();
    this.content.style.width = `${width}px`;
  }

  /**
   * 计算并设置最大滚动宽度
   */
  // private setMaxScrollLeft(): void {
  //   this.maxScrollLeft = Math.max(this.width - this.wrapperWidth, 0);
  // }

  /**
   * 计算并设置最大滚动高度
   */
  // private setMaxScrollTop(): void {
  //   this.maxScrollTop = Math.max(this.height - this.wrapperHeight, 0);
  // }

  /**
   * 修复滚动距离
   * 由于滚动容器变化等因素，会导致当前滚动的距离不正确
   */
  // private fixScrollValue(): void {
  //   if (this.scrollTop < 0) this.scrollTop = 0;
  //   if (this.scrollLeft < 0) this.scrollLeft = 0;
  //   if (this.maxScrollTop < this.scrollTop) this.scrollTop = this.maxScrollTop;
  //   if (this.maxScrollLeft < this.scrollLeft) this.scrollLeft = this.maxScrollLeft;
  // }

  /**
   * 点击事件处理函数
   * @param event 事件对象
   */
  private mouseDownHandler = (event: MouseEvent): void => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    console.log('mouseDownHandler===', event);

    this.emit('mousedown', event);
  };

  private mouseUpHandler = (event: MouseEvent): void => {
    console.log('mouseUpHandler===', event);
    this.emit('mouseup', event);
  };

  private mouseWheelHandler = (event: WheelEvent) => {
    console.log('mouseWheelHandler===', event);
    if (!this.page) throw new Error('page 未初始化');

    this.emit('scroll', event);
  };

  private mouseMoveHandler = throttle((event: MouseEvent): void => {
    console.log('mouseMoveHandler===', event);
  }, throttleTime);

  private mouseLeaveHandler = (event: MouseEvent) => {
    console.log('mouseLeaveHandler===', event);
    this.emit('mousedown', event);
  };
}
