import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Toast.module.scss';
import AlertCircleIcon from '@/components/Toast/icons/alert-circle.svg?react';
import CheckCircleIcon from '@/components/Toast/icons/check-circle.svg?react';

interface ToastProps {
  type: 'warning' | 'success';
  message: string;
  className?: string;
  duration?: number;
  onClose?: () => void;
}

const ToastContainer: React.FC<ToastProps> = ({
  type,
  message,
  className = '',
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    setVisible(false);
    // 等待退出动画完成后再调用onClose
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 触发进入动画
    setVisible(true);

    // 设置新的计时器
    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, handleClose]);



  return (
    <div className={`${styles.toast} ${styles[type]} ${className} ${visible ? styles.enter : styles.exit}`}>
      {type === 'warning' && <AlertCircleIcon />}
      {type === 'success' && <CheckCircleIcon />}

      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default ToastContainer;