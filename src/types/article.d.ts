// 文章相关类型定义

export type Article = {
  id: number;
  userId: number;
  title: string;
  contentPreview: string;
  image?: string | null;
  createTime: string;
  updateTime: string;
};

export type ArticleList = Article[];