import { Id } from '@tmp/schema';
import { BaseService, getHost, isSameDomain } from '@tmp/utils';

import StageCore from './StageCore';
import type { DomOfPoint, Point, Runtime, RuntimeWindow, StageRenderConfig } from './types';

export default class StageRender extends BaseService {
  /** 组件的js、css执行的环境，直接渲染为当前window，iframe渲染则为iframe.contentWindow */
  public contentWindow: RuntimeWindow | null = null;

  public runtime: Runtime | null = null;

  public iframe?: HTMLIFrameElement;

  public runtimeUrl?: string;

  public core: StageCore;

  private render?: (renderer: StageCore) => Promise<HTMLElement> | HTMLElement;

  constructor({ core }: StageRenderConfig) {
    super();

    this.core = core;
    this.runtimeUrl = core.config.runtimeUrl || '';
    this.render = core.config.render;
    this.iframe = globalThis.document.createElement('iframe');
    // 同源，直接加载
    this.iframe.src = isSameDomain(this.runtimeUrl) ? this.runtimeUrl : '';
    this.iframe.style.cssText = `
      border: 0;
      width: 100%;
      height: 100%;
    `;

    this.iframe.addEventListener('load', this.loadHandler);
  }

  public getDocument(): Document | undefined {
    return this.contentWindow?.document;
  }

  public async add(data: any): Promise<void> {
    const runtime = await this.getRuntime();
    return runtime?.add?.(data);
  }

  public async remove(data: any): Promise<void> {
    const runtime = await this.getRuntime();
    return runtime?.remove?.(data);
  }

  public async update(data: any): Promise<void> {
    const runtime = await this.getRuntime();
    // 更新画布中的组件
    runtime?.update?.(data);
  }

  public async select(els: HTMLElement[]): Promise<void> {
    const runtime = await this.getRuntime();

    for (const el of els) {
      await runtime?.select?.(el.id);
    }
  }

  public getRuntime = (): Promise<Runtime> => {
    if (this.runtime) return Promise.resolve(this.runtime);
    return new Promise((resolve) => {
      const listener = (runtime: Runtime) => {
        this.off('runtime-ready', listener);
        resolve(runtime);
      };
      this.on('runtime-ready', listener);
    });
  };

  /**
   * 通过坐标获得坐标下所有HTML元素数组
   * @param point 坐标
   * @returns 坐标下方所有HTML元素数组，会包含父元素直至html，元素层叠时返回顺序是从上到下
   */
  public getElementsInfoFromPoint(point: Point): DomOfPoint {
    let x = point.clientX;
    let y = point.clientY;

    if (this.iframe) {
      const rect = this.iframe.getClientRects()[0];
      if (rect) {
        x = x - rect.left;
        y = y - rect.top;
      }
    }
    return {
      domList: this.getDocument()?.elementsFromPoint(x / this.core.zoom, y / this.core.zoom) as HTMLElement[],
      x: x,
      y: y,
    };
  }

  public getTargetElement(idOrEl: Id | HTMLElement): HTMLElement {
    if (typeof idOrEl === 'string' || typeof idOrEl === 'number') {
      const el = this.getDocument()?.getElementById(`${idOrEl}`);
      if (!el) throw new Error(`不存在ID为${idOrEl}的元素`);
      return el;
    }
    return idOrEl;
  }

  public getMagicApi = () => ({
    onPageElUpdate: (el: HTMLElement) => this.emit('page-el-update', el),
    // 等待 runtime 入口加载触发函数
    onRuntimeReady: (runtime: Runtime) => {
      console.log('stageRender onRuntimeReady====', runtime);
      this.runtime = runtime;
      // @ts-ignore
      globalThis.runtime = runtime;
      this.emit('runtime-ready', runtime);
    },
  });

  /**
   * 挂载Dom节点
   * @param el 将页面挂载到该Dom节点上
   */
  public async mount(el: HTMLDivElement) {
    if (this.iframe) {
      if (!isSameDomain(this.runtimeUrl) && this.runtimeUrl) {
        // 不同域，使用srcdoc发起异步请求，需要目标地址支持跨域
        let html = await fetch(this.runtimeUrl).then((res) => res.text());
        // 使用base, 解决相对路径或绝对路径的问题
        const base = `${location.protocol}//${getHost(this.runtimeUrl)}`;
        html = html.replace('<head>', `<head>\n<base href="${base}">`);
        this.iframe.srcdoc = html;
      }

      el.appendChild<HTMLIFrameElement>(this.iframe);
    } else {
      throw Error('mount 失败');
    }
  }
  /**
   * 销毁实例
   */
  public destroy(): void {
    this.iframe?.removeEventListener('load', this.loadHandler);
    this.contentWindow = null;
    this.iframe?.remove();
    this.iframe = undefined;
    this.removeAllListeners();
  }

  private loadHandler = async () => {
    this.contentWindow = this.iframe?.contentWindow as RuntimeWindow;

    this.contentWindow.tmp = this.getMagicApi();

    if (this.render) {
      const el = await this.render(this.core);
      if (el) {
        this.iframe?.contentDocument?.body?.appendChild(el);
      }
    }

    this.emit('onload', {});
  };
}
