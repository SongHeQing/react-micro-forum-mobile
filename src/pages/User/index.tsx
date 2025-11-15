import styles from "./index.module.scss";
import defaultAvatar from "@/assets/默认用户头像.jpg";
import { useNavigate } from "react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getUserArticles, getUserHome } from "@/apis/userApi";
import { UserHome } from "@/types/User";
import { ArticleUserCardList } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import { InfiniteScroll } from "antd-mobile";
import { rfs } from '@/utils/rfs';

const User = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'articles' | 'channels'>('articles');
  const [isScrolled, setIsScrolled] = useState(false); // 添加滚动状态
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user)
  // 判断路径id和redux中的id是否一致
  const isCurrentUser = user.userInfo.id === Number(id);
  const [userHome, setUserHome] = useState<UserHome | null>(null);

  // 计算账号创建的时长
  const calculateAccountAge = (createTime: string): string => {
    const created = new Date(createTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}天`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}个月`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years}年`;
    }
  };

  // 添加滚动事件监听
  useEffect(() => {
    const handleScroll = () => {
      // 设置触发颜色变化的滚动距离，例如 100px
      if (window.scrollY > rfs(256)) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);

    // 清理函数，组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    getUserHome(Number(id)).then(setUserHome)
  }, [id]);

  const [articleList, setArticleList] = useState<ArticleUserCardList>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * @description 获取文章列表
   */
  const getArticleUserListFn = async () => {
    const res = await getUserArticles(Number(id), pageNumber)
    if (res.length > 0) {
      setArticleList([...articleList, ...res]);
      setPageNumber(pageNumber + 1);
    } else {
      setHasMore(false);
    }
  };

  /**
 * @description 上拉加载
 */
  const loadMore = async () => {
    await getArticleUserListFn();
  };

  return (
    <div className={styles.profile}>
      {/* 上固定栏 */}
      <div className={clsx(styles.topBar, { [styles.scrolled]: isScrolled })}>
        <svg className={styles.back} onClick={() => navigate(-1)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4447"><path d="M376.235 512l356.382-356.382c15.621-15.621 15.621-40.948 0-56.568-15.621-15.621-40.947-15.621-56.568 0L291.383 483.716c-15.621 15.621-15.621 40.947 0 56.568L676.049 924.95c15.621 15.621 40.947 15.621 56.568 0s15.621-40.947 0-56.568L376.235 512z" p-id="4448"></path></svg>
      </div>
      {/* 背景 */}
      <div className={styles.background}></div>
      {/* 用户信息 */}
      <div>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img src={defaultAvatar} alt="" />
          </div>
          {/* 交互、如果是自己的账户则显示编辑资料、如果是别人的账户则显示关注和私信 */}
          <div className={styles.actions}>
            {isCurrentUser ? (
              <div className={styles.editProfile}>编辑资料</div>
            ) : (
              <div className={styles.userActions}>
                <div className={styles.follow}>
                  <svg className={styles.icon} viewBox="0 0 28 28" fill="none" >
                    <path d="M14 5V23" strokeWidth="4" strokeLinecap="round" />
                    <path d="M5 14H23" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <span>关注</span>
                </div>
                <div className={styles.message}>
                  <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1413" width="200" height="200">
                    <path d="M778.0352 888.6272h-507.904c-94.6176 0-171.6224-75.9808-171.6224-169.5744V371.712c0-46.8992 17.6128-90.9312 49.7664-123.904 32.3584-33.1776 75.5712-51.6096 121.856-51.6096h507.904c46.08 0 89.4976 18.2272 121.856 51.6096 32.1536 32.9728 49.7664 77.0048 49.7664 123.904v347.3408c0 93.3888-77.0048 169.5744-171.6224 169.5744z m-507.904-635.0848c-62.8736 0-114.2784 53.0432-114.2784 118.1696v347.3408c0 61.8496 51.2 112.2304 114.2784 112.2304h507.904c62.8736 0 114.2784-50.3808 114.2784-112.2304V371.712c0-65.1264-51.2-118.1696-114.2784-118.1696h-507.904z" p-id="1414"></path>
                    <path d="M754.2784 409.3952c-5.9392-11.8784-14.336-10.6496-26.2144-10.6496-5.9392 0-16.1792 5.3248-22.1184 7.168l-188.416 115.0976-170.5984-115.0976c-5.9392-3.8912-17.408-8.3968-23.3472-8.3968-13.9264 0-23.552-0.2048-29.4912 11.8784-11.8784 15.9744-3.8912 37.6832 13.9264 47.7184l186.5728 121.0368c5.9392 3.8912 11.8784 3.8912 17.8176 3.8912h11.8784c5.9392 0 11.8784-2.048 17.8176-3.8912l198.4512-121.0368c17.6128-10.0352 23.552-29.9008 13.7216-47.7184" p-id="1415"></path>
                  </svg>
                  <span>私信</span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.nickname}>{userHome?.nickname}</div>
          {/* 用户id和创建时间 */}
          <div className={styles.userIdAndCreateTime}>
            <div className={styles.userId}>ID {id}</div>
            <svg className={styles.icon} viewBox="0 0 28 28" fill="none">
              <path d="M14 4V24" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {/* 账号创建的时长 */}
            <div className={styles.createTime}>{"区龄 "}{userHome && calculateAccountAge(userHome.createTime)}</div>
          </div>
          {/* 个人简介 */}
          <div className={styles.introduction}>个人简介</div>
          {/* 获赞、关注量、粉丝 */}
          <div className={styles.userStats}>
            <div><span>{userHome?.likeCount}</span>获赞</div>
            <div><span>{userHome?.followCount}</span>关注</div>
            <div><span>{userHome?.fansCount}</span>粉丝</div>
          </div>
        </div>
      </div>
      {/* tabs 文章、关注的频道 */}
      <div className={styles.tabs}>
        <div
          className={clsx({
            [styles.active]: activeTab === 'articles'
          })}
          onClick={() => setActiveTab('articles')}
        >
          文章 {userHome?.articleSendCount}
        </div>
        <div
          className={clsx({
            [styles.active]: activeTab === 'channels'
          })}
          onClick={() => setActiveTab('channels')}
        >
          关注的频道 {userHome?.channelFollowCount}
        </div>
      </div>

      {/* 内容 文章、关注的频道 */}
      <div className={styles.content}>
        {activeTab === 'articles' ? (
          <>
            {articleList.length > 0 && (
              articleList.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} />
              )))}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          </>
        ) : (
          <div className={styles.channelsContent}>
            关注的频道内容区域
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
