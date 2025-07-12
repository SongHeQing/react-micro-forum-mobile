import type { ResType } from "@/types";
import type { LoginParams } from "@/types/user";
import request from "@/utils/request";


export function login(params: LoginParams): Promise<ResType<unknown>> {
  return request.get("/login", { params });
} 