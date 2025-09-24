// src/pages/ArticleDetail/components/BottomBar/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { Toast } from 'antd-mobile';
import { postComment, postReply } from '@/apis/commentApi';
import clsx from 'clsx';
import { CommentReplyVO, CommentVO } from '@/types';
import { useSelector } from 'react-redux';
import store from '@/store';


interface Props {
  articleId?: number;
  onSendSuccess?: (comment: CommentVO) => void;
  onReplySendSuccess?: (reply: CommentReplyVO) => void;
  CommentTarget: CommentVO | null;
  replyTarget?: CommentReplyVO | null;
  isInputActive?: boolean;
  onInputActiveChange: (active: boolean) => void;
  onClose?: () => void;
}

const BottomBar: React.FC<Props> = ({
  articleId,
  onSendSuccess,
  onReplySendSuccess,
  CommentTarget,
  replyTarget,
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
    if (!articleId) return;
    const content = value.trim();
    if (!content) return Toast.show('评论内容不能为空');
    setLoading(true);
    // 回复一级评论
    try {
      let commentId = 0; // 声明变量以便在作用域外使用
      if (CommentTarget) {
        commentId = await postReply({
          articleId,
          parentId: CommentTarget.id,
          content: content,
          replyToUserId: replyTarget?.user?.id,
        });
        Toast.show('回复发送成功');
        // 如果发送成功，乐观更新UI
        onReplySendSuccess?.({
          id: commentId,
          user: userInfo,
          replyToUser: replyTarget?.user,
          content,
          createTime: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
        });
      }

      // 发布一级评论
      if (!CommentTarget) {
        commentId = await postComment({ articleId, content });
        Toast.show('评论发送成功');
        Toast.show(`异步代码成功，获取到的commentId为：${commentId}`);
        onSendSuccess?.({
          id: commentId,
          user: userInfo,
          content,
          createTime: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
          replyCount: 0,
        });
      }
      setValue('');

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
    // 如果输入模式激活，阻止蒙层的默认行为
    if (isInputActive && overlayRef.current) {
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      overlayRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
      const currentOverlay = overlayRef.current;
      return () => {
        currentOverlay.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isInputActive]);

  const bottomBarRef = useRef<HTMLDivElement>(null);
  // 默认阻止.bottomBar的touchMove默认行为
  useEffect(() => {
    // 控制台打印查看bottomBarRef是否存在
    console.log('bottomBarRef:', bottomBarRef.current);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    if (bottomBarRef.current) {
      bottomBarRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    // 将bottomBarRef.current保存到变量中
    const currentBottomBar = bottomBarRef.current;
    return () => {
      if (currentBottomBar) {
        currentBottomBar.removeEventListener('touchmove', handleTouchMove);
      }
    }
  }, [])

  return (
    <>
      {/* 移除条件渲染，转为控制显隐 */}
      {/* 问题的核心：事件的“时间差”
          遇到的问题，无论你把它称作“点击穿透”还是“触摸穿透”，其根源都是一个时间差：
          当你触摸屏幕时，浏览器会依次触发一系列事件：touchstart -> touchmove -> touchend -> click。
          click 事件有一个约 300 毫秒的延迟。
          如果你的蒙层在 touchend 事件发生后立即移除，那么当 click 事件到达时，蒙层已经不在了。
          于是，这个 click 事件就会穿透到蒙层原来所在的位置，触发下面的元素。 
      */}
      {/* {isInputActive && ( */}
      {/* 独立的遮罩层，点击它本身即可关闭 */}
      {/* 阻止冒泡，防止点击输入框时事件冒泡到此并关闭 */}
      <div
        className={clsx(styles.overlay, { [styles.active]: isInputActive })}
        ref={overlayRef}
        onTouchEnd={() => {
          // e.stopPropagation() //React的事件机制对touch stopPropagation无效
          // setValue('');
          onClose?.();
        }}
        onMouseUp={() => {
          // e.stopPropagation() //React的事件机制对touch stopPropagation无效
          // setValue('');
          onClose?.();
        }}
      ></div>

      <div className={clsx(styles.bottomBar, { [styles.active]: isInputActive })}
        ref={bottomBarRef}
        data-drag-exclude="true"
      >
        {!isInputActive ? (
          <div className={styles.inputPlaceholder} onClick={() => { onInputActiveChange(true); }}>
            <span className={styles.placeholderText}>发一条友善的评论</span>
          </div>
        ) : (
          <div className={styles.activeInputContainer}>
            {/* 回复对象 */}
            {(replyTarget || CommentTarget) && isInputActive && (
              <div className={styles.replyPreview}>
                <span className={styles.replyPreviewText}>
                  {`回复 ${(replyTarget || CommentTarget)?.user?.nickname}: ${(replyTarget || CommentTarget)?.content}`}
                </span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="发一条友善的评论"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              rows={2}
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

export default BottomBar;