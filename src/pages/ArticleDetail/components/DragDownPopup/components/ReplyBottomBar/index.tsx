// src/pages/ArticleDetail/components/DragDownPopup/components/ReplyBottomBar/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { Toast } from 'antd-mobile';
import { postReply } from '@/apis/commentApi';
import clsx from 'clsx';
import { CommentVO } from '@/types';
import { useSelector } from 'react-redux';
import store from '@/store';

interface Props {
  articleId?: number;
  parentId?: number;
  onSendSuccess?: (comment: CommentVO) => void;
  isInputActive?: boolean;
  onInputActiveChange: (active: boolean) => void;
  onClose?: () => void;
}

const ReplyBottomBar: React.FC<Props> = ({
  articleId,
  parentId,
  onSendSuccess,
  isInputActive,
  onInputActiveChange,
  onClose
}) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // 从Redux获取用户信息
  const userInfo = useSelector((state: ReturnType<typeof store.getState>) => state.user.userInfo);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 当输入框激活时，自动获取焦点
    if (isInputActive) {
      textareaRef.current?.focus();
    }
  }, [isInputActive]);

  const handleSend = async () => {
    const content = value.trim();
    if (!content) return Toast.show('评论内容不能为空');
    if (!parentId || !articleId) return Toast.show('缺少必要参数');

    setLoading(true);

    try {
      // 回复某条评论（二级评论）
      await postReply({
        articleId,
        parentId,
        content: content,
      });

      Toast.show('回复发送成功');

      // 清空输入框
      setValue('');

      // 调用成功回调
      onSendSuccess?.({
        id: Date.now(), // 临时ID，实际ID应该由后端返回
        user: userInfo,
        content: value,
        createTime: new Date().toISOString(),
        likeCount: 0,
        isLiked: false,
        replyCount: 0,
      });
    } catch (err) {
      console.log(err);
      Toast.show('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const overlayRef = useRef<HTMLDivElement>(null);

  // 阻止默认行为
  useEffect(() => {
    if (isInputActive) {
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        document.body.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isInputActive]);

  return (
    <>
      {/* 独立的遮罩层，点击它本身即可关闭 */}
      <div
        className={clsx(styles.overlay, { [styles.active]: isInputActive })}
        ref={overlayRef}
        onTouchEnd={() => {
          onClose?.();
        }}
        onMouseUp={() => {
          onClose?.();
        }}
      ></div>

      <div className={styles.bottomBar}>
        {!isInputActive ? (
          <div className={styles.inputPlaceholder} onClick={() => { onInputActiveChange(true); }}>
            <span className={styles.placeholderText}>发一条友善的回复</span>
          </div>
        ) : (
          <div className={styles.activeInputContainer}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="发一条友善的回复"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              rows={3}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={loading}>
              {loading ? '发送中...' : '发送'}
            </button>
          </div>
        )}
      </div >
    </>
  );
};

export default ReplyBottomBar;