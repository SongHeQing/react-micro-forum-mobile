// 1. 定义泛型

export type ResType<T> = {
  code: number
  message: string
  data?: T | null;
}
