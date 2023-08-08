export const isAbsolute = (style: CSSStyleDeclaration): boolean => style.position === 'absolute';

export const isRelative = (style: CSSStyleDeclaration): boolean => style.position === 'relative';

export const isStatic = (style: CSSStyleDeclaration): boolean => style.position === 'static';

export const isFixed = (style: CSSStyleDeclaration): boolean => style.position === 'fixed';

export const isFixedParent = (el: HTMLElement) => {
  let fixed = false;
  let dom = el;
  while (dom) {
    fixed = isFixed(getComputedStyle(dom));
    if (fixed) {
      break;
    }
    const { parentElement } = dom;
    if (!parentElement || parentElement.tagName === 'BODY') {
      break;
    }
    dom = parentElement;
  }
  return fixed;
};

export const getScrollParent = (element: HTMLElement, includeHidden = false): HTMLElement | null => {
  let style = getComputedStyle(element);
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (isFixed(style)) return null;

  for (let parent = element; parent.parentElement; ) {
    parent = parent.parentElement;

    if (parent.tagName === 'HTML') return parent;

    style = getComputedStyle(parent);

    if (isAbsolute(style) && isStatic(style)) continue;

    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return null;
};
