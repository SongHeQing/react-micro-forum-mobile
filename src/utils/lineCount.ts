export function getLineCount(element: HTMLDivElement | null): number {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const lineHeight = parseFloat(style.lineHeight);
  const height = element.getBoundingClientRect().height;
  return Math.round(height / lineHeight);
} 