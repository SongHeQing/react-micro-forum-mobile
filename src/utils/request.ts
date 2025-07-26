import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { requestInterceptors } from './request.interceptors';
import { responseInterceptors } from './response.interceptors';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础URL
  timeout: 10000, // 请求超时时间
});


// 请求拦截器（返回拦截器ID，用于按需移除）
const requestInterceptorId = request.interceptors.request.use(
  requestInterceptors.onFulfilled,
  requestInterceptors.onRejected
);

// 响应拦截器（返回拦截器ID，用于按需移除）
const responseInterceptorId = request.interceptors.response.use(
  responseInterceptors.onFulfilled,
  responseInterceptors.onRejected
);
export { requestInterceptorId, responseInterceptorId };
export default request;