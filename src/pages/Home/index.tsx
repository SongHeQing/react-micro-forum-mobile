import { useEffect, useState } from "react";
import "./index.scss";
import { getArticleList } from "@/apis/articleApi";
import type { Article } from "@/types";
import Card from "@/components/Card";


// 示例静态 Article 数据
const staticArticles: Article[] = [
  {
    id: 1,
    userId: 1,
    title: "测试标题p标签换行<p>测试标题p标签换行</p>",
    contentPreview: "内容内容内\n容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
    image: null,
    createTime: "",
    updateTime: ""
  },
  {
    id: 2,
    userId: 1,
    title: "body-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-titlebody-title",
    contentPreview: "body-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbody-contentbo",
    image: null,
    createTime: "",
    updateTime: ""
  },
  {
    id: 3,
    userId: 1,
    title: "标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题",
    contentPreview: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
    image: null,
    createTime: "",
    updateTime: ""
  }
];

const Home = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  useEffect(() => {
    getArticleList().then((res) => {
      setArticleList(res);
    });
  }, []);

  return <div className="home">
    Home
    {/* 静态卡片示例 */}
    {staticArticles.map(article => (
      <Card key={article.id} article={article} />
    ))}
    {/* 动态渲染文章卡片 */}
    {articleList.length > 0 ? (
      articleList.map((article, index) => (
        <Card key={article.id || index} article={article} />
      ))
    ) : (
      <div>暂无文章</div>
    )}
  </div>;
};

export default Home;