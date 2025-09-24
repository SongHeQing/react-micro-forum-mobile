/**
 * 节流函数 - 限制函数执行频率
 * @param func 需要节流的函数
 * @param delay 节流延迟时间（毫秒）
 * @returns 节流后的函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;

  const throttledFunction = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();

    // 如果距离上次执行时间已经超过延迟时间
    if (now - lastExecTime >= delay) {
      // 直接执行函数
      func.apply(this, args);
      lastExecTime = now;
    } else if (!timeoutId) {
      // 否则设置定时器，在延迟时间后执行
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (now - lastExecTime));
    }
  } as T & { cancel: () => void };

  // 添加取消方法
  throttledFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastExecTime = 0;
  };

  return throttledFunction;
}

export default throttle;