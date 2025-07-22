import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";
import { getArticleDetail } from "@/apis/articleApi";
import type { ArticleDetail } from "@/types/article";
import defaultAvatar from "@/assets/默认用户头像.jpg";
import defaultChannel from "@/assets/默认频道图片.jpg";
import { ImageViewer } from "antd-mobile";
import { useClickAnimation } from "@/hooks/useClickAnimation";
import clsx from "clsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockComments = [
  {
    id: 1,
    user: {
      nickname: "太初九尘",
      level: 9,
      avatar: defaultAvatar,
      isAuthor: true,
    },
    content: "孔子曰：‘所信者目也，而目犹不可信；所恃者心也，而心犹不足恃。’——《吕氏春秋·审分览·任数》",
    time: "07-17 黑龙江",
    like: 4,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
  {
    id: 2,
    user: {
      nickname: "你能怎样？",
      level: 7,
      avatar: defaultAvatar,
      isAuthor: false,
    },
    content: "高高在上地带着【救世】情节去写书，结果写不下去要抄是吧 😁\n还和希灵帝国比呢，大眼珠子何德何能跟个***比啊。",
    time: "07-17 意大利",
    like: 8,
  },
];

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

// 定义User类型，兼容后端返回和mock
interface UserInfo {
  nickname: string;
  level: number;
  avatar: string;
  isAuthor: boolean;
}

interface UserFromApi {
  nickname: string;
  level?: number;
  image?: string;
}

const getUserInfo = (article: ArticleDetail): UserInfo => {
  // 类型守卫：判断article是否有user字段
  const user: UserFromApi | undefined = (article as unknown as { user?: UserFromApi }).user;
  return {
    nickname: user?.nickname || "匿名",
    level: user?.level ?? 1,
    avatar: user?.image || defaultAvatar,
    isAuthor: true, // 详情页主楼主
  };
};

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
      getArticleDetail(Number(id)).then(res => setArticle(res));
    }
  }, [id]);

  // 距离检测吸顶
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

  const sortedImagesUrl = useMemo(() => {
    // 判断是否为数组
    if (!Array.isArray(article?.coverImageUrl)) return [];
    // 复制一份，避免原数组被排序,为每个image添加BASE_URL
    const sortedImagesUrl = article?.coverImageUrl.slice().sort((a, b) => a.orderNum - b.orderNum).map(img => BASE_URL + img.imageUrl);
    // 返回排序后的图片数组
    return sortedImagesUrl;
  }, [article?.coverImageUrl]);

  // 点赞事件
  const handleClickLike = () => {
    triggerAnimationLikeIcon();
  };

  // 使用自定义Hook管理点赞图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameLikeIcon, triggerAnimation: triggerAnimationLikeIcon } = useClickAnimation({
    duration: 300
  });

  if (!article) {
    return <div>加载中...</div>;
  }

  const user = getUserInfo(article);

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
          <img className={styles.channelImg} src={defaultChannel} alt="channel" />
          {article.channel.channelname}
          <svg className={styles.channelIcon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4873" ><path d="M647.765 512L291.383 155.618c-15.621-15.621-15.621-40.948 0-56.568 15.621-15.621 40.947-15.621 56.568 0l384.666 384.666c15.621 15.621 15.621 40.947 0 56.568L347.951 924.95c-15.621 15.621-40.947 15.621-56.568 0s-15.621-40.947 0-56.568L647.765 512z" p-id="4874"></path></svg>
        </div>
      </div>
      {/* 文章卡片 */}
      <div
        className={styles.articleCard}>
        <div className={styles.userInfo}>
          <img className={styles.avatar} src={user.avatar || defaultAvatar} alt="avatar" />
          <div className={styles.userMeta}>
            <span className={styles.nickname}>{user.nickname}</span>
            <span className={styles.level}>Lv.{user.level}</span>
            {user.isAuthor && <span className={styles.authorTag}>楼主</span>}
          </div>
          <span className={styles.time}>{article.createTime?.slice(5, 16) || "--"}</span>
        </div>
        {/* 标题 */}
        <div className={styles.title}>{article.title}</div>
        {/* 内容 */}
        <div className={styles.content}>{article.content}</div>
        {/* 图片 */}
        {Array.isArray(article.coverImageUrl) && article.coverImageUrl.length > 0 && (
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
                    alt="cover" />
                  <div className={styles.imageMask}></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 互动 */}
        <div className={styles.cardFooter}>
          {/* 点赞 */}
          <div className={styles.cardFooterItem} onClick={handleClickLike}>
            <svg
              className={getModuleAnimationClassNameLikeIcon(styles.icon, styles.iconAnimate)}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M795.769 342.896c-0.007 0 0.005 0 0 0H685.4c-0.849 0-1.489-0.69-1.262-1.508 4.144-14.865 21.546-84.656 4.471-153.887C668.02 104.026 601.913 64.003 542.469 64c-32.186-0.002-62.412 11.729-82.415 34.647-56.944 65.247-19.396 88.469-52.796 175.756-28.589 74.718-96.736 94.832-115.814 99.091l-5.188 1.037h-93.46c-70.692 0-128 57.308-128 128V816c0 70.692 57.308 128 128 128h511.09c88.992 0 166.321-61.153 186.831-147.751l60.745-256.479c23.799-100.487-52.431-196.874-155.693-196.874zM144.795 816V502.531c0-26.467 21.532-48 48-48h48V864h-48c-26.468 0-48-21.533-48-48z m728.82-294.667l-60.746 256.479C800.851 828.559 756.034 864 703.885 864h-383.09V448.497c38.811-11.046 123.048-45.847 161.181-145.505 18.542-48.459 20.521-83.044 21.966-108.297 1.396-24.407 1.511-26.401 16.385-43.444 3.904-4.473 12.387-7.252 22.139-7.251 24.457 0.001 57.065 16.412 68.472 62.659 9.14 37.052 3.955 76.38-0.277 97.734-5.33 22.173-17.249 50.663-28.257 74.365-9.891 21.296 5.923 45.558 29.402 45.32l116.708-1.184h67.256c24.607 0 47.478 11.072 62.745 30.379 15.267 19.308 20.771 44.115 15.1 68.06z" ></path>
            </svg>
            <span className={styles.cardFooterItemText}>
              100
            </span>
          </div>
        </div>
      </div>
      {/* 评论区标题吸顶（用距离检测切换类名） */}
      <div className={styles.commentSection}>
        <div ref={commentTitleRef} className={clsx(styles.commentTitle, isCommentTitleSticky && styles.StickyActive)}>
          全部回复
        </div>
        {mockComments.map(comment => (
          <div className={styles.commentCard} key={comment.id}>
            <img className={styles.commentAvatar} src={comment.user.avatar} alt="avatar" />
            <div className={styles.commentContentBox}>
              <div className={styles.commentMeta}>
                <span className={styles.commentNickname}>{comment.user.nickname}</span>
                <span className={styles.commentLevel}>Lv.{comment.user.level}</span>
                {comment.user.isAuthor && <span className={styles.authorTag}>楼主</span>}
                <span className={styles.commentTime}>{comment.time}</span>
              </div>
              <div className={styles.commentContent}>{comment.content}</div>
            </div>
            <span className={styles.commentLike}>👍 {comment.like}</span>
          </div>
        ))}
      </div>
      {/* 底部输入栏 */}
      <div className={styles.bottomBar}>
        <input className={styles.input} placeholder="发一条友善的评论" />
        <button className={styles.sendBtn}>发送</button>
      </div>
    </div>
  );
};

export default ArticleDetail;