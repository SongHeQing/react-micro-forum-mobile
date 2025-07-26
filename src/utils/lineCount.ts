export function getLineCount(element: HTMLDivElement | null): number {
  if (!element) return 0;
  // 获取元素的行高
  const style = window.getComputedStyle(element);
  const lineHeight = parseFloat(style.lineHeight);
  // 获取元素的高度
  const height = element.getBoundingClientRect().height;
  // 计算行数
  return Math.round(height / lineHeight);
} 