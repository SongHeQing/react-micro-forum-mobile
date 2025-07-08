import request from "@/utils/request";
import type { ArticleList, ArticleAdd } from "@/types";

export const getArticleList = (): Promise<ArticleList> => {
  return request.get<unknown, ArticleList>('/articles')
}

// 新增：添加文章
export function addArticle(article: ArticleAdd) {
  return request.post("/articles", article);
}
