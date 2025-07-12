import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'antd-mobile';
import TopNavigationBar from '@/pages/PublishArticle/components/TopNavigationBar';
import ChannelList from '@/pages/PublishArticle/components/ChannelList/ChannelList'; // 修正导入路径
import { addArticle } from '@/apis/articleApi';
import PlainArticleContentInput from '@/pages/PublishArticle/components/PlainArticleContentInput/index'; // 修正导入路径和名称
import styles from './index.module.scss';
import { isErrorResponseType } from '@/utils/typeGuards';

interface ArticleData {
  userId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  articleType: number; // 仍然保留 articleType，但始终设为 1 (普通文章)
  channelId: number | null;
}

function PublishArticle() {
  const navigate = useNavigate();
  // 表单状态
  // 标题
  const [title, setTitle] = useState("");
  // 内容
  const [content, setContent] = useState<string>("");
  // 频道ID
  const [channelId, setChannelId] = useState<number | null>(null);
  // 文章类型
  const articleType = 1; // 强制设置为普通文章 (1)

  // 表单校验
  // 标题长度是否合法
  const [isValidTitleLength, setIsValidTitleLength] = useState<boolean>(false);

  // 组件状态
  // 是否隐藏Tab
  const [hideNavTabs, setHideNavTabs] = useState<boolean>(false);
  // 当前激活的Tab名称
  const [activeTypeName, setActiveTypeName] = useState<string>("文章"); // 内部管理 activeTypeName 状态



  /**
   * @description 处理焦点或内容变化的通用函数，只在 onFocus 时隐藏其他 Tab
   */
  const handleFocusOrChange = () => {
    setHideNavTabs(true);
  };

  /**
   * @description 计算字符数
   * @param str 字符串
   * @returns number: 字符数
   */
  const calculateCharCount = (str: string): number => {
    return Array.from(str).length;
  }

  /**
   * @description 验证标题字数是否合法
   * @param title 标题
   * @returns boolean: true 合法，false 不合法
   */
  // 有的字符占多个 UTF-16 编码单元，所以不能直接用length判断，使用Array.from() 来正确计算 Unicode 字符数量
  const validateTitleLength = (title: string): boolean => {
    const charCount = calculateCharCount(title);
    // 标题长度限制为 5-31 个字符
    return charCount >= 5 && charCount <= 31
  }


  /**
   * @description 处理标题输入事件，更新标题状态和标题长度是否合法状态
   * @param e 输入事件
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // 更新标题状态
    setTitle(newTitle);
    // 更新标题长度是否合法状态
    setIsValidTitleLength(validateTitleLength(newTitle));
  }

  /**
 * @description 处理频道选择事件
 * @param id 选中的频道ID
 */
  const handleChannelClick = (id: number) => {
    setChannelId(id);
    console.log(id);
    handleFocusOrChange(); // 触发隐藏Tab
  }

  /**
   * @description 处理文章提交事件
   */
  const handleSubmit = async () => {
    const article: ArticleData = {
      userId: 1,
      title,
      articleType,
      channelId,
      content,
    };

    // 前端验证标题长度
    if (!validateTitleLength(title.trim())) {
      Toast.show({ icon: 'fail', content: '标题长度应在5-31个字符之间', });
      return;
    }

    // 前端验证频道是否选择
    if (channelId === null) {
      Toast.show({ icon: 'fail', content: '请选择频道', });
      return;
    }

    // 前端验证内容长度，0-2000字符
    // 有的字符占多个 UTF-16 编码单元，所以不能直接用length判断，使用Array.from() 来正确计算 Unicode 字符数量
    if (content.trim() !== '') {
      const contentLength = calculateCharCount(content.trim());
      if (contentLength > 2000) {
        Toast.show({ icon: 'fail', content: '文章内容应在2000字符以内', });
        return;
      }
    }


    try {
      await addArticle(article);
      Toast.show({ icon: 'success', content: '发布成功', });
      navigate('/'); // 发布成功后跳转到首页
    } catch (error: unknown) {
      // 后端验证失败
      if (isErrorResponseType(error)) {
        const message = error.message;
        Toast.show({ icon: 'fail', content: message, });
        const errorCount = error.errorCount;
        if (errorCount > 0) {
          Toast.show({ icon: 'fail', content: `请检查${errorCount}个字段`, });
        }
        const fieldErrors = error.fieldErrors;
        for (const field in fieldErrors) {
          Toast.show({ icon: 'fail', content: `${field}: ${fieldErrors[field]}`, });
        }
      }
    }
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

      {/* 标题输入区域 */}
      <div className={styles.titleInput}>
        {/* 标题输入框 */}
        <input
          className={`${styles.titleInputField}`}
          value={title}
          onChange={handleTitleChange}
          onFocus={handleFocusOrChange}
          placeholder="标题"
        />
      </div>
      {/* 文章内容输入区域 */}
      <div className={styles.contentInput}>
        {/* 文章内容输入框 */}
        <PlainArticleContentInput
          value={content} // 传递 content
          onChange={(e) => setContent(e.target.value)} // 直接更新 content
          onFocus={handleFocusOrChange}
          placeholder="请输入文章内容 （建议200-2000字）"
        />
      </div>

      {/* 频道选择 */}
      <ChannelList onChannelClick={handleChannelClick} />
    </div>
  );
}

export default PublishArticle;

