import { useState } from 'react';
import clsx from 'clsx';

interface UseClickAnimationOptions {
  duration?: number;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

/**
 * 自定义Hook：管理点击动画状态
 * @param options 动画配置选项
 * @returns 动画状态和控制函数
 */
export const useClickAnimation = (options: UseClickAnimationOptions = {}) => {
  const {
    duration = 600,
    onAnimationStart,
    onAnimationEnd
  } = options;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  /**
   * 触发点击动画
   */
  const triggerAnimation = () => {
    if (isAnimating) return; // 防止重复触发

    setIsAnimating(true);
    onAnimationStart?.();

    setTimeout(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    }, duration);
  };

  /**
   * 获取动画类名
   * @param baseClassName 基础类名
   * @param animationClassName 动画类名
   * @returns 组合后的类名
   */
  const getAnimationClassName = (
    baseClassName: string,
    animationClassName: string = 'animate'
  ): string => {
    return `${baseClassName} ${isAnimating ? animationClassName : ''}`.trim();
  };

  /**
   * 获取CSS Module动画类名
   * @param baseClassName 基础类名（CSS Module对象）
   * @param animationClassName 动画类名（CSS Module对象）
   * @returns 组合后的类名
   */
  const getModuleAnimationClassName = (
    baseClassName: string,
    animationClassName: string
  ): string => {
    return clsx(baseClassName, isAnimating && animationClassName);
  };

  return {
    isAnimating,
    triggerAnimation,
    getAnimationClassName,
    getModuleAnimationClassName
  };
}; 