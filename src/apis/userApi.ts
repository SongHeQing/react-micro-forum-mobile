import { ArticleUserCardList } from "@/types";
import type { LoginInfo, LoginParams, RegisterParams, UserHome, UserProfile } from "@/types/User";
import request from "@/utils/request";

/**
 * 登录
 * @param params 登录参数
 * @returns 登录信息
 */
export function login(params: LoginParams): Promise<LoginInfo> {
  return request.post("/user/login", params);
}

/**
 * 注册
 * @param params 注册参数
 * @returns 注册结果
 */
export function register(params: RegisterParams) {
  return request.post("/user/register", params);
}
/**
 * 验证注册验证码
 * @param params 注册参数
 * @param code 验证码
 * @returns 验证结果
 */
export function verifyRegisterCode(params: RegisterParams, code: string): Promise<null> {
  return request.post("/user/verifyRegisterCode", params, { params: { code } });
}


/**
 * 获取用户个人资料
 */
export function getUserProfile(): Promise<UserProfile> {
  return request.get<unknown, UserProfile>("/user/profile");
}

/**
 * 获取指定用户主页信息
 * @param userId 用户ID
 * @returns 用户主页信息
 */
export function getUserHome(userId: number): Promise<UserHome> {
  return request.get(`/user/${userId}/home`);
}

/**
 * 获取指定用户的文章列表
 * @param userId 用户ID
 * @param pageNumber 页码
 * @returns 用户的文章列表
 */
export function getUserArticles(userId: number, pageNumber: number): Promise<ArticleUserCardList> {
  return request.get(`/articles/user/${userId}`, {
    params: { pageNumber }
  });
}
