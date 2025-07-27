import request from "@/utils/request";
import type { ArticleDetail, ArticleList } from "@/types";

export const getArticleList = (pageNumber: number): Promise<ArticleList> => {
  return request.get("/articles", { params: { pageNumber } })
}

// // 新增：添加文章
// export function addArticle(article: ArticleAdd) {
//   return request.post("/articles", article);
// }

// 新增：添加文章
export function addArticle(formData: FormData) {
  return request.post("/articles", formData);
}

// // 获取文章详情
// export function getArticleDetail(id: number, type: null | number) {
//   return request.get(`/article/${id}/${type}`);
// }

// 获取文章详情
export function getArticleDetail(id: number): Promise<ArticleDetail> {
  return request.get(`/articles/${id}`);
}

// 文章点赞
export function toggleLike(articleId: number): Promise<void> {
  return request.post(`/articles/${articleId}/toggleLike`);
}

// 查询文章点赞状态
export function isArticleLikedByUser(articleId: number): Promise<boolean> {
  return request.get(`/articles/${articleId}/likeStatus`);
}


// 你可以在这里继续添加其他文章相关API
