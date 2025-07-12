import React from 'react';
import styles from './index.module.scss';

interface PlainArticleContentInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  placeholder?: string;
}

const PlainArticleContentInput: React.FC<PlainArticleContentInputProps> = ({
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
      placeholder={placeholder || "请输入文章内容"}
    />
  );
};

export default PlainArticleContentInput; 