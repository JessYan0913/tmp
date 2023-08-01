export const injectStyle = (doc: Document, style: string) => {
  const styleEl = doc.createElement('style');
  styleEl.innerHTML = style;
  doc.head.appendChild(styleEl);
  return styleEl;
};

export const createDiv = ({ className, cssText }: { className: string; cssText: string }) => {
  const el = globalThis.document.createElement('div');
  el.className = className;
  el.style.cssText = cssText;
  return el;
};
