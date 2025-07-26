import type { ResType } from "@/types";
import type { LoginInfo, LoginParams, RegisterParams } from "@/types/User";
import request from "@/utils/request";


export function login(params: LoginParams): Promise<LoginInfo> {
  return request.get<unknown, LoginInfo>("/user/login", { params });
}

export function register(params: RegisterParams) {
  return request.post("/user/register", params);
}
/**
 * 验证注册验证码
 * @param params 注册参数
 * @param code 验证码
 * @returns 验证结果
 */
export function verifyRegisterCode(params: RegisterParams, code: string): Promise<ResType<null>> {
  return request.post("/user/verifyRegisterCode", params, { params: { code } })
}
