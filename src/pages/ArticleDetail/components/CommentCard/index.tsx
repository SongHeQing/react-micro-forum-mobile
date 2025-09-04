// src/pages/ArticleDetail/components/CommentCard/index.tsx
import type { CommentReplyVO, CommentVO } from '@/types';
import styles from './styles.module.scss';
import defaultAvatar from "@/assets/默认用户头像.jpg";
import { formatRelativeTime } from '@/utils/timeFormat';
import { useMemo, useState } from 'react';
import { toggleCommentLike } from '@/apis/commentApi';
import { Toast } from 'antd-mobile';
import { useClickAnimation } from '@/hooks/useClickAnimation';

interface Props {
  comment: CommentVO | CommentReplyVO;
  articleAuthorId?: number;
  onViewAllReplies?: (comment: CommentVO) => void;
  onReplyComment?: (comment: CommentVO) => void;
  // 不渲染回复预览
  preview?: boolean;
  articleId: number; // 添加文章ID属性用于点赞API调用
}

// 类型守卫
function isCommentVO(comment: CommentVO | CommentReplyVO): comment is CommentVO {
  return (comment as CommentVO).floor !== undefined;
}

const CommentCard: React.FC<Props> = ({ comment, articleAuthorId, onViewAllReplies, onReplyComment, preview = true, articleId }) => {

  const isAuthor = comment.user.id === articleAuthorId;

  // 管理点赞状态和数量
  const [isLiked, setIsLiked] = useState<boolean>(comment.isLiked);
  const [displayLikeCount, setDisplayLikeCount] = useState<number>(comment.likeCount);

  // 使用自定义Hook管理点赞图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameLikeIcon, triggerAnimation: triggerAnimationLikeIcon } = useClickAnimation({
    duration: 300
  });

  /**时间格式化*/
  const timeInfo = useMemo(() => {
    return formatRelativeTime(comment?.createTime || '');
  }, [comment?.createTime]);

  // 处理查看全部回复
  const handleViewAllReplies = () => {
    if (isCommentVO(comment)) {
      onViewAllReplies?.(comment);
    }
  };

  /**评论点赞事件 */
  const handleLikeComment = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerAnimationLikeIcon(); // 触发动画

    const previousIsLiked = isLiked;
    const previousDisplayLikeCount = displayLikeCount;

    // 乐观更新 UI
    setIsLiked(!previousIsLiked);
    setDisplayLikeCount(previousIsLiked ? previousDisplayLikeCount - 1 : previousDisplayLikeCount + 1);
    // 修改文章数据利于数据传递
    comment.isLiked = !previousIsLiked;
    comment.likeCount = previousIsLiked ? previousDisplayLikeCount - 1 : previousDisplayLikeCount + 1;

    try {
      await toggleCommentLike(comment.id, articleId);
      // 如果后端返回了新的计数，可以这里更新 displayLikeCount
    } catch (error) {
      console.error("评论点赞/取消点赞失败", error);
      Toast.show({
        content: previousIsLiked ? '取消点赞失败' : '点赞失败',
        position: 'bottom',
      });
      // API调用失败，回滚 UI 状态
      setIsLiked(previousIsLiked);
      setDisplayLikeCount(previousDisplayLikeCount);
      // 回滚修改的文章数据利于数据传递
      comment.isLiked = previousIsLiked;
      comment.likeCount = previousDisplayLikeCount;
    }
  };



  return (
    <>
      <div id={`${comment.id}`} className={styles.commentCard}
        onClick={(e) => {
          console.log('点击了评论卡片');
          e.stopPropagation(); // 阻止事件冒泡
          if (isCommentVO(comment)) {
            onReplyComment?.(comment);
          }
        }}
      >
        <div className={styles.commentMeta}>
          <div className={styles.commentAvatarBox}>
            <img className={styles.commentAvatar} src={comment.user.image || defaultAvatar} alt="avatar" />
          </div>
          <span className={styles.commentNickname}>{comment.user.nickname}</span>
          {isAuthor && <span className={styles.authorTag}>楼主</span>}
          <div className={`${styles.commentLike} ${isLiked ? styles.active : ''}`}
            onClick={handleLikeComment}
          >
            <svg
              className={getModuleAnimationClassNameLikeIcon(styles.icon, styles.iconAnimate)}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M795.769 342.896c-0.007 0 0.005 0 0 0H685.4c-0.849 0-1.489-0.69-1.262-1.508 4.144-14.865 21.546-84.656 4.471-153.887C668.02 104.026 601.913 64.003 542.469 64c-32.186-0.002-62.412 11.729-82.415 34.647-56.944 65.247-19.396 88.469-52.796 175.756-28.589 74.718-96.736 94.832-115.814 99.091l-5.188 1.037h-93.46c-70.692 0-128 57.308-128 128V816c0 70.692 57.308 128 128 128h511.09c88.992 0 166.321-61.153 186.831-147.751l60.745-256.479c23.799-100.487-52.431-196.874-155.693-196.874zM144.795 816V502.531c0-26.467 21.532-48 48-48h48V864h-48c-26.468 0-48-21.533-48-48z m728.82-294.667l-60.746 256.479C800.851 828.559 756.034 864 703.885 864h-383.09V448.497c38.811-11.046 123.048-45.847 161.181-145.505 18.542-48.459 20.521-83.044 21.966-108.297 1.396-24.407 1.511-26.401 16.385-43.444 3.904-4.473 12.387-7.252 22.139-7.251 24.457 0.001 57.065 16.412 68.472 62.659 9.14 37.052 3.955 76.38-0.277 97.734-5.33 22.173-17.249 50.663-28.257 74.365-9.891 21.296 5.923 45.558 29.402 45.32l116.708-1.184h67.256c24.607 0 47.478 11.072 62.745 30.379 15.267 19.308 20.771 44.115 15.1 68.06z" ></path>
            </svg>
            <span className={styles.commentLikeCount}
            >
              {displayLikeCount > 0 ? displayLikeCount : '赞'}
            </span>
          </div>
          {/* 更多 */}
          <div className={styles.commentMore}>
            <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7158" width="200" height="200"><path d="M512 512m-80 0a80 80 0 1 0 160 0 80 80 0 1 0-160 0Z" p-id="7159"></path><path d="M512 848m-80 0a80 80 0 1 0 160 0 80 80 0 1 0-160 0Z" p-id="7160"></path><path d="M512 176m-80 0a80 80 0 1 0 160 0 80 80 0 1 0-160 0Z" p-id="7161"></path></svg>
          </div>
        </div>
        <div className={styles.commentContent}>
          {comment.content}
        </div>
        <div className={styles.commentInfo}>
          {isCommentVO(comment) && comment.floor && (<span>第{comment.floor}楼</span>)}
          <span className={styles.commentTime}>{timeInfo}</span>
        </div>
        {/* 回复预览区域 */}
        {isCommentVO(comment) && preview && comment.previewReplies && comment.previewReplies.length > 0 && (
          <div className={styles.replyBox}>
            {comment.previewReplies.slice(0, 5).map((reply) => (
              <div key={reply.id} className={styles.replyItem}>
                <span className={styles.replyNickname}>
                  {`${reply.user.nickname}:`}
                </span>
                <span className={styles.replyText}>{reply.content}</span>
              </div>
            ))}
            {isCommentVO(comment) && comment.replyCount > 5 && (
              <div
                className={styles.viewAllReplies}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAllReplies();
                }}
              >
                查看全部{comment.replyCount}条回复
              </div>
            )}
          </div>
        )}
      </div>

    </>
  );
};

export default CommentCard