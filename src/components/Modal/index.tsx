import React from 'react';
import styles from './index.module.scss';

// 定义 Modal 组件的属性接口
export interface ModalProps {
  // 控制模态框是否可见
  visible: boolean;
  // 模态框标题
  title?: string;
  // 选项列表
  options?: string[];
  // 点击取消按钮时的回调函数
  onCancel?: () => void;
  // 选择选项时的回调函数，参数为选项的索引
  onSelect?: (index: number) => void;
  // 点击遮罩层关闭模态框时的回调函数
  onClose?: () => void;
}

// Modal 弹层组件 - 从屏幕底部弹出的选择框
const Modal: React.FC<ModalProps> = ({
  visible,
  title = '标题',
  options = ['选项1', '选项2'],
  onCancel,
  onSelect,
  onClose
}) => {
  // 处理选项点击
  const handleSelect = (index: number) => {
    onSelect?.(index);
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    onCancel?.();
  };

  // 处理遮罩层点击
  const handleOverlayClick = () => {
    onClose?.();
  };

  // 如果模态框不可见，则不渲染任何内容
  if (!visible) {
    return null;
  }

  return (
    // 遮罩层 - 点击会触发关闭事件
    <div className={styles.modalOverlay} onClick={handleOverlayClick} data-testid="modal-overlay">
      {/* 模态框内容区域 - 阻止点击事件冒泡到遮罩层 */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 标题 */}
        <div className={styles.title}>{title}</div>
        {/* 选项列表 */}
        {options.map((option, index) => (
          <div 
            key={index} 
            className={styles.option}
            onClick={() => handleSelect(index)}
          >
            {option}
          </div>
        ))}
        {/* 取消按钮 */}
        <div className={styles.cancel} onClick={handleCancel}>
          取消
        </div>
      </div>
    </div>
  );
};

export default Modal;