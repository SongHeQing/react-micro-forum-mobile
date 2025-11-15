import clsx from "clsx";
import styles from "./index.module.scss";
import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { InfiniteScroll } from "antd-mobile";
import { getArticlesByChannelId } from "@/apis/articleApi";
import { ArticleUserCardList } from "@/types";

const DragDownPanel = ({ channelId }: { channelId: number }) => {
  const tabs = ["精华", "最新"]
  const [activeTab, setActiveTab] = useState(1);

  const btns = ["回复", "发布"]
  const [activeBtn, setActiveBtn] = useState(0);

  const [articleList, setArticleList] = useState<ArticleUserCardList>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("");

  /**
   * @description 获取文章列表
   */
  const getArticleListFn = async () => {
    const res = await getArticlesByChannelId({ channelId, pageNumber, sort })
    if (res.length > 0) {
      setArticleList([...articleList, ...res]);
      setPageNumber(pageNumber + 1);
      console.log(res.map(item => item.createTime))
      console.log(res.map(item => item.lastReplyTime))
    } else {
      setHasMore(false);
    }
  };

  return (
    <div className={styles.dragDownPanel}>
      {/* 拖拽手柄 */}
      <div className={styles.header}>
        <div className={styles.bar}></div>
      </div>
      {/* 标签栏 */}
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <div
            className={clsx(styles.tab,
              { [styles.active]: index === activeTab })}
            key={index}
            onClick={() =>
              setActiveTab(index)
            }>{tab}</div>
        ))}
      </div>
      {/* 排序 */}
      <div className={styles.sort}>
        {/* 排序说明 */}
        <div className={styles.sortInfo}>看贴顺序</div>
        <div className={styles.sortBtn}>
          {btns.map((btn, index) => (
            <div
              className={clsx(styles.sortBtnItem,
                { [styles.active]: activeBtn === index })}
              key={index}
              onClick={() => {
                // 更新ui
                setActiveBtn(index)
                if (btns[activeBtn] === btn) return
                if (btn === '发布') { setSort('create_time') }
                if (btn === '回复') { setSort('') }
                setArticleList([]);
                setPageNumber(1)
                // 自动发起新的排序请求，不能依赖此次事件更新的state，不让事件直接发起请求，而是让state触发
                setHasMore(true)
              }}>
              {btn}
            </div>
          ))}
        </div>
      </div>
      {/* 内容 */}
      <div className={styles.content}>
        {/* 动态渲染文章卡片 */}
        {articleList.length > 0 && (
          articleList.map((article, index) => (
            <ArticleCard key={article.id || index} article={article} isChannelCard={true} />
          ))
        )}
        <InfiniteScroll loadMore={getArticleListFn} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default DragDownPanel