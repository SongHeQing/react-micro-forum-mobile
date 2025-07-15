// 文章相关类型定义

export type Article = {
  id: number;
  userId: number;
  title: string;
  type: null | number
  contentPreview: string;
  image?: string | null | string[];
  createTime: string;
  updateTime: string;
};

export type ArticleList = Article[];

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