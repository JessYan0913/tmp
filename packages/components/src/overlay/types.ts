import { TmpContainer } from '@tmp/schema';

export interface TmpOverlay extends TmpContainer {
  /** 打开延迟 毫秒 */
  openDelay?: number;
  /** 关闭延迟 毫秒 */
  closeDelay?: number;
  /** 滚动策略 */
  scrollStrategy?: 'block' | 'close' | 'reposition' | 'none';
  /** 点击蒙层消失 */
  persistent?: boolean;
  /** 蒙层颜色 */
  scrim?: string;
}
