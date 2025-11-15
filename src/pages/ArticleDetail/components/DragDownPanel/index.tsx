import React, { useRef, useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import ReactDOM from 'react-dom';

interface dragDownPanelProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeThreshold?: number;
}

const DragDownPanel: React.FC<dragDownPanelProps> = ({
  visible,
  onClose,
  title,
  children,
  closeThreshold = 100,
}) => {

  // 获取.dragDownPanel的dom
  const [dragDownPanelElement, setdragDownPanelElement] = useState<HTMLDivElement | null>(null);
  const dragDownPanelRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      setdragDownPanelElement(node);
    }
  }, []);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const startY = useRef(0); //记录初始触摸位置
  const isDraggingPanel = useRef(false);

  // 提前声明handleVirtualClose以解决依赖问题
  const handleVirtualClose = useCallback(() => {
    if (!dragDownPanelElement) {
      return;
    }
    dragDownPanelElement.style.transition = 'transform 0.3s ease-out';
    dragDownPanelElement.style.transform = `translateY(100vh)`;
    setTimeout(() => {
      onClose();
    }, 300);
  }, [dragDownPanelElement, onClose]);

  // 实现进入时的动画效果
  useEffect(() => {
    if (visible && dragDownPanelElement) {
      // 添加过渡效果
      dragDownPanelElement.style.transition = 'transform 0.3s ease-out';
      // 动画到正常位置
      dragDownPanelElement.style.transform = `translateY(0)`;
    }
  }, [visible, dragDownPanelElement]);

  useEffect(() => {
    // 判断是否允许拖动，并记录初始触摸位置
    const handleTouchStart = (e: TouchEvent) => {
      const isTouchedContent = (e.target as Element).closest(`.${styles.content}`);// 判断触摸的是.content区域还是其他区域
      // 如果是.bottomBar区域则静止虚拟滚动
      const isBottomBar = (e.target as Element).closest('[data-drag-exclude="true"]');
      startY.current = e.touches[0].clientY; // 设置TouchStart触点位置

      // 修复拖拽逻辑：更精确地判断何时允许拖拽面板
      if (isTouchedContent) {
        // 在内容区域：只有当内容滚动到顶部时才可能拖拽面板（但还需要判断拖拽方向）
        const isContentAtTop = scrollableContentRef.current && scrollableContentRef.current.scrollTop === 0;
        isDraggingPanel.current = !!isContentAtTop;
      } else if (isBottomBar) {
        return;
      }
      else {
        // 在非内容区域（如header、dragHandle等）：总是可以拖拽面板
        isDraggingPanel.current = true;
      }
    };

    // 操作css,实现虚拟拖动
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY; // 记录Touchmove触点位置
      const dy = currentY - startY.current; // 计算Touchmove触点位置与TouchStart触点位置的差值

      // 核心逻辑：判断是否处于可以拖动的状态
      const isTouchedContent = (e.target as Element).closest(`.${styles.content}`);
      const isContentAtTop = scrollableContentRef.current && scrollableContentRef.current.scrollTop === 0;

      // 修复向上拖动问题：
      // 1. 对于内容区域：只有在内容滚动到顶部且向下拖动时才允许拖动面板
      // 2. 对于非内容区域：只允许向下拖动面板
      // 3. 向上拖动时不应该移动面板，应该让内容正常滚动
      const shouldDragPanel = isDraggingPanel.current && dy > 0 && (
        (isTouchedContent && isContentAtTop) || !isTouchedContent
      );

      if (shouldDragPanel) {
        // 阻止默认滚动行为，因为我们要拖动面板
        e.preventDefault();
        if (dragDownPanelElement) {
          dragDownPanelElement.style.transition = 'none'; // 取消过渡效果
          dragDownPanelElement.style.transform = `translateY(${dy}px)`; // 虚拟拖动.dragDownPanel
        }
      }
      else if (dy < 0 && isTouchedContent) {
        // 向上拖动且在内容区域时，确保面板回到原位，让内容正常滚动
        // if (dragDownPanelElement) {
        //   dragDownPanelElement.style.transition = 'transform 0.1s ease-out';
        //   dragDownPanelElement.style.transform = 'translateY(0)';
        // }
        isDraggingPanel.current = false;
      }
    };

    // 拖动结束时，判断是否关闭弹窗
    const handleTouchEnd = () => {
      if (!dragDownPanelElement) {
        return;
      }
      // 1. 获取当前的 transform 属性值
      const transformValue = window.getComputedStyle(dragDownPanelElement).transform;
      // 2. 从 transform 矩阵中提取 translateY 的值
      // transform: matrix(1, 0, 0, 1, 0, translateY)
      const matrix = transformValue.match(/matrix.*\((.+)\)/);
      let translateY = 0;
      if (matrix) {
        // 在大多数浏览器中，translateY 是矩阵的第 6 个值
        translateY = parseFloat(matrix[1].split(', ')[5]);
      }
      // 3. 开启过渡效果
      dragDownPanelElement.style.transition = 'transform 0.3s ease-out';
      // 4. 根据 translateY 的值判断是否关闭
      if (translateY > closeThreshold) {
        dragDownPanelElement.style.transform = `translateY(100vh)`;
        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        dragDownPanelElement.style.transform = `translateY(0)`;
      }
      isDraggingPanel.current = false;
    };

    if (dragDownPanelElement) {
      dragDownPanelElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      dragDownPanelElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      dragDownPanelElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    return () => {
      if (dragDownPanelElement) {
        dragDownPanelElement.removeEventListener('touchstart', handleTouchStart);
        dragDownPanelElement.removeEventListener('touchmove', handleTouchMove);
        dragDownPanelElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [visible, closeThreshold, dragDownPanelElement, onClose])

  // 创建 portal
  useEffect(() => {
    if (visible && !portalNode) {
      const element = document.createElement('div');
      element.id = 'drag-down-popup-root';
      document.body.appendChild(element);
      setPortalNode(element);
    } else if (!visible && portalNode) {
      document.body.removeChild(portalNode);
      setPortalNode(null);
    }
  }, [visible, portalNode]);


  // 记录状态，是否是.content的子元素
  const isContentTouchedForBodyListener = useRef<HTMLElement | null>(null); // 记录是否是.content的子元素
  // 在组件状态激活时，阻止默认行为
  useEffect(() => {
    if (visible) {
      const handleTouchStart = (e: TouchEvent) => {
        // 确认元素是不是.content的子元素
        if (e.target instanceof Element) {
          isContentTouchedForBodyListener.current = e.target.closest(`.${styles.content}`);
        }
      };
      document.body.addEventListener('touchstart', handleTouchStart, { passive: false });

      const handleTouchMove = (e: TouchEvent) => {
        // 判断是否是.content的子元素，如果是，则不阻止默认行为，否则阻止默认行为
        if (isContentTouchedForBodyListener.current) {
          return;
        }
        e.preventDefault();
      };
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false })

      return () => {
        document.body.removeEventListener('touchmove', handleTouchMove);
        document.body.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [visible]);

  if (!visible || !portalNode) {
    return null;
  }

  // 分离内容和底部栏
  let content: React.ReactNode = null;
  let bottomBar: React.ReactNode = null;

  // 检查 children 是否包含 BottomBar 组件
  if (Array.isArray(children)) {
    content = children.filter(child => {
      // 简单判断是否为 BottomBar 组件
      return !child || !child.type || child.type.name !== 'BottomBar';
    });
    bottomBar = children.find(child => {
      return child && child.type && child.type.name === 'BottomBar';
    });
  } else {
    // 如果只有一个子元素，假设它是内容
    content = children;
  }

  return ReactDOM.createPortal(
    <div className={styles.mask}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleVirtualClose()
        }
      }}
    >
      <div
        className={styles.dragDownPanel}
        ref={dragDownPanelRef}
      >
        <div className={styles.dragHandle} />
        <div className={styles.header}>
          <h3>{title}</h3>
          <div className={styles.closeButton}
            onClick={handleVirtualClose}
          >
            <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7158" ><path d="M560.568 512l316.784-316.784c15.621-15.621 15.621-40.947 0-56.568s-40.947-15.621-56.568 0L504 455.432 187.216 138.647c-15.621-15.621-40.947-15.621-56.568 0s-15.621 40.947 0 56.568L447.432 512 130.647 828.783c-15.621 15.621-15.621 40.948 0 56.569 15.621 15.62 40.947 15.62 56.568 0L504 568.568l316.784 316.784c15.621 15.62 40.947 15.62 56.568 0 15.621-15.621 15.621-40.948 0-56.569L560.568 512z" p-id="7159"></path></svg>
          </div>
        </div>
        <div className={styles.content} ref={scrollableContentRef}>
          {content}
        </div>
        {bottomBar}
      </div>
    </div>,
    portalNode
  );
};

export default DragDownPanel;