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

// 新增文章时用的类型
export type ArticleAdd = {
  title: string;
  contentPreview?: string;
  image?: string | null;
};

