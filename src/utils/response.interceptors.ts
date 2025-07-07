import type { AxiosError, AxiosResponse } from 'axios';
import type { ResType } from '@/types/api';


/**
 * 响应拦截器配置
 */
export const responseInterceptors = {
  // 响应成功拦截器
  onFulfilled: function <T>(response: AxiosResponse<ResType<T>>): Promise<T | AxiosResponse<ResType<T>>> {
    // 检查是否需要跳过拦截器
    if (response.config.skipInterceptor) {
      return Promise.resolve(response);
    }

    // 普通请求处理
    const { code, message, data } = response.data;
    if (code !== 200) {
      return Promise.reject(new Error(message));
    }

    if (data === null || data === undefined) {
      return Promise.reject(new Error('返回数据为空'));
    }
    return Promise.resolve(data);
  },

  // 响应错误拦截器
  onRejected: (error: AxiosError) => {
    // 对响应错误做点什么
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          // 可以在这里添加路由跳转逻辑
          break;
        case 403:
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${(data as Record<string, unknown>)?.message as string || error.message}`);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
};