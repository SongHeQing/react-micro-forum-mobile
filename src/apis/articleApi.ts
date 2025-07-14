import request from "@/utils/request";
import type { ArticleList, ArticleAdd } from "@/types";

export const getArticleList = (pageNumber: number): Promise<ArticleList> => {
  return request.get<unknown, ArticleList>(`/articles?pageNumber=${pageNumber}`)
}

// 新增：添加文章
export function addArticle(article: ArticleAdd) {
  return request.post("/articles", article);
}

// 获取文章详情
export function getArticleDetail(id: number, type: null | number) {
  return request.get(`/article/${id}/${type}`);
}

// 你可以在这里继续添加其他文章相关API
