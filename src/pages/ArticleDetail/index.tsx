// src/pages/ArticleDetail/index.tsx  
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";
import { getArticleDetail, toggleLike } from "@/apis/articleApi";
import type { ArticleDetail } from "@/types/Article";
import defaultAvatar from "@/assets/默认用户头像.jpg";
import defaultChannel from "@/assets/默认频道图片.jpg";
import { ImageViewer, Toast } from "antd-mobile";
import { useClickAnimation } from "@/hooks/useClickAnimation";
import clsx from "clsx";
import CommentList from "./components/CommentList";
import BottomBar from "./components/BottomBar";
import type { CommentVO } from "@/types";
import { fetchTopLevelComments } from "@/apis/commentApi";
import { formatRelativeTime } from "@/utils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DESIGN_WIDTH = 1260;
const DESIGN_HEIGHT = 1260;

function vw(px: number) {
  return (px / DESIGN_WIDTH) * window.innerWidth;
}
function vh(px: number) {
  return (px / DESIGN_HEIGHT) * window.innerHeight * 0.65;
}
function rfs(px: number, min = 0) {
  return Math.max(min, Math.min(vw(px), vh(px)));
}


const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail>();

  // 吸顶检测相关ref和state
  // const headerRef = useRef<HTMLDivElement>(null);
  const commentTitleRef = useRef<HTMLDivElement>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isCommentTitleSticky, setIsCommentTitleSticky] = useState(false);

  useEffect(() => {
    if (id) {
      getArticleDetail(Number(id)).then(setArticle);
    }
  }, [id]);
  // 文章内容段落分割
  const content = useMemo(() => {
    if (!article || !article.content) return '';
    return article.content.split('\n').map((line, i) => <p key={i}>{line}</p>)
  }, [article]);

  /**距离检测吸顶*/
  useEffect(() => {
    // 初次渲染后的评论标题距离视口x轴的距离
    let commentTitleTopInitial;
    // 检查默认的Effect能不能检测到初次渲染后的评论标题距离视口x轴的距离
    // console.log(commentTitleRef.current?.getBoundingClientRect().top);
    const handleScroll = () => {
      // if (headerRef.current) {
      //   setIsHeaderSticky(headerRef.current.getBoundingClientRect().top <= 0);
      // }
      // 评论标题元素距离视口x轴的距离小于初次渲染后的评论标题距离视口x轴的距离时吸顶
      if (!commentTitleTopInitial) {
        commentTitleTopInitial = commentTitleRef.current?.getBoundingClientRect().top;
      }
      if (commentTitleRef.current && commentTitleTopInitial) {
        setIsHeaderSticky(commentTitleRef.current.getBoundingClientRect().top < commentTitleTopInitial);
      }
      // 评论标题元素距离视口x轴的距离小于或等于155px(第一个吸顶元素的高度)时吸顶
      if (commentTitleRef.current) {
        setIsCommentTitleSticky(commentTitleRef.current.getBoundingClientRect().top <= rfs(155));
      }
    };
    window.addEventListener("scroll", handleScroll);
    // 初始检测一次
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**图片排序*/
  const sortedImagesUrl = useMemo(() => {
    // 判断是否为数组且媒体类型为图片
    if (!Array.isArray(article?.mediaUrls) || article?.mediaType !== 1) return [];
    // 为每个图片URL添加BASE_URL
    const sortedImagesUrl = article?.mediaUrls.map(imgUrl => BASE_URL + imgUrl);
    // 返回排序后的图片数组
    return sortedImagesUrl;
  }, [article?.mediaUrls, article?.mediaType]);

  /**使用自定义Hook管理点赞图标点击动画*/
  const { getModuleAnimationClassName: getModuleAnimationClassNameLikeIcon, triggerAnimation: triggerAnimationLikeIcon } = useClickAnimation({
    duration: 300
  });


  /**点赞事件*/
  const handleClickLike = async () => {
    if (!article) return;

    triggerAnimationLikeIcon(); // 触发动画

    const previousIsLiked = isLiked;
    const previousDisplayLikeCount = displayLikeCount;

    // 乐观更新 UI
    setIsLiked(!previousIsLiked);
    setDisplayLikeCount(previousIsLiked ? previousDisplayLikeCount - 1 : previousDisplayLikeCount + 1);

    try {
      await toggleLike(article.id);
      // 如果后端返回了新的计数，可以这里更新 displayLikeCount
      // 例如：const response = await toggleLike(article.id); setDisplayLikeCount(response.newLikeCount);
      // 但目前API返回void，所以依赖乐观更新
    } catch (error) {
      console.error("点赞/取消点赞失败", error);
      Toast.show({
        content: previousIsLiked ? '取消点赞失败' : '点赞失败',
        position: 'bottom',
      });
      // API调用失败，回滚 UI 状态
      setIsLiked(previousIsLiked);
      setDisplayLikeCount(previousDisplayLikeCount);
    }
  };


  /**使用自定义Hook管理关注按钮点击动画*/
  const { getModuleAnimationClassName: getModuleAnimationClassNameFollowBtn, triggerAnimation: triggerAnimationFollowBtn } = useClickAnimation({
    duration: 300
  });

  /**关注事件*/
  const handleClickFollow = () => {
    triggerAnimationFollowBtn();
  };

  /**使用自定义Hook管理分享按钮点击动画*/
  const { getModuleAnimationClassName: getModuleAnimationClassNameShareBtn, triggerAnimation: triggerAnimationShareBtn } = useClickAnimation({
    duration: 300
  });

  /**分享事件*/
  const handleClickShare = () => {
    triggerAnimationShareBtn();
  };


  /**时间格式化*/
  const timeInfo = useMemo(() => {
    return formatRelativeTime(article?.createTime || '');
  }, [article?.createTime]);

  // 管理点赞状态和数量，直接从 article prop 初始化
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [displayLikeCount, setDisplayLikeCount] = useState<number>(0);

  // 当文章数据加载完成时，初始化点赞状态
  useEffect(() => {
    if (article) {
      setIsLiked(article.isLiked);
      setDisplayLikeCount(article.likeCount);
    }
  }, [article]);

  // 根据文章表的评论数量判断是否存在评论
  const [hasComments, setHasComments] = useState(false)
  useEffect(() => {
    if (article?.commentCount) {
      setHasComments(article.commentCount > 0)
    }
  }, [article?.commentCount])

  const [comments, setComments] = useState<CommentVO[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // 获取一级评论列表
  const loadComments = async () => {
    if (!article || loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetchTopLevelComments({ articleId: article.id, page })
      setComments(prev => [...prev, ...res])
      setHasMore(res.length === 15)
      setPage(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  // 评论发送成功回调
  const handleSendSuccess = async () => {
    setHasComments(true)
  }

  if (!article) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.articleDetailPage}>
      {/* 站位 position: fixed; */}
      <div style={{ height: rfs(155) }}></div>
      {/* 头部吸顶（用距离检测切换类名） */}
      <div
        // ref={headerRef} 
        className={clsx(styles.header
          , isHeaderSticky && !isCommentTitleSticky && styles.StickyActive
        )}>
        <div className={styles.back}
          onClick={() => window.history.back()}>
          <svg className={styles.backIcon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4385" ><path d="M376.235 512l356.382-356.382c15.621-15.621 15.621-40.948 0-56.568-15.621-15.621-40.947-15.621-56.568 0L291.383 483.716c-15.621 15.621-15.621 40.947 0 56.568L676.049 924.95c15.621 15.621 40.947 15.621 56.568 0s15.621-40.947 0-56.568L376.235 512z" p-id="4386"></path></svg>
        </div>
        <div className={styles.channel}>
          {/* src\assets\默认用户头像.jpg */}
          {/* src\pages\ArticleDetail\index.tsx */}
          <img className={styles.channelImg} src={defaultChannel} alt="channel" loading="lazy" />
          <span className={styles.channelName}>{article.channel.channelname}</span>
          <svg className={styles.channelIcon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4873" ><path d="M647.765 512L291.383 155.618c-15.621-15.621-15.621-40.948 0-56.568 15.621-15.621 40.947-15.621 56.568 0l384.666 384.666c15.621 15.621 15.621 40.947 0 56.568L347.951 924.95c-15.621 15.621-40.947 15.621-56.568 0s-15.621-40.947 0-56.568L647.765 512z" p-id="4874"></path></svg>
        </div>
      </div>
      {/* 文章卡片 */}
      <div
        className={styles.articleCard}>
        {/* 用户信息 */}
        <div className={styles.userInfo}>
          {/* 头像 */}
          <img className={styles.avatar} src={article.user.image || defaultAvatar} alt="avatar" loading="lazy" />
          {/* 用户信息 */}
          <div className={styles.userInfoBox}>
            {/* 用户信息top */}
            {/* 昵称、等级、楼主标签 */}
            <div className={styles.userMeta}>
              <span className={styles.nickname}>{article.user.nickname}</span>
              {/* <span className={styles.level}>Lv.{article.user.level}</span> */}
              {/* <span className={styles.authorTag}>楼主</span> */}
            </div>
            {/* 用户信息bottom */}
            <span className={styles.time}>{timeInfo}</span>
          </div>
          {/* 关注按钮 */}
          <div className={getModuleAnimationClassNameFollowBtn(styles.followBtn, styles.iconAnimate)} onClick={handleClickFollow}>关注</div>
        </div>
        {/* 标题 */}
        <div className={styles.title}>{article.title}</div>
        {/* 内容 */}
        <div className={styles.content}>{content}</div>
        {/* 图片 */}
        {Array.isArray(article.mediaUrls) && article.mediaUrls.length > 0 && article.mediaType === 1 && (
          <div className={styles.images}>
            {sortedImagesUrl.map(imgUrl => (
              <div className={styles.imageItem} key={imgUrl}>
                <div className={styles.imageBox} key={imgUrl}>
                  <img key={imgUrl}
                    src={imgUrl}
                    onClick={() => ImageViewer.Multi.show({
                      images: sortedImagesUrl,
                      defaultIndex: sortedImagesUrl.findIndex(image => image === imgUrl),
                    })}
                    alt="cover" loading="lazy" />
                  <div className={styles.imageMask}></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 互动 */}
        <div className={styles.cardFooter}>
          {/* 分享 */}
          <div className={styles.cardFooterItem} onClick={handleClickShare}>
            <svg className={getModuleAnimationClassNameShareBtn(styles.icon, styles.iconAnimate)}
              viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22241" ><path d="M791.188 623.375c-55.099 0-103.843 26.675-134.439 67.684L436.89 574.158c6.804-19.66 10.681-40.683 10.681-62.658 0-25.166-4.98-49.136-13.791-71.155l220.151-112.173c30.365 43.17 80.468 71.452 137.256 71.452 92.681 0 167.813-75.133 167.813-167.813C959 139.132 883.868 64 791.188 64s-167.813 75.132-167.813 167.813c0 7.291 0.622 14.421 1.524 21.467L388.838 373.56c-34.494-33.278-81.336-53.845-133.052-53.845C149.866 319.714 64 405.579 64 511.5c0 105.92 85.866 191.786 191.786 191.786 55.136 0 104.696-23.399 139.681-60.649l230.151 122.374c-1.343 8.551-2.243 17.249-2.243 26.177 0 92.68 75.133 167.813 167.813 167.813C883.868 959 959 883.867 959 791.188c0-92.681-75.132-167.813-167.812-167.813z m0-479.464c48.469 0 87.902 39.432 87.902 87.902s-39.432 87.902-87.902 87.902-87.902-39.433-87.902-87.902 39.432-87.902 87.902-87.902zM255.786 623.375c-61.688 0-111.875-50.187-111.875-111.875s50.187-111.875 111.875-111.875S367.661 449.812 367.661 511.5s-50.187 111.875-111.875 111.875z m535.402 255.714c-48.469 0-87.902-39.432-87.902-87.902s39.432-87.902 87.902-87.902 87.902 39.432 87.902 87.902-39.433 87.902-87.902 87.902z" fill="#333333" p-id="22242"></path></svg>
            <span className={styles.cardFooterItemText}>分享</span>
          </div>
          {/* 点赞 */}
          <div className={clsx(styles.cardFooterItem, {
            [styles.cardFooterItemLiked]: isLiked
          })} onClick={handleClickLike}>
            <svg
              className={getModuleAnimationClassNameLikeIcon(styles.icon, styles.iconAnimate)}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M795.769 342.896c-0.007 0 0.005 0 0 0H685.4c-0.849 0-1.489-0.69-1.262-1.508 4.144-14.865 21.546-84.656 4.471-153.887C668.02 104.026 601.913 64.003 542.469 64c-32.186-0.002-62.412 11.729-82.415 34.647-56.944 65.247-19.396 88.469-52.796 175.756-28.589 74.718-96.736 94.832-115.814 99.091l-5.188 1.037h-93.46c-70.692 0-128 57.308-128 128V816c0 70.692 57.308 128 128 128h511.09c88.992 0 166.321-61.153 186.831-147.751l60.745-256.479c23.799-100.487-52.431-196.874-155.693-196.874zM144.795 816V502.531c0-26.467 21.532-48 48-48h48V864h-48c-26.468 0-48-21.533-48-48z m728.82-294.667l-60.746 256.479C800.851 828.559 756.034 864 703.885 864h-383.09V448.497c38.811-11.046 123.048-45.847 161.181-145.505 18.542-48.459 20.521-83.044 21.966-108.297 1.396-24.407 1.511-26.401 16.385-43.444 3.904-4.473 12.387-7.252 22.139-7.251 24.457 0.001 57.065 16.412 68.472 62.659 9.14 37.052 3.955 76.38-0.277 97.734-5.33 22.173-17.249 50.663-28.257 74.365-9.891 21.296 5.923 45.558 29.402 45.32l116.708-1.184h67.256c24.607 0 47.478 11.072 62.745 30.379 15.267 19.308 20.771 44.115 15.1 68.06z" ></path>
            </svg>
            <span className={styles.cardFooterItemText}>
              {displayLikeCount}
            </span>
          </div>
        </div>
      </div>
      {/* 评论区 */}
      <div className={styles.commentSection}>
        {/* 评论区标题吸顶（用距离检测切换类名） */}
        <div ref={commentTitleRef} className={clsx(styles.commentTitle, isCommentTitleSticky && styles.StickyActive)}>
          <div className={styles.commentViewFilter}>
            <span className={clsx(styles.commentViewFilterItem, styles.active)}>全部回复</span>
            <span className={styles.commentViewFilterItem}>楼主回复</span>
          </div>
          {/* 评论显示模式 */}
          <div className={styles.commentMode}>
            <div className={styles.commentModeItem}>热门</div>
            <div className={clsx(styles.commentModeItem, styles.active)}>正序</div>
            <div className={styles.commentModeItem}>倒序</div>
          </div>
        </div>
        {/* 评论列表 */}
        {hasComments ? (
          <CommentList
            comments={comments}
            articleAuthorId={article.user.id}
            loadMore={loadComments}
            hasMore={hasMore}
            onViewAllReplies={(commentId) => {
              // TODO: 处理查看全部回复的逻辑
              console.log('查看全部回复:', commentId);
            }}
          />
        ) : (
          <div className={styles.empty}>暂无评论，快来发一条吧！</div>
        )}
      </div>
      {/* 底部输入栏 */} <BottomBar articleId={article.id} onSendSuccess={handleSendSuccess} />
    </div >
  );
};

export default ArticleDetail;