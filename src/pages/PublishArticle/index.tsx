import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'antd-mobile';
import TopNavigationBar from '@/components/TopNavigationBar';
import ChannelList from '@/components/ChannelList/ChannelList'; // 修正导入路径
import { addArticle } from '@/apis/articleApi';
import PlainArticleContentInput from '@/components/PlainArticleContentInput/index'; // 修正导入路径和名称
import styles from './index.module.scss';

interface ArticleData {
  userId: number;
  title: string;
  contentPreview?: string;
  videoUrl?: string;
  articleType: number; // 仍然保留 articleType，但始终设为 1 (普通文章)
  channelId: number | null;
}

function PublishArticle() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>(""); // 统一使用 content 状态
  const [channelId, setChannelId] = useState<number | null>(null); // 文章频道ID
  const [hideNavTabs, setHideNavTabs] = useState<boolean>(false); // 内部管理 hideNavTabs 状态
  const [activeTypeName, setActiveTypeName] = useState<string>("文章"); // 内部管理 activeTypeName 状态
  const articleType = 1; // 强制设置为普通文章 (1)

  /**
   * @description 处理频道选择的回调函数
   * @param id 选中的频道ID
   */
  const handleChannelClick = (id: number) => {
    setChannelId(id);
    console.log(id);
    handleFocusOrChange(); // 触发隐藏Tab
  }

  // 处理焦点或内容变化的通用函数，只在 onFocus 时隐藏其他 Tab
  const handleFocusOrChange = () => {
    setHideNavTabs(true); // 当任何输入框获得焦点或改变时隐藏其他Tab
  };

  /**
   * @description 处理文章提交的函数
   */
  const handleSubmit = async () => {
    const article: ArticleData = {
      userId: 1,
      title,
      articleType,
      channelId,
      contentPreview: content, // 直接使用 content
    };

    if (!title.trim()) {
      Toast.show({ icon: 'fail', content: '请填写标题', });
      return;
    }

    if (!content.trim()) { // 只检查 content
      Toast.show({ icon: 'fail', content: '请填写内容', });
      return;
    }

    if (channelId === null) {
      Toast.show({ icon: 'fail', content: '请选择频道', });
      return;
    }

    try {
      await addArticle(article);
      Toast.show({ icon: 'success', content: '发布成功', });
      navigate('/'); // 发布成功后跳转到首页
    } catch (e) {
      console.error("发布失败", e);
      Toast.show({ icon: 'fail', content: '发布失败', });
    }
  };
  return (
    <div className={styles.publishArticle}>
      <TopNavigationBar
        activeTypeName={activeTypeName} // 传递当前激活的Tab名称
        hideOtherTabs={hideNavTabs} // 传递 hideOtherTabs 状态
        onSubmitForm={handleSubmit} // 传递提交表单的回调
        onTypeChange={(type) => { // 添加 onTypeChange 事件处理
          setActiveTypeName(type); // 更新当前激活的Tab名称
          // setHideNavTabs(false); // 切换Tab时显示所有Tab
        }}
        onClose={() => navigate(-1)} // 添加 onClose 事件处理，返回上一页
      />

      <div className={styles.titleInput}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={handleFocusOrChange}
          placeholder="标题"
          className={styles.titleInputField} // 添加一个类名以便后续样式调整
        />
      </div>
      <PlainArticleContentInput
        value={content} // 传递 content
        onChange={(e) => setContent(e.target.value)} // 直接更新 content
        onFocus={handleFocusOrChange}
        placeholder="请输入文章内容 （建议200-2000字）"
      />
      <ChannelList onChannelClick={handleChannelClick} />
    </div>
  );
}

export default PublishArticle;

