import request from '@/utils/request'
import type {
  CommentVO,
  CommentReplyVO,
  CommentPostDTO,
  ReplyPostDTO,
  CommentQueryParams,
  ReplyQueryParams
} from '@/types/Comment'

/**
 * 获取一级评论列表（附带前5条回复预览）
 */
export async function fetchTopLevelComments(params: CommentQueryParams): Promise<CommentVO[]> {
  return request.get('/comment/list', { params })
}

/**
 * 获取某条评论的所有回复（二级评论）
 */
export async function fetchCommentReplies(params: ReplyQueryParams): Promise<CommentReplyVO[]> {
  return request.get('/comment/replies', { params })
}

/**
 * 发布一级评论
 */
export async function postComment(data: CommentPostDTO): Promise<number> {
  return request.post('/comment/add', data)
}

/**
 * 回复某条评论（二级评论）
 */
export async function postReply(data: ReplyPostDTO): Promise<number> {
  return request.post('/comment/reply', data)
}

/**
 * 切换评论点赞状态
 */
export async function toggleCommentLike(commentId: number, articleId: number): Promise<boolean> {
  return request.post(`/comment/${commentId}/like`, null, {
    params: { articleId }
  })
}

// 可选：统一导出
export const commentApi = {
  fetchTopLevelComments,
  fetchCommentReplies,
  postComment,
  postReply,
  toggleCommentLike
}
