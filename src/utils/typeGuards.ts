import type { ErrorResponseType } from '@/types/Api';

type ErrorLike = {
  code?: unknown;
  message?: unknown;
  fieldErrors?: unknown;
};
/**
 * 判断是否是400表单验证错误响应类型
 * @param error 错误对象
 * @returns 是否是错误响应类型
 */
export function isfieldErrorsResponseType(error: unknown): error is ErrorResponseType {
  if (typeof error === 'object' && error !== null) {
    const e = error as ErrorLike;
    return (
      typeof e.code === 'number' &&
      typeof e.message === 'string' &&
      typeof e.fieldErrors === 'object'
    );
  }
  return false;
}

export function isErrorMessageResponseType(error: unknown): error is ErrorResponseType {
  if (typeof error === 'object' && error !== null) {
    const e = error as ErrorLike;
    return typeof e.message === 'string';
  }
  return false;
} 