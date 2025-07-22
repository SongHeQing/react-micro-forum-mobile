// 文章相关类型定义

/**
 * @description 图片
 * @param imageUrl 图片URL
 * @param orderNum 图片顺序
 */
export type ImageDTO = {
  imageUrl: string;
  orderNum: number;
};

/**
 * @description 文章
 * @param id 文章ID
 * @param userId 用户ID
 * @param channelId 频道ID
 * @param title 标题
 * @param contentPreview 内容预览
 * @param coverImageUrl 封面图片
 * @param createTime 创建时间
 */
export type ArticleItem = {
  id: number;
  userId: number;
  channelId: number;
  title: string;
  contentPreview: string;
  coverImageUrl: ImageDTO[];
  createTime: string;
  updateTime: string;
};

/**
 * @description 文章列表
 */
export type ArticleList = ArticleItem[];

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