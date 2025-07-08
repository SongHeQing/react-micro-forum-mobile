import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './index.scss';
import { addArticle } from "@/apis/articleApi";
import { Button } from "antd-mobile";
import ChannelList from "@/components/ChannelList/ChannelList";
import ChannelListAntd from "@/components/ChannelList/ChannelListAntd";




const PublishArticle = () => {
  const [title, setTitle] = useState("");
  const [contentPreview, setContentPreview] = useState("");
  // const [title2, setTitle2] = useState("");
  const [contentPreview2, setContentPreview2] = useState("");

  // 处理 ReactQuill 内容
  const handleQuillChange = (value: string) => {
    setContentPreview(value);
  };

  // 处理 textarea 内容
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentPreview2(e.target.value);
  };

  const handleSubmit = async () => {
    const article = {
      title,
      contentPreview,
      // 其他字段如 userId, channelId, image, createTime, updateTime 可按需补充
    };
    try {
      await addArticle(article);
      alert("发布成功！");
      // 可重置表单或跳转
    } catch (e) {
      alert(`发布失败！${e}`);
    }
  };

  const handleSubmit2 = async () => {
    const article = {
      title: title,
      contentPreview: contentPreview2,
    };
    try {
      await addArticle(article);
      alert("发布成功！");
    } catch (e) {
      alert(`发布失败！${e}`);
    }
  };
  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" />
      <ReactQuill
        className="custom-quill-editor"
        theme="snow"
        placeholder="请输入正文 （建议200-2000字）"
        value={contentPreview}
        onChange={handleQuillChange}
        modules={{ toolbar: false }}
      />
      <textarea className="publish-article-textarea" value={contentPreview2} onChange={handleTextareaChange}></textarea>
      <Button onClick={handleSubmit}>发布</Button>
      <Button onClick={handleSubmit2}>发布2</Button>
      <ChannelList />
      <ChannelListAntd />
    </div>
  );
};

export default PublishArticle;