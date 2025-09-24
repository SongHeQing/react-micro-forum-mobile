import request from "@/utils/request";
import type { ArticleDetail, ArticleCardList } from "@/types";

/**
 * 获取文章列表
 * @param pageNumber 页码
 * @returns 文章列表
 */
export const getArticleList = (pageNumber: number): Promise<ArticleCardList> => {
  return request.get("/articles", { params: { pageNumber } })
}

// // 新增：添加文章
// export function addArticle(article: ArticleAdd) {
//   return request.post("/articles", article);
// }

/**
 * 添加文章
 * @param formData 表单数据
 * @returns 添加结果
 */
export function addArticle(formData: FormData) {
  return request.post("/articles", formData);
}

// // 获取文章详情
// export function getArticleDetail(id: number, type: null | number) {
//   return request.get(`/article/${id}/${type}`);
// }

/**
 * 获取文章详情
 * @param id 文章ID
 * @returns 文章详情
 */
export function getArticleDetail(id: number): Promise<ArticleDetail> {
  return request.get(`/articles/${id}`);
}

/**
 * 切换点赞
 * @param articleId 文章ID
 * @returns void 
 */
export function toggleLike(articleId: number): Promise<void> {
  return request.post(`/articles/${articleId}/toggleLike`);
}
/**
 * 查询文章点赞状态
 * @param articleId 文章ID
 * @returns 是否点赞
 */
export function isArticleLikedByUser(articleId: number): Promise<boolean> {
  return request.get(`/articles/${articleId}/likeStatus`);
}