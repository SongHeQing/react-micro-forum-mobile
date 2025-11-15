// src/pages/ArticleDetail/index.tsx  
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./index.module.scss";
import { getArticleDetail, toggleLike } from "@/apis/articleApi";
import type { ArticleDetail } from "@/types/Article";
import defaultAvatar from "@/assets/默认用户头像.jpg";
import defaultChannel from "@/assets/默认频道图片.jpg";
import { ImageViewer, Toast } from "antd-mobile";
import { useClickAnimation } from "@/hooks/useClickAnimation";
import clsx from "clsx";
import BottomBar from "./components/BottomBar";
import DragDownPopup from "./components/DragDownPanel";
import CommentCard from "./components/CommentCard";
import { DotLoading, InfiniteScroll } from 'antd-mobile';
import type { CommentReplyVO, CommentVO } from "@/types";
import { fetchCommentReplies, fetchTopLevelComments } from "@/apis/commentApi";
import { formatRelativeTime } from "@/utils";
import useScrollToHash from "@/hooks/useScrollToHash";
import { throttle } from "@/utils"; // 添加节流函数导入
import { rfs } from '@/utils/rfs';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail>();
  const navigate = useNavigate();

  // 吸顶检测相关ref和state
  const headerRef = useRef<HTMLDivElement>(null);
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
    // 使用节流优化滚动事件处理
    const handleScroll = throttle(() => {
      // 使用window.scrollY检测页面滚动位置，性能更好
      setIsHeaderSticky(window.scrollY > 0);

      // 评论标题元素距离视口x轴的距离小于或等于155px(第一个吸顶元素的高度)时吸顶
      if (commentTitleRef.current) {
        setIsCommentTitleSticky(commentTitleRef.current.getBoundingClientRect().top <= rfs(156));
      }
    }, 16); // 约60fps

    window.addEventListener("scroll", handleScroll);
    // 初始检测一次
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // 清除节流函数的定时器
      handleScroll.cancel();
    };
  }, []);

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
  const loadComments = useCallback(async () => {
    if (!article || loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetchTopLevelComments({ articleId: article.id, page })
      // setComments(prev => [...prev, ...res])
      // 如果返回的评论id虚拟回显已经在replies回显了，就不添加
      setComments(prev => {
        // 创建一个现有回复ID的集合，用于快速查找
        const existingIds = new Set(prev.map(reply => reply.id));
        // 过滤出新的回复（不在现有回复列表中的）
        const newRes = res.filter(reply => !existingIds.has(reply.id));
        // 只添加新的回复
        return [...prev, ...newRes];
      })
      setHasMore(res.length === 15)
      setPage(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }, [article, loading, hasMore, page])

  // 锚点跳转钩子
  const { scrollToElement } = useScrollToHash();
  // 是否滚动过
  const scrolledRef = useRef<boolean>(false);

  // 创建一个可以直接滚动到指定元素ID的函数
  const scrollToElementById = useCallback((elementId: string) => {
    const tryScroll = (retries = 10) => {
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        console.log(`找到ID为 ${elementId} 的元素:`, targetElement);
        requestAnimationFrame(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      } else if (retries > 0) {
        // 如果没找到元素，延迟后重试
        console.log(`未找到ID为 ${elementId} 的元素，${retries} 次重试机会`);
        setTimeout(() => tryScroll(retries - 1), 50);
      } else {
        console.log(`无法找到ID为 ${elementId} 的元素，即使经过多次重试`);
      }
    };

    tryScroll();
  }, []);

  useEffect(() => {
    // 检查是否需要锚点跳转，以及是否已对当前文章滚动过
    if (location.hash !== '#comment-section' || !article || scrolledRef.current) {
      return;
    }

    // 如果评论区没有评论，或者评论已经加载过，则直接锚点跳转
    if (article && article.commentCount === 0) {
      console.log('没有评论，直接锚点跳转');
      scrolledRef.current = true;
      scrollToElement();
    }

    // 如果文章有评论但还没加载，则手动触发 InfiniteScroll 加载
    if (article.commentCount > 0) {
      console.log('文章有评论但尚未加载，手动触发 InfiniteScroll');
      scrolledRef.current = true;
      // 异步加载评论
      loadComments().then(() => {
        // 滚动到评论区域
        scrollToElement();
      });
    }
  }, [article, scrollToElement, loadComments]);

  // 添加BottomBar输入状态控制
  const [isBottomBarActive, setIsBottomBarActive] = useState(false);
  const [CommentTarget, setCommentTarget] = useState<CommentVO | null>(null);

  // 评论发送成功回调
  const handleSendSuccess = async (comment: CommentVO) => {
    // 重新加载评论列表
    // await loadComments();

    // 如果hasComments为false，则不进行乐观更新评论UI，直接改变hasComments状态
    if (!hasComments) {
      setHasComments(true);
    } else {
      // 乐观更新评论UI
      // 判断是发送一级评论还是回复一级评论
      if (CommentTarget) {
        // 如果是回复一级评论，乐观更新评论UI，将评论回复数+1
        setComments(prev => prev.map(comment => comment.id === CommentTarget.id ? { ...comment, replyCount: comment.replyCount + 1 } : comment));
      } else {
        // 如果是发送一级评论，乐观更新评论UI，将评论添加到评论列表最前
        setComments(prev => [comment, ...prev]);
        // 使用js锚点滚动到新发送的评论
        scrollToElementById(`${comment.id}`);
      }
    }

    // 清除回复信息并关闭BottomBar
    setCommentTarget(null);
    setIsBottomBarActive(false);
  };

  // 添加回复列表弹窗状态管理
  const [showRepliesPopup, setShowRepliesPopup] = useState(false);
  const [pepliesPopupComment, setRepliesPopupComment] = useState<CommentVO | null>
    (null);
  const [repliesHasMore, setRepliesHasMore] = useState(true)
  const [replies, setReplies] = useState<CommentReplyVO[]>([])
  // 添加回复列表的分页状态
  const [repliesPage, setRepliesPage] = useState(1)
  const [replyTarget, setReplyTarget] = useState<CommentReplyVO | null>(null)

  // 处理查看所有回复
  const loadReplies = useCallback(async () => {
    // 简化条件检查，只保留必要的检查
    if (!pepliesPopupComment || !repliesHasMore) return;

    try {
      const res = await fetchCommentReplies({ parentId: pepliesPopupComment.id, page: repliesPage });
      // 如果返回的评论id虚拟回显已经在replies回显了，就不添加
      setReplies(prev => {
        // 创建一个现有回复ID的集合，用于快速查找
        const existingIds = new Set(prev.map(reply => reply.id));
        // 过滤出新的回复（不在现有回复列表中的）
        const newReplies = res.filter(reply => !existingIds.has(reply.id));
        // 只添加新的回复
        return [...prev, ...newReplies];
      })
      setRepliesHasMore(res.length === 15)
      setRepliesPage(prev => prev + 1)
    } catch (error) {
      // 添加错误处理
      console.error('获取回复列表失败:', error);
    }
  }, [pepliesPopupComment, repliesHasMore, repliesPage]);

  // 处理查看回复列表
  const handleViewReplies = useCallback((comment: CommentVO) => {
    setRepliesPopupComment(comment);
    setShowRepliesPopup(true);
    // 重置回复列表和分页状态
    setReplies([]);
    setRepliesPage(1);
    setRepliesHasMore(true);
  }, []);

  // 关闭回复列表弹窗
  const handleCloseRepliesPopup = useCallback(() => {
    setShowRepliesPopup(false);
    setRepliesPopupComment(null);
  }, []);

  // 处理回复发送成功
  const handleReplySendSuccess = useCallback((newReply: CommentReplyVO) => {
    // 将新回复添加到回复列表中
    setReplies(prev => [...prev, newReply]);

    // 打印发送成功添加评论
    console.log('发送成功添加评论：', newReply);

    // 更新原评论的回复数
    if (pepliesPopupComment) {
      setRepliesPopupComment(prev => prev ? {
        ...prev,
        replyCount: prev.replyCount + 1
      } : null);
    }

    // 同时更新主评论列表中的回复数
    setComments(prev => prev.map(comment =>
      comment.id === pepliesPopupComment?.id
        ? { ...comment, replyCount: comment.replyCount + 1 }
        : comment
    ));
  }, [pepliesPopupComment]);

  return (
    <div className={styles.articleDetailPage}>
      {/* 站位 position: fixed; */}
      <div
        ref={headerRef}
        style={{ height: rfs(155) }}></div>
      {/* 头部吸顶（用距离检测切换类名） */}
      <div
        className={clsx(styles.header
          , isHeaderSticky && !isCommentTitleSticky && styles.StickyActive
        )}>
        <div className={styles.back}
          onClick={() => window.history.back()}>
          <svg className={styles.backIcon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4385" ><path d="M376.235 512l356.382-356.382c15.621-15.621 15.621-40.948 0-56.568-15.621-15.621-40.947-15.621-56.568 0L291.383 483.716c-15.621 15.621-15.621 40.947 0 56.568L676.049 924.95c15.621 15.621 40.947 15.621 56.568 0s15.621-40.947 0-56.568L376.235 512z" p-id="4386"></path></svg>
        </div>
        <div className={styles.channel} onClick={e => {
          e.stopPropagation()
          navigate(`/channel/${article?.channel.id}`);
        }}>
          {/* src\assets\默认用户头像.jpg */}
          {/* src\pages\ArticleDetail\index.tsx */}
          <img className={styles.channelImg} src={article?.channel.imageUrl || defaultChannel} alt="channel" loading="lazy" />
          <span className={styles.channelName}>{article?.channel.channelname}</span>
          <svg className={styles.channelIcon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4873" ><path d="M647.765 512L291.383 155.618c-15.621-15.621-15.621-40.948 0-56.568 15.621-15.621 40.947-15.621 56.568 0l384.666 384.666c15.621 15.621 15.621 40.947 0 56.568L347.951 924.95c-15.621 15.621-40.947 15.621-56.568 0s-15.621-40.947 0-56.568L647.765 512z" p-id="4874"></path></svg>
        </div>
      </div>
      {/* 文章卡片 */}
      <div
        className={styles.articleCard}>
        {/* 用户信息 */}
        <div className={styles.userInfo}>
          {/* 头像 */}
          <img className={styles.avatar} src={article?.user.image || defaultAvatar} alt="avatar" loading="lazy" />
          {/* 用户信息 */}
          <div className={styles.userInfoBox}>
            {/* 用户信息top */}
            {/* 昵称、等级、楼主标签 */}
            <div className={styles.userMeta}>
              <span className={styles.nickname}>{article?.user.nickname}</span>
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
        <div className={styles.title}>{article?.title}</div>
        {/* 内容 */}
        <div className={styles.content}>{content}</div>
        {/* 图片 */}
        {Array.isArray(article?.mediaUrls) && article?.mediaUrls.length > 0 && article?.mediaType === 1 && (
          <div className={styles.images}>
            {article.mediaUrls.map(imgUrl => (
              <div className={styles.imageItem} key={imgUrl}>
                <div className={styles.imageBox} key={imgUrl}>
                  <img key={imgUrl}
                    src={imgUrl}
                    onClick={() => ImageViewer.Multi.show({
                      images: article.mediaUrls,
                      defaultIndex: article.mediaUrls.findIndex(image => image === imgUrl),
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
              viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22241" ><path d="M791.188 623.375c-55.099 0-103.843 26.675-134.439 67.684L436.89 574.158c6.804-19.66 10.681-40.683 10.681-62.658 0-25.166-4.98-49.136-13.791-71.155l220.151-112.173c30.365 43.17 80.468 71.452 137.256 71.452 92.681 0 167.813-75.133 167.813-167.813C959 139.132 883.868 64 791.188 64s-167.813 75.132-167.813 167.813c0 7.291 0.622 14.421 1.524 21.467L388.838 373.56c-34.494-33.278-81.336-53.845-133.052-53.845C149.866 319.714 64 405.579 64 511.5c0 105.92 85.866 191.786 191.786 191.786 55.136 0 104.696-23.399 139.681-60.649l230.151 122.374c-1.343 8.551-2.243 17.249-2.243 26.177 0 92.68 75.133 167.813 167.813 167.813C883.868 959 959 883.867 959 791.188c0-92.681-75.132-167.813-167.812-167.813z m0-479.464c48.469 0 87.902 39.432 87.902 87.902s-39.432 87.902-87.902 87.902-87.902-39.433-87.902-87.902 39.432-87.902 87.902-87.902zM255.786 623.375c-61.688 0-111.875-50.187-111.875-111.875s50.187-111.875 111.875-111.875S367.661 449.812 367.661 511.5s-50.187 111.875-111.875 111.875z m535.402 255.714c-48.469 0-87.902-39.432-87.902-87.902s39.432-87.902 87.902-87.902 87.902 39.432 87.902 87.902-39.433 87.902-87.902 87.902z" p-id="22242"></path></svg>
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
              {displayLikeCount > 0 ? displayLikeCount : '赞'}
            </span>
          </div>
        </div>
      </div>
      {/* 评论区 */}
      <div id="comment-section" className={styles.commentSection}>
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
          <div className={styles.commentList}>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                articleAuthorId={article?.user.id}
                onViewAllReplies={handleViewReplies}
                articleId={article!.id}
                onClickCommentCard={(comment: CommentVO) => {
                  // 弹出BottomBar，并传入评论信息
                  setCommentTarget(comment);
                  // 激活BottomBar输入框
                  setIsBottomBarActive(true);
                }}
              />
            ))}
            <InfiniteScroll loadMore={loadComments} hasMore={hasMore}>
              {hasMore ? (
                <>
                  <span>Loading</span>
                  <DotLoading />
                </>
              ) : (
                <div className={styles.noMore}>
                  <div></div>
                  <span> 已加载全部回复 </span>
                  <div></div>
                </div>
              )}
            </InfiniteScroll>
          </div>
        ) : (
          <div className={styles.empty}>暂无评论，快来发一条吧！</div>
        )}
      </div>
      {/* 底部输入栏 */}
      {/* 移动到底部的DragDownPopup组件中，当不在弹窗中时显示主评论输入栏 */}
      {/* {!showRepliesPopup && ( */}
      <BottomBar
        isInputActive={isBottomBarActive}
        articleId={article?.id}
        CommentTarget={CommentTarget}
        onSendSuccess={handleSendSuccess}
        onInputActiveChange={setIsBottomBarActive}
        onClose={() => {
          setCommentTarget(null);
          setIsBottomBarActive(false);
        }}
      />
      {/* )} */}

      {/* 回复列表弹窗 */}
      {pepliesPopupComment && (
        <DragDownPopup
          visible={showRepliesPopup}
          onClose={handleCloseRepliesPopup}
          title={`回复列表 (${pepliesPopupComment.replyCount}条)`}
        >
          <div className={styles.repliesList}>
            {/* 原评论 */}
            <div className={styles.originalCommentWrapper}>
              <CommentCard
                comment={pepliesPopupComment!}
                onClickCommentCard={(comment: CommentVO) => {
                  // 弹出BottomBar，并传入评论信息
                  setCommentTarget(comment);
                  // 激活BottomBar输入框
                  setIsBottomBarActive(true);
                }}
                articleAuthorId={article?.user.id}
                preview={false}
                articleId={article!.id}
              />
            </div>

            {/* 回复列表 */}
            <div className={styles.repliesContainer}>
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  articleAuthorId={article?.user.id}
                  onClickReplyCard={(comment: CommentReplyVO) => {
                    // 弹出BottomBar，并传入评论信息
                    setReplyTarget(comment);
                    // 激活BottomBar输入框
                    setIsBottomBarActive(true);
                  }}
                  articleId={article!.id}
                />
              ))}
              <InfiniteScroll loadMore={loadReplies} hasMore={repliesHasMore}>
                {repliesHasMore ? (
                  <>
                    <span>Loading</span>
                    <DotLoading />
                  </>
                ) : (
                  <div className={styles.noMore}>
                    <div></div>
                    <span> 已加载全部回复 </span>
                    <div></div>
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>

          <BottomBar
            CommentTarget={pepliesPopupComment}
            replyTarget={replyTarget}
            articleId={article?.id}
            onReplySendSuccess={handleReplySendSuccess}
            isInputActive={isBottomBarActive}
            onInputActiveChange={setIsBottomBarActive}
            onClose={() => {
              setCommentTarget(null);
              setReplyTarget(null);
              setIsBottomBarActive(false);
            }}
          />
        </DragDownPopup>
      )}
    </div >
  );
};

export default ArticleDetail;
