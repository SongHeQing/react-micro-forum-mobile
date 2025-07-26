
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
 * @description 文章图片
 */
export type ImageDTO = {
  imageUrl: string;
  orderNum: number;
};

/**
 * @description 单篇文章卡片
 */
export type ArticleCard = {
  id: number;
  channelCard: ChannelCard;
  title: string;
  contentPreview: string;
  coverImageUrl: ImageDTO[];
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
  userId: number;
  channelId: number;
  title: string;
  content: string;
  coverImageUrl: ImageDTO[];
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