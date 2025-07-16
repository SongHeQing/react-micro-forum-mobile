import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ImageViewer, Toast } from 'antd-mobile';
import TopNavigationBar from '@/pages/PublishArticle/components/TopNavigationBar';
import ChannelList from '@/pages/PublishArticle/components/ChannelList/ChannelList'; // 修正导入路径
import { addArticle } from '@/apis/articleApi';
import styles from './index.module.scss';
import { autoResizeTextarea } from '@/utils';
// import type { ArticleAdd } from '@/types';


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
  const [isValidContentLength, setIsValidContentLength] = useState<boolean>(true);

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
 * @description 图片上传引用
 */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * @description 图片列表
   */
  const [images, setImages] = useState<File[]>([]);

  /**
   * @description 专门用于图片回显（预览）的 URL 列表
   * 类型是 string[]，每个字符串都是一个临时的图片 URL
   */
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  /**
   * @description 处理图片上传事件
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;

    if (files && files.length === 0 || files === null) {
      Toast.show({ icon: '', content: '用户取消上传', });
      return;
    }

    if (images.length + files.length > 9) {
      Toast.show({ icon: '', content: '最多上传9张图片', });
      return;
    }
    // 创建新的文件列表和预览 URL 列表
    const newFiles = Array.from(files);
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));

    // 更新状态
    setImages([...images, ...newFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  }
  // 2. 当用户点击自定义的“上传区域”时调用这个函数
  const handleUploadAreaClick = () => {
    // 关键一步：通过 ref 触发隐藏 input 的点击事件，弹出文件选择框
    fileInputRef.current?.click();
  };

  /**
   * @description 处理图片删除事件
   * @param indexToRemove 图片索引
   */
  const handleRemoveImage = (indexToRemove: number) => {
    // 确保索引有效
    if (indexToRemove < 0 || indexToRemove >= images.length) {
      console.warn('尝试删除的图片索引无效:', indexToRemove);
      return;
    }

    // 获取要删除的图片的 URL，以便释放内存
    const urlToRevoke = previewUrls[indexToRemove];

    // 更新 images 状态：移除指定索引的 File 对象
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));

    // 更新 previewUrls 状态：移除指定索引的预览 URL
    setPreviewUrls(prevPreviewUrls => {
      const newUrls = prevPreviewUrls.filter((_, index) => index !== indexToRemove);
      // **重要：释放被删除 URL 的内存**
      URL.revokeObjectURL(urlToRevoke);
      return newUrls;
    });

    Toast.show({ icon: 'success', content: '图片已删除', position: 'top' });
  };


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
    return () => {
      // 遍历所有存储的 URL，并释放它们
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      console.log('组件卸载或 previewUrls 变化，所有临时 URL 已被清理。');
    };
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

    // 前端验证图片是否上传
    if (images.length > 9) {
      Toast.show({ icon: '', content: '最多上传9张图片', });
      return;
    }

    // const article: ArticleAdd = {
    //   channelId,
    //   title,
    //   content,
    //   images
    // };
    // **** 核心修改：使用 FormData ****
    const formData = new FormData();
    formData.append('channelId', String(channelId)); // 转换为字符串
    formData.append('title', title);
    formData.append('content', content);
    images.forEach(image => {
      formData.append('images', image);
    });
    await addArticle(formData);

    // await addArticle(article);
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
          {/* 图片预览区域 - 仅显示回显 */}
          {previewUrls.length > 0 && (
            <div className={styles.previewContainer}>
              {previewUrls.map((url, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <img src={url} alt={`preview-${index}`} className={styles.thumbnail}
                    // 点击图片预览大图，使用 ImageViewer.Multi.show() 指令式
                    onClick={() => ImageViewer.Multi.show({
                      images: previewUrls,
                      defaultIndex: index,
                    })}
                  />

                  {/* 3. **添加删除按钮** */}
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡到图片点击，避免同时触发预览
                      handleRemoveImage(index);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.imageUploadInput} onClick={handleUploadAreaClick}>
            <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M920 472H552V104c0-22.092-17.908-40-40-40s-40 17.908-40 40v368H104c-22.092 0-40 17.908-40 40 0 22.091 17.908 40 40 40h368v368c0 22.091 17.908 40 40 40s40-17.909 40-40V552h368c22.092 0 40-17.909 40-40 0-22.092-17.908-40-40-40z"  ></path></svg>
            {/* 这个是真正的文件选择器，我们用 CSS 把它隐藏起来 */}
            <input
              type="file"
              ref={fileInputRef}        // 将 ref 绑定到这个 input 上
              onChange={handleFileChange} // 监听文件选择事件
              // 脱离文档流，不会渲染
              style={{ display: 'none' }} // 完全隐藏 input 元素
              // 如果需要限制文件类型，可以添加 accept 属性
              // 例如：只接受图片 accept="image/*"
              // 或者接受图片和PDF accept="image/*,.pdf"
              accept="image/*"
              multiple
            />
          </div>
        </div>
      </div>
      {/* 频道选择 */}
      <ChannelList onChannelClick={handleChannelClick} />
    </div>
  );
}

export default PublishArticle;

