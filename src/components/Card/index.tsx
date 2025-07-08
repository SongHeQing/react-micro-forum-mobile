import React, { useRef, useEffect, useState } from "react";
import type { Article } from "@/types";
import { getLineCount } from "@/utils/lineCount";
import './index.scss';

interface CardProps {
  article: Article;
}

const Card: React.FC<CardProps> = ({ article }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [contentLineCount, setContentLineCount] = useState<number>(0);

  useEffect(() => {
    // 统计标题和内容当前行数
    const titleLineCount: number = getLineCount(titleRef.current);
    //标题和内容最大行数
    const maxLineCount: number = 5;
    //动态计算最大行数减去标题行数剩余的行数，根据剩余的行数限制内容行数
    const remainingLineCount: number = maxLineCount - titleLineCount;
    setContentLineCount(remainingLineCount);
  }, []);

  return (
    <div className="card">
      <div className="card-header">header</div>
      <div className="card-body">
        {/* 限制标题为最大两行，超出显示省略号 */}
        <div className="card-body-title" ref={titleRef}>{article.title}</div>
        <div className="card-body-content"
          style={{
            WebkitLineClamp: contentLineCount,
            lineClamp: contentLineCount,
          }}
        >
          {article.contentPreview}
        </div>
        <div className="card-body-img"></div>
      </div>
      <div className="card-footer">footer</div>
    </div>
  );
};

export default Card; 