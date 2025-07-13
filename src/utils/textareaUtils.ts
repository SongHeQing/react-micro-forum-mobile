/**
 * @description 自动调整textarea高度
 * @param textarea textarea元素
 * @param defaultRows 默认行数
 */
export const autoResizeTextarea = (textarea: HTMLTextAreaElement, defaultRows: number = 1): void => {
  // 计算默认行数对应的高度
  // getComputedStyle() 函数作用：获取元素的计算样式（最终应用的CSS样式）
  // 为什么需要：CSS中的 line-height 可能设置为 normal、百分比或数字
  // 返回值：返回一个 CSSStyleDeclaration 对象，包含所有计算后的样式
  // getComputedStyle(textarea).lineHeight 获取计算后的行高
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 73; // 默认行高
  const defaultHeight = lineHeight * defaultRows;

  // scrollHeight 属性
  // 作用：获取元素内容的完整高度，包括由于溢出而不可见的内容
  // 与 clientHeight 的区别：
  // clientHeight：可视区域高度（不包括滚动条）
  // scrollHeight：内容实际高度（包括不可见部分）
  // 应用场景：动态调整容器高度时计算实际内容高度
  textarea.style.height = 'auto';
  // scrollHeight 属性
  const contentHeight = textarea.scrollHeight;

  // 只有当内容高度超过默认高度时才调整
  if (contentHeight > defaultHeight) {
    textarea.style.height = contentHeight + 'px';
  } else {
    // 否则恢复到默认高度
    textarea.style.height = defaultHeight + 'px';
  }
};

/**
 * @description 创建textarea自动调整事件处理器
 * @param defaultRows 默认行数
 * @returns 事件处理函数
 */
export const createAutoResizeHandler = (defaultRows: number = 1) => {
  return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea(e.target, defaultRows);
  };
};

/**
 * @description 重置textarea到默认高度
 * @param textarea textarea元素
 * @param defaultRows 默认行数
 */
export const resetTextareaHeight = (textarea: HTMLTextAreaElement, defaultRows: number = 1): void => {
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 73;
  const defaultHeight = lineHeight * defaultRows;
  textarea.style.height = defaultHeight + 'px';
};

/**
 * @description 获取textarea的实际内容高度
 * @param textarea textarea元素
 * @returns 内容实际高度（像素）
 */
export const getTextareaContentHeight = (textarea: HTMLTextAreaElement): number => {
  const originalHeight = textarea.style.height;
  textarea.style.height = 'auto';
  const contentHeight = textarea.scrollHeight;
  textarea.style.height = originalHeight;
  return contentHeight;
};

/**
 * @description 检查textarea内容是否超过指定行数
 * @param textarea textarea元素
 * @param maxRows 最大行数
 * @returns 是否超过最大行数
 */
export const isTextareaOverflow = (textarea: HTMLTextAreaElement, maxRows: number): boolean => {
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 73;
  const maxHeight = lineHeight * maxRows;
  const contentHeight = getTextareaContentHeight(textarea);
  return contentHeight > maxHeight;
}; 