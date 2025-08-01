// src/pages/ArticleDetail/components/BottomBar/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { Toast } from 'antd-mobile';
import { postComment, postReply } from '@/apis/commentApi';
import clsx from 'clsx';

// 新增 ReplyInfo 类型，用于存储被回复评论的信息
interface ReplyInfo {
  parentId: number; // 被回复评论的 ID
  replyToUsername: string; // 被回复用户的昵称
  replyToContent: string; // 被回复评论的内容（用于预览）
}

interface Props {
  articleId: number;
  onSendSuccess?: () => void;
  replyInfo?: ReplyInfo;
}

const BottomBar: React.FC<Props> = ({ articleId, onSendSuccess, replyInfo }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    const content = value.trim();
    if (!content) return Toast.show('评论内容不能为空');

    setLoading(true);
    try {
      if (replyInfo) { // 如果存在 replyInfo，则调用回复评论 API
        await postReply({
          articleId,
          parentId: replyInfo.parentId,
          content: content,
        });
        Toast.show('回复发送成功');
      } else { // 否则，调用发表新评论 API
        await postComment({ articleId, content });
        Toast.show('评论发送成功');
      }
      Toast.show('评论发送成功');
      setValue('');
      setIsInputActive(false);
      onSendSuccess?.()
    } catch (err) {
      console.log(err);
      Toast.show('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * false：显示一个只读的“占位符”区域，作为用户评论的入口。
   * true：显示一个覆盖全屏的半透明遮罩，并在底部弹出真正的 textarbottomBarRefea 输入框和发送按钮。
   */
  const [isInputActive, setIsInputActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null); // 新增：用于包裹激活状态下评论输入面板的Ref

  const activateInput = () => {
    setIsInputActive(true);
  };

  // ******** 合并后的 useEffect ********
  useEffect(() => {
    // 只有当输入框处于激活状态时才执行以下逻辑
    if (replyInfo && !isInputActive) {
      // 在非激活状态下，确保清除之前的任何监听器
      return;
    }

    textareaRef.current?.focus();

    // 处理点击/触摸外部关闭浮层的逻辑
    const handleInteractionOutside = (event: MouseEvent | TouchEvent) => {
      // 1. 如果点击的是底部的 bottomBar 容器本身（即背景遮罩），就关闭
      //    这个逻辑主要由 JSX 里的 onClick={...} 处理，但这里也可以作为备用或额外判断
      //    如果你在 JSX 的 bottomBar 上已经加了 `onClick={...}`，这里的 `event.target === event.currentTarget` 可以在某些情况下去掉
      //    但为了通用性，保留它通常更安全，因为它捕获的是文档层面的事件
      const isClickedOnSelfOrOutsidePanel =
        (event.target === event.currentTarget && (event instanceof MouseEvent || (event instanceof TouchEvent && event.type === 'touchstart'))) ||
        // 2. 如果点击/触摸发生在 inputPanelRef 外部
        (inputPanelRef.current &&
          !inputPanelRef.current.contains(event.target as Node) &&
          // 3. 并且点击的不是发送按钮（防止点击发送后立即关闭）
          !(event.target instanceof HTMLButtonElement && event.target.className.includes(styles.sendBtn)));

      if (isClickedOnSelfOrOutsidePanel) {
        // 4. 排除滑动事件，只在点击或首次触摸时关闭
        if (event instanceof TouchEvent && event.type === 'touchmove') return;

        console.log('点击了外部或背景遮罩，关闭浮层'); // 调试用
        setIsInputActive(false);
        // setValue('');
      }
    };

    // 延迟添加事件监听器，避免激活点击事件冒泡导致立即关闭
    // 0ms 延迟通常足够，它会将任务放入微任务队列的末尾，确保当前渲染周期和事件处理完成后再执行
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleInteractionOutside, true); // 监听鼠标点击
      document.addEventListener('touchstart', handleInteractionOutside, true); // 监听手指触摸开始
      // 如果你真的需要处理滑动（不推荐），可以取消下面行的注释，但需要更复杂的逻辑来判断滑动意图
      // document.addEventListener('touchmove', handleInteractionOutside, true);
    }, 0);

    // 清理函数：在组件卸载或 isInputActive 变为 false 时执行
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleInteractionOutside, true);
      document.removeEventListener('touchstart', handleInteractionOutside, true);
      // document.removeEventListener('touchmove', handleInteractionOutside, true);
    };
  }, [isInputActive, replyInfo]); // 依赖 isInputActive 状态，只有它变化时才重新运行这个 Effect

  // ******** 合并后的 useEffect 结束 ********

  return (<>
    {isInputActive && (
      // ******** 新增的独立遮罩层 ********
      <div
        className={clsx(styles.overlay, { [styles.active]: isInputActive })} // 定义新的样式
        onClick={() => { // 点击遮罩就关闭
          setIsInputActive(false);
          setValue('');
        }}
      ></div>
    )}
    {/* 注意：这里的 bottomBar 仍然是固定在底部的那个div，当 active 时它会覆盖全屏 */}
    <div className={clsx(styles.bottomBar, { [styles.active]: isInputActive })}
      // 在 active 状态的 div 上直接监听点击，如果点击它（也就是点击背景遮罩），就关闭
      // 这样比 document.addEventListener 更精确，且可以利用冒泡
      onClick={isInputActive || replyInfo ? (e) => {
        // 如果点击的是 bottomBar 本身（即背景遮罩），而不是里面的内容
        if (e.target === e.currentTarget) {
          console.log('点击了背景遮罩', e.target, e.currentTarget);
          setIsInputActive(false);
          setValue('');
        }
      } : undefined} // 只有在激活状态时才添加这个点击处理
    >
      {/* 条件渲染： 根据 isInputActive 的值，在 JSX 中渲染不同形态的 UI 结构：
       1. 当 isInputActive 为 false 时，显示一个只读的“占位符”区域，作为用户评论的入口。
       2. 当 isInputActive 为 true 时，显示一个覆盖全屏的半透明遮罩，并在底部弹出真正的 textarea 输入框和发送按钮。
      */}
      {!isInputActive && !replyInfo ? (
        <div className={styles.inputPlaceholder} onClick={activateInput}>
          <span className={styles.placeholderText}>发一条友善的评论</span>
        </div>
      ) : (
        // 在这里将 inputPanelRef 绑定到实际的评论输入面板容器上
        <div className={styles.activeInputContainer} ref={inputPanelRef}>
          {/* ******** 新增的回复预览区域 ******** */}
          {replyInfo && (
            <div className={styles.replyPreview}>
              <span className={styles.replyPreviewText}>
                {`回复 ${replyInfo.replyToUsername}: ${replyInfo.replyToContent}`}
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