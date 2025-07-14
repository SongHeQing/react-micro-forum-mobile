import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'antd-mobile';
import TopNavigationBar from '@/pages/PublishArticle/components/TopNavigationBar';
import ChannelList from '@/pages/PublishArticle/components/ChannelList/ChannelList'; // 修正导入路径
import { addArticle } from '@/apis/articleApi';
import styles from './index.module.scss';
import { autoResizeTextarea } from '@/utils';
import type { ArticleAdd } from '@/types';


/**
 * @description 发布文章页面
 */
function PublishArticle() {
  /**
   * @description 导航函数
   */
  const navigate = useNavigate();

  /**
   * @description 是否隐藏Tab
   */
  const [hideNavTabs, setHideNavTabs] = useState<boolean>(false);

  /**
   * @description 当前激活的Tab名称
   */
  const [activeTypeName, setActiveTypeName] = useState<string>("文章");

  /**
   * @description 处理焦点或内容变化的通用函数，只在 onFocus 时隐藏其他 Tab
   */
  const handleFocusOrChange = () => {
    setHideNavTabs(true);
  };

  /**
   * @description 标题
   */
  const [title, setTitle] = useState("");

  /**
   * @description 标题长度是否合法
   */
  const [isValidTitleLength, setIsValidTitleLength] = useState<boolean>(false);


  /**
   * @description 提示标题字数数量
   */
  const [titleCharCount, setTitleCharCount] = useState<number>(0);

  /**
   * @description 标题输入框引用
   */
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  /**
   * @description 处理标题输入事件，更新标题状态和标题长度是否合法状态
   * @param e 输入事件
  */
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // 调整标题输入框高度
    autoResizeTextarea(e.target, 1);

    // 计算标题字数
    const charCount = calculateCharCount(newTitle.trim());
    // 标题长度限制为 5-31 个字符
    const isValid = charCount >= 5 && charCount <= 31;
    // 设置标题长度是否合法
    setIsValidTitleLength(isValid);
    if (charCount >= (31 - 5)) {
      // 设置字数
      setTitleCharCount(charCount);
    } else {
      setTitleCharCount(0);
    }
  }

  /**
 * @description 验证标题字数是否合法
 * @param title 标题
 * @returns boolean: true 合法，false 不合法
 */
  // const validateTitleLength = (title: string): boolean => {
  //   const charCount = calculateCharCount(title);
  //   // 标题长度限制为 5-31 个字符
  //   return charCount >= 5 && charCount <= 31
  // }

  /**
   * @description 文章内容
   */
  const [content, setContent] = useState<string>("");

  /**
   * @description 文章内容长度是否合法
   */
  const [isValidContentLength, setIsValidContentLength] = useState<boolean>(false);

  /**
   * @description 提示文章内容字数数量
   */
  const [contentCharCount, setContentCharCount] = useState<number>(0);

  /**
   * @description 文章内容输入框引用
   */
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * @description 处理文章内容输入事件，更新文章内容状态和文章内容输入框高度
   * @param e 输入事件
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 调整文章内容输入框高度
    autoResizeTextarea(e.target, 3); // 内容默认3行

    // 计算文章内容字数
    const charCount = calculateCharCount(e.target.value.trim());
    // 文章内容长度限制为 
    const isValid = charCount <= 2000;
    // 设置文章内容长度是否合法
    setIsValidContentLength(isValid);
    if (charCount >= (2000 - 5)) {
      // 设置字数
      setContentCharCount(charCount);
    } else {
      setContentCharCount(0);
    }
  }


  /**
   * @description 频道ID
   */
  const [channelId, setChannelId] = useState<number | null>(null);

  /**
   * @description 处理频道选择事件
   * @param id 选中的频道ID
   */
  const handleChannelClick = (id: number) => {
    setChannelId(id);
    handleFocusOrChange(); // 触发隐藏Tab
  }


  useEffect(() => {
    // // 初始化时调整textarea高度
    // if (titleTextareaRef.current) {
    //   autoResizeTextarea(titleTextareaRef.current, 1);
    // }
    // if (contentTextareaRef.current) {
    //   autoResizeTextarea(contentTextareaRef.current, 3);
    // }
  }, []);

  /**
   * @description 计算字符数
   * @param str 字符串
   * @returns number: 字符数
   */
  const calculateCharCount = (str: string): number => {
    return Array.from(str).length;
  }


  /**
   * @description 处理文章提交事件
   */
  const handleSubmit = async () => {
    const article: ArticleAdd = {
      channelId,
      title,
      content
    };

    // 前端验证标题长度
    if (!isValidTitleLength) {
      Toast.show({ icon: '', content: '标题最多31个字哦~', });
      return;
    }

    // 前端验证频道是否选择
    if (channelId === null) {
      Toast.show({ icon: '', content: '请选择频道', });
      return;
    }

    // 前端验证内容长度，0-2000字符
    if (!isValidContentLength) {
      Toast.show({ icon: '', content: '超过最大字数限制，最多可输入2000字', });
      return;
    }
    await addArticle(article);
    Toast.show({ icon: 'success', content: '发布成功', });
    navigate('/'); // 发布成功后跳转到首页

  };
  return (
    <div className={styles.publishArticle}>
      {/* 顶部导航栏 */}
      <TopNavigationBar
        activeTypeName={activeTypeName} // 传递当前激活的Tab名称
        hideOtherTabs={hideNavTabs} // 传递 hideOtherTabs 状态
        onSubmitForm={handleSubmit} // 传递提交表单的回调
        onTypeChange={(type) => { // 添加 onTypeChange 事件处理
          setActiveTypeName(type); // 更新当前激活的Tab名称
          // setHideNavTabs(false); // 切换Tab时显示所有Tab
        }}
        isPublishEnabled={isValidTitleLength}
        onClose={() => navigate('/')} // 添加 onClose 事件处理，返回上一页
      />

      {/* 内容区域 */}
      {/* 输入框容器 */}
      <div className={styles.titleInputContainer}>
        {/* 标题输入框 */}
        {/* 禁止换行符输入的textarea */}
        <textarea
          ref={titleTextareaRef}
          className={`${styles.titleInput}`}
          value={title}
          onChange={handleTitleChange}
          onFocus={handleFocusOrChange}
          placeholder="请输入完整帖子标题（5-31个字）"
          rows={1}
          onKeyDown={(e) => {
            // 作用：阻止Enter键的默认行为，防止换行
            if (e.key === 'Enter') {
              // 作用：阻止事件的默认行为
              e.preventDefault();
            }
          }}
        />
        {/* 标题字数 */}
        {/* 如果标题字数大于31-5，则显示标题字数 */}
        {titleCharCount >= (31 - 5) && <div className={styles.titleCharCount}>
          <span className={!isValidTitleLength ? styles.active : ''}>{titleCharCount}</span>/31</div>}
      </div>

      {/* 文章内容输入区域 */}
      <div className={styles.contentInputContainer}>
        {/* 文章内容输入框 */}
        <textarea
          ref={contentTextareaRef}
          className={styles.contentInput}
          value={content} // 传递 content
          onChange={handleContentChange}
          onFocus={handleFocusOrChange}
          placeholder="请输入文章内容 （建议200-2000字）"
          rows={3}
        />
        {/* 文章内容字数 */}
        {/* 如果文章内容字数大于200-2000，则显示文章内容字数 */}
        {contentCharCount >= (2000 - 5) && <div className={styles.contentCharCount}>
          <span className={!isValidContentLength ? styles.active : ''}>{contentCharCount}</span>/2000</div>}
        {/* 图片上传 */}
        <div className={styles.imageUploadContainer}>
          <div className={styles.imageUploadItem}>
            <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M920 472H552V104c0-22.092-17.908-40-40-40s-40 17.908-40 40v368H104c-22.092 0-40 17.908-40 40 0 22.091 17.908 40 40 40h368v368c0 22.091 17.908 40 40 40s40-17.909 40-40V552h368c22.092 0 40-17.909 40-40 0-22.092-17.908-40-40-40z"  ></path></svg>
          </div>
        </div>
      </div>
      {/* 频道选择 */}
      <ChannelList onChannelClick={handleChannelClick} />
    </div>
  );
}

export default PublishArticle;

