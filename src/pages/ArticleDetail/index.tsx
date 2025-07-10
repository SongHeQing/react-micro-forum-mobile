import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";
import { getArticleDetail } from "@/apis/articleApi";
import type { Article } from "@/types";

const ArticleDetail = () => {
  const { id, type } = useParams<{ id: string; type?: string }>();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (id && type) {
      getArticleDetail(Number(id), Number(type)).then(res => setArticle(res.data));
    }
  }, [id, type]);

  if (!article) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.detailWrapper}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.meta}>
        {/* <span>作者：{article.author || "匿名"}</span>
        <span>频道：{article.channelName || "无"}</span> */}
        <span>时间：{article.createTime || "--"}</span>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.contentPreview }}
      />
    </div>
  );
};

export default ArticleDetail;