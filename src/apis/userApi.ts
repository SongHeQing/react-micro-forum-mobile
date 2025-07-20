import type { LoginInfo, LoginParams, RegisterParams } from "@/types/user";
import request from "@/utils/request";


export function login(params: LoginParams): Promise<LoginInfo> {
  return request.get<unknown, LoginInfo>("/user/login", { params });
}



export function register(params: RegisterParams) {
  return request.post("/user/register", params);
}

export function verifyRegisterCode(params: RegisterParams, code: string) {
  return request.post("/user/verifyRegisterCode", params, { params: { code } })
}
