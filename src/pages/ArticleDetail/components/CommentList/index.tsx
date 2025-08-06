// src/pages/ArticleDetail/components/CommentList/index.tsx
import React from 'react'
import { DotLoading, InfiniteScroll } from 'antd-mobile'
import CommentCard from '../CommentCard'
import styles from './styles.module.scss'
import type { CommentVO } from '@/types'


interface Props {
  comments: CommentVO[]
  articleAuthorId: number
  loadMore: () => Promise<void>
  hasMore: boolean
  onViewAllReplies?: (commentId: number) => void
}

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <>
          <span>Loading</span>
          <DotLoading />
        </>
      ) : (
        <div className={styles.noMore}>
          <div></div>
          <span> 已加载全部回复 </span>
          <div></div>
        </div>
      )}
    </>
  )
}

const CommentList: React.FC<Props> = ({ comments, articleAuthorId, loadMore, hasMore, onViewAllReplies }) => {
  return (
    <div className={styles.commentList}>
      {comments.length === 0 ? (
        <div className={styles.empty}>暂无评论，快来发一条吧！</div>
      ) : (
        comments.map((comment, index) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            articleAuthorId={articleAuthorId}
            onViewAllReplies={onViewAllReplies}
            isLast={index === comments.length - 1}
          />
        ))
      )}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} >
        <InfiniteScrollContent hasMore={hasMore} />
      </InfiniteScroll>
    </div>
  )
}

export default CommentList
