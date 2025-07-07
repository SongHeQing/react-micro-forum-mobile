import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './index.scss';

const PublishArticle = () => {
  const [value3, setValue3] = useState('');
  return <div className="publish-article">PublishArticle
    <div className="publish-article-header"></div>
    <div className="publish-article-body">
      <ReactQuill
        className="custom-quill-editor"
        theme="snow"
        placeholder="请输入正文 （建议200-2000字）"
        value={value3}
        onChange={setValue3}
        modules={{
          toolbar: false // 禁用工具栏
        }}
      />
    </div>
    <div className="publish-article-footer"></div>

  </div>;
};

export default PublishArticle;