export type LoginParams = {
  email: string;
  password: string;
}

export type LoginInfo = {
  id: number;
  nickname: string;
  email: string;
  token: string;
}

export type RegisterParams = {
  email: string;
  password: string;
}

export type UserProfile = {
  image: string; // 头像链接
  nickname: string; // 昵称
  followCount: number; // 用户关注量
  fansCount: number; // 粉丝数量
  articleSendCount: number; // 文章发送量
  commentSendCount: number; // 评论发送量
  channelFollowCount: number; // 频道关注量
}

// 用户主页信息类型定义
export type UserHome = {
  image: string;
  nickname: string;
  followCount: number;
  fansCount: number;
  articleSendCount: number;
  commentSendCount: number;
  channelFollowCount: number;
  likeCount: number;
  introduction: string;
  createTime: string;
}