import React, { useRef, useEffect, useState, useMemo } from "react";
import type { ArticleCard } from "@/types";
import { getLineCount } from "@/utils/lineCount";
import { useClickAnimation } from "@/hooks/useClickAnimation";
import styles from './index.module.scss';
import avatar from '@/assets/默认频道图片.jpg';
import { ImageViewer } from "antd-mobile";
import clsx from "clsx";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CardProps {
  article: ArticleCard;
}

const Card: React.FC<CardProps> = ({ article }) => {

  // 根据标题行数动态设置内容行数
  const titleRef = useRef<HTMLDivElement>(null);
  const [contentLineCount, setContentLineCount] = useState<number>(0);

  useEffect(() => {
    // 统计标题和内容当前行数
    const titleLineCount: number = getLineCount(titleRef.current);
    //标题和内容最大行数
    const maxLineCount: number = 5;
    //动态计算最大行数减去标题行数剩余的行数，根据剩余的行数限制内容行数
    const remainingLineCount: number = maxLineCount - titleLineCount;
    setContentLineCount(remainingLineCount);
  }, [article.title]);

  // 用 useMemo 计算排序后的图片数组
  const sortedImagesUrl = useMemo(() => {
    // 判断是否为数组
    if (!Array.isArray(article.coverImageUrl)) return [];
    // 复制一份，避免原数组被排序,为每个image添加BASE_URL
    const sortedImagesUrl = article.coverImageUrl.slice().sort((a, b) => a.orderNum - b.orderNum).map(img => BASE_URL + img.imageUrl);
    // 返回排序后的图片数组
    return sortedImagesUrl;
  }, [article.coverImageUrl]);

  // 图片预览数量
  const [previewImagesCount, setPreviewImagesCount] = useState<number>(0);

  // 根据图片url动态设置图片预览数量
  useEffect(() => {
    const previewImagesCount: number = article.coverImageUrl.length;
    if (previewImagesCount > 3) {
      // 设置图片预览数量
      setPreviewImagesCount(3);
    } else {
      setPreviewImagesCount(previewImagesCount);
    }
  }, [article.coverImageUrl]);

  // 根据频道名称是否溢出动态设置频道后缀的距离
  const channelNameRef = useRef<HTMLDivElement>(null);
  const channelNameSuffixRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const nameEl = channelNameRef.current;
    const suffixEl = channelNameSuffixRef.current;
    if (nameEl && suffixEl && nameEl.scrollWidth > nameEl.offsetWidth) {
      suffixEl.style.marginLeft = '-0.825rem'; // 吸附过去
    }
  }, [article.channelCard.channelName]);

  // 使用自定义Hook管理分享图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameShareIcon, triggerAnimation: triggerAnimationShareIcon } = useClickAnimation({
    duration: 300
  });

  // 使用自定义Hook管理评论图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameCommentIcon, triggerAnimation: triggerAnimationCommentIcon } = useClickAnimation({
    duration: 300
  });

  // 使用自定义Hook管理点赞图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameLikeIcon, triggerAnimation: triggerAnimationLikeIcon } = useClickAnimation({
    duration: 300
  });

  // 使用自定义Hook管理关注图标点击动画
  const { getModuleAnimationClassName: getModuleAnimationClassNameFollow, triggerAnimation: triggerAnimationFollow } = useClickAnimation({
    duration: 300
  });
  // 处理分享图标点击
  const handleClickShare = () => {
    triggerAnimationShareIcon();
  };

  // 处理评论图标点击
  const handleClickComment = () => {
    triggerAnimationCommentIcon();
  };

  // 处理点赞图标点击
  const handleClickLike = () => {
    triggerAnimationLikeIcon();
  };

  // 处理关注按钮点击
  const handleFollowClick = () => {
    triggerAnimationFollow();
  };

  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer}>
      {/* 头部 */}
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderChannel}>
          {/* 频道头像 */}
          <img className={styles.cardHeaderChannelAvatarImg} src={article.channelCard.image ? (BASE_URL + article.channelCard.image) : avatar} alt="avatar" />
          {/* 频道名称和频道描述 */}
          <div className={styles.cardHeaderChannelText}>
            {/* 频道名称 */}
            <div className={styles.cardHeaderChannelTextNameBox}>
              <div className={styles.cardHeaderChannelTextName}
                ref={channelNameRef}
              >
                {article.channelCard.channelName}
              </div>
              <span ref={channelNameSuffixRef}>频道</span>
            </div>
            <div className={styles.cardHeaderChannelTextDesc}>
              {/* 关注量 */}
              <span className={styles.cardHeaderChannelTextDesc}>
                关注 {article.channelCard.userCount}
              </span>
              {/* 文章量 */}
              <span className={styles.cardHeaderChannelTextDesc}>
                文章 {article.channelCard.articleCount}
              </span>
            </div>
          </div>
        </div>
        {/* 按钮 */}
        <div className={getModuleAnimationClassNameFollow(styles.cardHeaderButton, styles.iconAnimate)} onClick={handleFollowClick}>
          关注
        </div>
      </div>
      {/* 内容 */}
      <div className={styles.cardBody}
        onClick={() => {
          navigate(`/article/${article.id}`);
        }}
      >
        {/* 限制标题为最大两行，超出显示省略号 */}
        <div className={styles.cardBodyTitle} ref={titleRef}>{article.title}</div>
        <div className={styles.cardBodyContent}
          style={{
            WebkitLineClamp: contentLineCount,
            lineClamp: contentLineCount,
          }}
        >
          {article.contentPreview}
        </div>
        <div className={clsx(
          styles.cardBodyImg,
          {
            [styles.cardBodyImgTwoOrThree]: previewImagesCount >= 2,
            [styles.cardBodyImgOne]: previewImagesCount === 1,
          }
        )}>
          {/* 封面图片 */}
          {/* 
          * 复制再排序是为了保证原始数据不被意外修改，避免副作用，符合 React 推荐的“不可变数据”理念。
          * 这样代码更安全、可维护，尤其是在组件复用、状态管理等场景下。
          */}
          {sortedImagesUrl.slice(0, previewImagesCount).map(imgUrl => (
            <img key={imgUrl}
              src={imgUrl}
              // 点击图片预览大图，使用 ImageViewer.Multi.show() 指令式
              onClick={(e) => {
                e.stopPropagation();
                ImageViewer.Multi.show({
                  images: sortedImagesUrl,
                  defaultIndex: sortedImagesUrl.findIndex(image => image === imgUrl),
                })
              }}
              alt="cover" />
          ))}
        </div>
      </div>
      {/* 底部 */}
      <div className={styles.cardFooter}>
        {/* 转发 */}
        <div className={styles.cardFooterItem} onClick={handleClickShare}>
          {/* 填充型SVG - 带点击动画 */}
          <svg
            className={getModuleAnimationClassNameShareIcon(styles.icon, styles.iconAnimate)}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M864 64H682.283c-20.924 0-39.99 15.054-42.075 35.873C637.81 123.816 656.547 144 680 144h151.431L556 419.432c-15.621 15.62-15.621 40.947 0 56.568s40.947 15.621 56.568 0L880 208.568v133.149c0 20.924 15.056 39.991 35.876 42.074C939.819 386.189 960 367.45 960 344V160c0-53.02-42.98-96-96-96z" />
            <path d="M920 608c-22.092 0-40 17.908-40 40v120c0 61.855-50.145 112-112 112H256c-61.855 0-112-50.145-112-112V256c0-61.856 50.145-112 112-112h120c22.092 0 40-17.909 40-40 0-22.092-17.908-40-40-40H256C149.961 64 64 149.961 64 256v512c0 106.038 85.961 192 192 192h512c106.039 0 192-85.962 192-192V648c0-22.092-17.908-40-40-40z" />
          </svg>
          <span className={styles.cardFooterItemText}>
            分享
          </span>
        </div>
        {/* 评论 */}
        <div className={styles.cardFooterItem}
          onClick={handleClickComment}
        >
          <svg
            className={getModuleAnimationClassNameCommentIcon(styles.icon, styles.iconAnimate)}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"

          >
            <path d="M653.865 377.607H370.129c-20.619 0-37.334 16.714-37.334 37.334 0 20.618 16.714 37.334 37.334 37.334h283.736c20.619 0 37.334-16.715 37.334-37.334 0-20.619-16.715-37.334-37.334-37.334zM534.397 571.742H370.129c-20.619 0-37.334 16.714-37.334 37.334 0 20.619 16.714 37.334 37.334 37.334h164.268c20.619 0 37.334-16.714 37.334-37.334 0-20.619-16.714-37.334-37.334-37.334z" ></path>
            <path d="M511.997 64.005c-18.749 0-37.749 1.15-56.969 3.519C253.888 92.322 92.617 253.792 67.554 454.9c-7.776 62.395-2.538 122.539 13.228 178.282 22.345 79.003 26.19 162.08 5.466 241.524l-4.02 15.406c-7.576 29.042 14.785 56.14 43.152 56.14a45.71 45.71 0 0 0 9.335-0.973c44.469-9.264 89.793-14.27 135.021-14.27 45.672 0 91.246 5.101 135.784 16.074C439.72 955.507 475.465 960 512.272 960c15.319 0 30.818-0.777 46.472-2.374C771.982 935.88 942.017 761.501 958.608 547.8 979.071 284.225 771.244 64.005 511.997 64.005z m372.168 478.016c-13.712 176.625-156.87 323.362-332.997 341.323a384.896 384.896 0 0 1-38.897 1.989c-30.027 0-59.934-3.617-88.891-10.751-49.133-12.104-100.826-18.241-153.645-18.241-34.369 0-69.375 2.596-104.537 7.737 15.63-80.31 11.389-166.513-12.568-251.218-13.596-48.067-17.291-98.106-10.983-148.726 20.736-166.388 156.374-302.02 322.517-322.503 15.924-1.963 32.017-2.959 47.833-2.959 103.704 0 203.605 43.684 274.088 119.85 71.447 77.21 106.279 177.891 98.08 283.499z" ></path>
          </svg>
          <span className={styles.cardFooterItemText}>
            {article.commentCount}
          </span>
        </div>
        {/* 点赞 */}
        <div className={styles.cardFooterItem} onClick={handleClickLike}>
          {/* 填充型SVG - 带点击动画 */}
          <svg
            className={getModuleAnimationClassNameLikeIcon(styles.icon, styles.iconAnimate)}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M795.769 342.896c-0.007 0 0.005 0 0 0H685.4c-0.849 0-1.489-0.69-1.262-1.508 4.144-14.865 21.546-84.656 4.471-153.887C668.02 104.026 601.913 64.003 542.469 64c-32.186-0.002-62.412 11.729-82.415 34.647-56.944 65.247-19.396 88.469-52.796 175.756-28.589 74.718-96.736 94.832-115.814 99.091l-5.188 1.037h-93.46c-70.692 0-128 57.308-128 128V816c0 70.692 57.308 128 128 128h511.09c88.992 0 166.321-61.153 186.831-147.751l60.745-256.479c23.799-100.487-52.431-196.874-155.693-196.874zM144.795 816V502.531c0-26.467 21.532-48 48-48h48V864h-48c-26.468 0-48-21.533-48-48z m728.82-294.667l-60.746 256.479C800.851 828.559 756.034 864 703.885 864h-383.09V448.497c38.811-11.046 123.048-45.847 161.181-145.505 18.542-48.459 20.521-83.044 21.966-108.297 1.396-24.407 1.511-26.401 16.385-43.444 3.904-4.473 12.387-7.252 22.139-7.251 24.457 0.001 57.065 16.412 68.472 62.659 9.14 37.052 3.955 76.38-0.277 97.734-5.33 22.173-17.249 50.663-28.257 74.365-9.891 21.296 5.923 45.558 29.402 45.32l116.708-1.184h67.256c24.607 0 47.478 11.072 62.745 30.379 15.267 19.308 20.771 44.115 15.1 68.06z" ></path>
          </svg>
          <span className={styles.cardFooterItemText}>
            {article.likeCount}
          </span>
        </div>
      </div>
    </div >
  );
};

export default Card; 