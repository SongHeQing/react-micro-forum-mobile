import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
/**
 * 请求拦截器配置
 */
export const requestInterceptors: {
  onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  onRejected: (error: AxiosError) => Promise<never>;
} = {

  // 请求成功拦截器
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },

  // 请求错误拦截器
  onRejected: (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
};

/**
 * 响应拦截器配置
 * 可以在这里继续添加响应拦截器逻辑
 */
export const responseInterceptors = {
  // 可以添加响应拦截器实现
};