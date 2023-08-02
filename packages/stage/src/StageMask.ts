import { BaseService, createDiv } from '@tmp/utils';

import { ZIndex } from './const';
import type StageCore from './StageCore';
import type { StageMaskConfig } from './types';

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
  public content: HTMLDivElement = createContent();
  public wrapper: HTMLDivElement;
  public core: StageCore;
  public page: HTMLElement | null = null;
  public width = 0;
  public height = 0;
  public wrapperHeight = 0;
  public wrapperWidth = 0;

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
  }

  /**
   * 监听页面大小变化
   * @description 同步页面与mask的大小
   * @param page 页面Dom节点
   */
  public observe(page: HTMLElement): void {
    if (!page) return;

    this.page = page;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();

    if (typeof ResizeObserver !== 'undefined') {
      this.pageResizeObserver = new ResizeObserver((entries) => {
        // console.log('page entries===', entries);
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.setHeight(clientHeight);
        this.setWidth(clientWidth);
      });
      this.pageResizeObserver.observe(page);

      this.wrapperResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.wrapperHeight = clientHeight;
        this.wrapperWidth = clientWidth;
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

  /**
   * 销毁实例
   */
  public destroy(): void {
    this.content?.remove();
    this.page = null;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();

    this.content.removeEventListener('mousedown', this.mouseDownHandler);
    this.content.removeEventListener('mouseup', this.mouseUpHandler);
    this.content.removeEventListener('wheel', this.mouseWheelHandler);
    this.content.removeEventListener('mousemove', this.mouseMoveHandler);
    this.content.removeEventListener('mouseleave', this.mouseLeaveHandler);
  }

  private setHeight(height: number): void {
    this.height = height;
    this.content.style.height = `${height}px`;
  }

  private setWidth(width: number): void {
    this.width = width;
    this.content.style.width = `${width}px`;
  }

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

  private mouseMoveHandler = (event: MouseEvent): void => {
    console.log('mouseMoveHandler===', event);
  };

  private mouseLeaveHandler = (event: MouseEvent) => {
    console.log('mouseLeaveHandler===', event);
    this.emit('mousedown', event);
  };
}
