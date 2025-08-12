// src/pages/ArticleDetail/components/BottomBar/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { Toast } from 'antd-mobile';
import { postComment, postReply } from '@/apis/commentApi';
import clsx from 'clsx';
import { CommentVO } from '@/types';
import { useSelector } from 'react-redux';
import store from '@/store';


interface Props {
  articleId?: number;
  onSendSuccess?: (comment: CommentVO) => void;
  replyInfo: CommentVO | null;
  // 新增：让父组件控制输入框状态
  isInputActive?: boolean;
  // 设置输入框状态
  onInputActiveChange?: (active: boolean) => void;
  // 关闭回调
  onClose?: () => void;
}

const BottomBar: React.FC<Props> = ({
  articleId,
  onSendSuccess,
  replyInfo,
  // isInputActive: externalIsInputActive,
  isInputActive,
  onInputActiveChange,
  onClose
}) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // // 使用外部状态或内部状态
  // const [internalIsInputActive, setInternalIsInputActive] = useState(false);

  // // 如果父组件提供了外部状态，使用外部状态；否则使用内部状态
  // const isInputActive = externalIsInputActive !== undefined ? externalIsInputActive : internalIsInputActive;
  // 设置输入框状态
  const setIsInputActive = (active: boolean) => {
    // 如果父组件提供了设置输入框状态的回调，则调用父组件的回调
    // if (onInputActiveChange) {
    onInputActiveChange?.(active);
    // } else {
    // setInternalIsInputActive(active);
    // }
  };

  // 从Redux获取用户信息
  const userInfo = useSelector((state: ReturnType<typeof store.getState>) => state.user.userInfo);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const content = value.trim();
    if (!content) return Toast.show('评论内容不能为空');

    setLoading(true);
    // 回复一级评论或回复二级评论
    try {
      if (replyInfo && articleId) {
        await postReply({
          articleId,
          parentId: replyInfo.id,
          content: content,
        });
        Toast.show('回复发送成功');
        // 如果发送成功，乐观更新UI
      }

      // 发布一级评论
      if (!replyInfo && articleId) {
        await postComment({ articleId, content });
        Toast.show('评论发送成功');
      }
      setValue('');
      setIsInputActive(false);
      // 发送成功回调
      onSendSuccess?.({
        id: 0,
        user: userInfo,
        content: value,
        createTime: new Date().toISOString(),
        replyCount: 0,
        previewReplies: []
      });
    } catch (err) {
      console.log(err);
      Toast.show('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const activateInput = () => {
    setIsInputActive(true);
  };

  useEffect(() => {
    // 当输入框激活时，自动获取焦点
    if (isInputActive) {
      textareaRef.current?.focus();
    }
  }, [isInputActive]);

  const overlayRef = useRef<HTMLDivElement>(null);

  // 在组件状态激活时
  useEffect(() => {

    if (isInputActive) {
      // document.body.style.overflow = 'hidden';
      // 捕获 touchmove 事件并阻止其默认行为，防止 iOS 上的穿透
      const handleTouchMove = (e: TouchEvent) => {
        console.log('touchmove 事件触发');
        // 关闭拖动事件的默认行为
        e.preventDefault();
      };
      // const overlayElement = overlayRef.current;
      // overlayElement?.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        // document.body.style.overflow = '';
        // overlayElement?.removeEventListener('touchmove', handleTouchMove);
        document.body.removeEventListener('touchmove', handleTouchMove);
      };
    }
    // else {
    //   document.body.style.overflow = '';
    // }
  }, [isInputActive]);
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

        // onTouchStart={(e) => e.stopPropagation()} //React的事件机制对touch stopPropagation无效
        onTouchEnd={() => {
          // e.stopPropagation() //React的事件机制对touch stopPropagation无效
          setIsInputActive(false);
          // setValue('');
          onClose?.();
        }}
        onClick={() => {
          console.log('点击了遮罩层');
          // e.preventDefault() //处于 body #root .comment-section 下面，事件传播路径没有其他监听机制，不会对页面造成影响
        }}
      ></div>
      {/* )} */}

      {/* 底部评论栏容器 */}
      <div className={clsx(styles.bottomBar, { [styles.active]: isInputActive })}>
        {/*
          根据 isInputActive 状态，渲染不同形态的UI：
          - false: 显示一个只读的“占位符”，作为评论入口
          - true: 显示真正的 textarea 输入框和发送按钮
        */}
        {!isInputActive && !replyInfo ? (
          <div className={styles.inputPlaceholder} onClick={activateInput}>
            <span className={styles.placeholderText}>发一条友善的评论</span>
          </div>
        ) : (
          <div className={styles.activeInputContainer}>
            {/* 回复对象 */}
            {replyInfo && (
              <div className={styles.replyPreview}>
                <span className={styles.replyPreviewText}>
                  {`回复 ${replyInfo.user.nickname}: ${replyInfo.content}`}
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
              rows={3}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={loading}>
              {loading ? '发送中...' : '发送'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BottomBar;