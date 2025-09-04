// 评论用户信息（简略版）
export interface UserSimpleVO {
  id: number
  nickname: string
  image: string
  isAuthor?: boolean // 前端 UI 展示所需，可选字段
}

// 一级评论展示结构（对应 CommentVO）
export interface CommentVO {
  id: number
  user: UserSimpleVO
  content: string
  createTime: string // ISO 日期字符串
  replyCount: number
  likeCount: number
  isLiked: boolean
  previewReplies?: CommentReplyVO[]
  floor?: number
}

// 二级评论展示结构（对应 CommentReplyVO）
export interface CommentReplyVO {
  id: number
  user: UserSimpleVO
  replyToUser?: UserSimpleVO
  content: string
  likeCount: number
  isLiked: boolean
  createTime: string
}

// 新增一级评论请求结构（对应 CommentAddRequest）
export interface CommentPostDTO {
  articleId: number
  content: string // 1-2000 字内，前端建议做校验
}

// 回复评论请求结构（对应 CommentReplyAddRequest）
export interface ReplyPostDTO {
  articleId: number
  parentId: number
  content: string // 1-500 字内，前端建议做校验
  replyToUserId?: number // 可选，仅用于 UI 展示 "@某人"
}

// 一级评论分页查询（列表）
export interface CommentQueryParams {
  articleId: number
  page: number
}

// 二级评论分页查询
export interface ReplyQueryParams {
  parentId: number
  page: number
}
