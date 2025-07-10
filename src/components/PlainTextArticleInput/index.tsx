import React from 'react';
import styles from './index.module.scss';
// import ReactQuill from 'react-quill'; // 移除 ReactQuill 导入
// import 'react-quill/dist/quill.snow.css'; // 移除样式导入

interface ArticleContentInputProps {
  value: string; // 将 contentPreview2 改名为 value，适用于 textarea
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // 适用于 textarea 的 onChange
  onFocus: () => void; // 保持 onFocus
  placeholder?: string; // 添加 placeholder
}

const ArticleContentInput: React.FC<ArticleContentInputProps> = ({
  value,
  onChange,
  onFocus,
  placeholder,
}) => {
  return (
    <textarea
      className={styles['publish-article-textarea']}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder || "请输入文章内容"} // 使用传入的 placeholder 或默认值
    />
  );
};

export default ArticleContentInput; 