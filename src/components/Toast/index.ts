// index.ts 文件

import React from 'react';
import ReactDOM from 'react-dom/client';
// 假设这是 ToastContainer 组件
import ToastContainerComponent from './Toast.tsx';

// 保持一个引用，用于管理 ReactDOM Root
let toastRoot: ReactDOM.Root | null = null;
// 保持一个引用，用于管理容器元素
let container: HTMLElement | null = null;

// 【优化 1：实现容器持久化和获取】
const getOrCreateContainer = (): HTMLElement => {
  if (!container) {
    container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }
  return container;
};


// 定义 Toast 类型枚举，便于扩展更多类型
type ToastType = 'warning' | 'success';

// 定义 Toast 配置接口
interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
}

// 指令式调用方法
const show = ({ type = 'success', message, duration = 3000 }: ToastOptions) => {
  // 1. 在渲染新 Toast 前，先清理可能存在的旧 Toast 实例
  if (toastRoot) {
    // 强制立即卸载前一个实例
    toastRoot.unmount();
    toastRoot = null;
  }

  // 2. 获取或创建持久化的容器
  const currentContainer = getOrCreateContainer();

  // 3. 渲染新的toast
  // 如果是第一次调用，创建 Root
  if (!toastRoot) {
    toastRoot = ReactDOM.createRoot(currentContainer);
  }

  // 【优化 2：简化 onClose 逻辑】
  // 因为容器是持久化的，onClose 只需要卸载 Toast 组件本身即可。
  const handleToastClose = () => {
    if (toastRoot) {
      toastRoot.unmount();
      toastRoot = null;
    }
    // 注意：这里不再需要移除容器元素
  }

  toastRoot.render(
    React.createElement(ToastContainerComponent, {
      type: type,
      message: message,
      duration: duration,
      onClose: handleToastClose, // 传入简化后的关闭函数
    })
  );
};

const Toast = {
  show,
  success: (message: string, duration?: number) => show({ type: 'success', message, duration }),
  warning: (message: string, duration?: number) => show({ type: 'warning', message, duration }),
};
export default Toast;