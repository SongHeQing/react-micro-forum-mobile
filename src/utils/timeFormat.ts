/**时间格式化*/

export function formatRelativeTime(date: string | Date): string {
  if (!date) return "--";

  const now = Date.now(); // 当前时间戳（毫秒）
  const created = new Date(date).getTime(); // 文章创建时间戳

  const diff = Math.floor((now - created) / 1000); // 秒差值

  if (diff < 10) return "刚刚";
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 31536000) {
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getDate()}`;
  }
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
