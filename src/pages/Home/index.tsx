import { useEffect, useState } from "react";
import "./index.scss";
import { getArticleList } from "@/services/listService";
import type { Article } from "@/types";

const Home = () => {
  const [articleList, setArticleList] = useState<Article[]>([]);
  useEffect(() => {
    getArticleList().then((res) => {
      console.log(res);
      setArticleList(res);
    });
  }, []);

  return <div className="home">
    Home
    <div className="card">
      <div className="card-header">header</div>
      <div className="card-body">
        {/* 限制标题为最大两行，超出显示省略号 */}
        <div className="card-body-title">标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</div>
        <div className="card-body-content">
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        </div>
        <div className="card-body-img"></div>
      </div>
      <div className="card-footer">footer</div>
    </div>
    <div className="card"></div>
    <div className="card"></div>
  </div>;
};

export default Home;