import { request } from "@/utils";
import type { ArticleList } from "@/types/article";

export const getArticleList = (): Promise<ArticleList> => {
  return request.get<unknown, ArticleList>('/articles')
}
