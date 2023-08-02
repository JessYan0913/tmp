/** css z-index */
export enum ZIndex {
  /** 蒙层，用于监听用户操作，需要置于顶层 */
  MASK = '99999',
  /** 选中的节点 */
  SELECTED_EL = '666',
  GHOST_EL = '700',
  DRAG_EL = '9',
}

/** 鼠标按键 */
export enum MouseButton {
  /** 左键 */
  LEFT = 0,
  /** z中健 */
  MIDDLE = 1,
  /** 右键 */
  RIGHT = 2,
}
