import type { LoginInfo, LoginParams } from "@/types/user";
import request from "@/utils/request";


export function login(params: LoginParams): Promise<LoginInfo> {
  return request.get<unknown, LoginInfo>("/login", { params });
} 