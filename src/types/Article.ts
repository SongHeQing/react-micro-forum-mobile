
/**
 * @description 频道卡片
 */
export type ChannelCard = {
  id: number;
  channelName: string;
  userCount: number;
  articleCount: number;
  image: string;
};




/**
 * @description 单篇文章卡片
 */
export type ArticleCard = {
  id: number;
  channelCard: ChannelCard;
  title: string;
  contentPreview: string;
  mediaType: number | null; // 媒体类型：NULL=无；1=图片；2=视频
  mediaUrls: string[]; // 媒体URLs
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  createTime: string;
  updateTime: string;
};


/**
 * @description 文章列表
 */
export type ArticleList = ArticleCard[];

/**
 * @description 新增文章数据接口
 * @param title 标题
 * @param content 内容
 * @param channelId 频道ID
 * @param images 图片
 */
export type ArticleAdd = {
  channelId: number;
  title: string;
  images: File[] | null;
  content: string;
}

export type ArticleDetail = {
  id: number;
  title: string;
  content: string;
  mediaType: number | null; // 媒体类型：NULL=无；1=图片；2=视频
  likeCount: number;
  collectCount: number;
  commentCount: number;
  viewCount: number;
  mediaUrls: string[]; // 媒体URLs
  isLiked: boolean; // 是否点赞
  createTime: string;
  updateTime: string;
  user: {
    id: number;
    nickname: string;
    image: string | null;
  };
  channel: {
    id: number;
    channelname: string;
  };
}