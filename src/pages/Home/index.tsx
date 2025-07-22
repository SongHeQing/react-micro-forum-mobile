import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getArticleList } from "@/apis/articleApi";
import type { ArticleItem } from "@/types";
import Card from "@/components/Card";
import TabBar from '@/pages/Home/components/TabBar';
import { InfiniteScroll, PullToRefresh } from "antd-mobile";

const DESIGN_WIDTH = 1260;
const DESIGN_HEIGHT = 1260;

function vw(px: number) {
  return (px / DESIGN_WIDTH) * window.innerWidth;
}
function vh(px: number) {
  return (px / DESIGN_HEIGHT) * window.innerHeight;
}
function rfs(px: number, min = 0) {
  return Math.max(min, Math.min(vw(px), vh(px)));
}

const Home = () => {
  const [articleList, setArticleList] = useState<ArticleItem[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * @description 上拉加载
   */
  const loadMore = async () => {
    await getArticleListFn(pageNumber);
  };

  /**
   * @description 获取文章列表
   */
  const getArticleListFn = async (pageNumber: number) => {
    const res = await getArticleList(pageNumber)
    if (res.length > 0) {
      setArticleList([...articleList, ...res]);
      setPageNumber(pageNumber + 1);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    // getArticleList(1).then((res) => {
    //   setArticleList(res);
    //   setPageNumber(2);
    // });
  }, [])

  /**
   * @description 下拉刷新
   */
  const onRefresh = async () => {
    await getArticleListFn(pageNumber)
  };

  return (

    <div className={styles.home}>
      <PullToRefresh onRefresh={onRefresh}
        threshold={rfs(321)}
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
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      <TabBar />
    </div>
  );
};

export default Home;