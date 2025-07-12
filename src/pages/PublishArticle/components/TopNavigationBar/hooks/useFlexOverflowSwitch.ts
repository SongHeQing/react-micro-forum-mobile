import { useEffect, useRef, useState } from "react";

/**
 * 用于实现“内容不溢出时居中，溢出时左对齐”的自适应 flex 布局
 * @returns [containerRef, contentRef, isOverflow]
 */
export function useAutoFlexCenter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current && containerRef.current) {
        setIsOverflow(contentRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return { containerRef, contentRef, isOverflow };
}