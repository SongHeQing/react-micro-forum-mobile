import type { CommentVO } from '@/types';
import styles from './styles.module.scss';
import defaultAvatar from "@/assets/默认用户头像.jpg";
import { formatRelativeTime } from '@/utils/timeFormat';
import { useMemo } from 'react';

interface Props {
  comment: CommentVO;
  articleAuthorId: number;
  onViewAllReplies?: (commentId: number) => void;
}

const CommentCard: React.FC<Props> = ({ comment, articleAuthorId, onViewAllReplies }) => {
  const isAuthor = comment.user.id === articleAuthorId;

  /**时间格式化*/
  const timeInfo = useMemo(() => {
    return formatRelativeTime(comment?.createTime || '');
  }, [comment?.createTime]);

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentMeta}>
        <div className={styles.commentAvatarBox}>
          <img className={styles.commentAvatar} src={comment.user.image || defaultAvatar} alt="avatar" />
        </div>
        <span className={styles.commentNickname}>{comment.user.nickname}</span>
        {isAuthor && <span className={styles.authorTag}>楼主</span>}
        <span className={styles.commentLike}>👍 {comment.replyCount}</span>
      </div>
      <div className={styles.commentContent}>
        {comment.content}
      </div>
      <div className={styles.commentInfo}>
        <span>第{comment.floor}楼</span>
        <span className={styles.commentTime}>{timeInfo}</span>
      </div>
      {/* 回复预览区域 */}
      {comment.previewReplies && comment.previewReplies.length > 0 && (
        <div className={styles.replyBox}>
          {comment.previewReplies.slice(0, 4).map((reply) => (
            <div key={reply.id} className={styles.replyItem}>
              <span className={styles.replyNickname}>
                {`${reply.user.nickname}:`}
              </span>
              <span className={styles.replyText}>{reply.content}</span>
            </div>
          ))}
          {comment.replyCount > 4 && (
            <div
              className={styles.viewAllReplies}
              onClick={() => onViewAllReplies?.(comment.id)}
            >
              查看全部{comment.replyCount}条回复
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard
