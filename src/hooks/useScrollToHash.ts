// src/hooks/useScrollToHash.ts

import { useCallback } from 'react';
import { useLocation } from 'react-router';

// 这是一个纯粹的 Hook，只负责提供滚动功能
const useScrollToHash = () => {
  const { hash } = useLocation();

  // 创建一个可记忆的滚动函数，它不包含任何状态
  const scrollToElement = useCallback(() => {
    if (!hash) return false; // 如果没有 hash，则不执行任何操作

    const elementId = hash.substring(1);
    const targetElement = document.getElementById(elementId);

    if (targetElement) {
      console.log(`找到锚点元素: ${elementId}，准备滚动`);
      requestAnimationFrame(() => {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        console.log(`已滚动到锚点: ${elementId}`);
      });
      return true; // 返回 true，表示已触发滚动
    }
    return false; // 返回 false，表示未找到元素
  }, [hash]);

  // Hook 变得非常简洁，只返回滚动函数
  return { scrollToElement };
};

export default useScrollToHash;