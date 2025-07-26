// 定义接口返回类型

// 响应体
export type ResType<T> = {
  code: number
  message: string
  data?: T | null;
}

// 错误信息
// 响应字段说明：
// 字段	类型	说明	示例
// code	number	HTTP状态码	400
// message	string	通用错误消息	"参数校验失败"
// fieldErrors	object	字段错误信息	{title: "文章标题不能为空"}
// errorCount	number	错误数量	3
/**
 * 400表单验证错误响应类型
 */
export type ErrorResponseType = {
  code: number
  message: string
  fieldErrors: Record<string, string>
  errorCount: number
}