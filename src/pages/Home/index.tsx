import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getArticleList } from "@/apis/articleApi";
import type { Article } from "@/types";
import Card from "@/components/Card";
import TabBar from '@/pages/Home/components/TabBar';
import { PullToRefresh } from "antd-mobile";

const DESIGN_WIDTH = 1260;
function vw(px: number) {
  return (px / DESIGN_WIDTH) * window.innerWidth;
}

const Home = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  useEffect(() => {
    getArticleList().then((res) => {
      setArticleList(res);
    });
  }, []);

  const onRefresh = async () => {
    await getArticleList().then((res) => {
      setArticleList(res);
    });

    return Promise.resolve();
  };

  return (

    <div className={styles.home}>
      <PullToRefresh onRefresh={onRefresh}
        threshold={vw(321)}
      >
        {/* 动态渲染文章卡片 */}
        {articleList.length > 0 ? (
          articleList.map((article, index) => (
            <Card key={article.id || index} article={article} />
          ))
        ) : (
          <div>暂无文章</div>
        )}
      </PullToRefresh>
      <TabBar />
    </div>
  );
};

export default Home;