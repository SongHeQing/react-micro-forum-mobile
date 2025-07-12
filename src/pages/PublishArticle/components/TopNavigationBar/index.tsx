import styles from "./index.module.scss";
import clsx from "clsx";
import { useAutoFlexCenter } from "./hooks/useFlexOverflowSwitch";

const tabs = ["文章"];

/**
 * @description 顶部导航栏组件的props类型
 * @param onTypeChange 类型改变回调
 * @param onClose 关闭回调
 * @param hideOtherTabs 是否隐藏其他tabs
 * @param onSubmitForm 提交表单回调
 * @param activeTypeName 当前激活的tab名称
 * @param isPublishEnabled 是否启用发布按钮
 */
interface TopNavigationBarProps {
  onTypeChange?: (type: string) => void;
  onClose?: () => void;
  hideOtherTabs: boolean;
  onSubmitForm: () => void;
  activeTypeName: string;
  isPublishEnabled: boolean;
}

const TopNavigationBar = ({ onTypeChange, onClose, hideOtherTabs, onSubmitForm, activeTypeName, isPublishEnabled }: TopNavigationBarProps) => {
  // 自定义hook，用于实现“内容不溢出时容器flex-center，溢出时容器布局flex-start + 滚动 overflow-x: auto”的自适应 flex 布局
  // 返回值：containerRef: 容器ref, contentRef: 内容ref, isOverflow: 是否溢出
  const { containerRef, contentRef, isOverflow } = useAutoFlexCenter();

  /**
   * @description 处理tab点击事件
   * @param tab 点击的tab名称
   */
  const handleTabClick = (tab: string) => {
    // 调用onTypeChange回调，更新当前激活的tab名称
    onTypeChange?.(tab);
  };

  return (
    <div className={styles.topBarContainer}>
      {/* 关闭按钮 */}
      <div className={styles.topBarLeft}>
        <div className={styles.closeIcon} onClick={onClose}>
          <svg className={styles.icon} viewBox="0 0 28 28">
            <line x1="6" y1="6" x2="22" y2="22" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="6" x2="6" y2="22" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* 中间内容区域 */}
      <div className={styles.topBarCenter} ref={containerRef}>
        {/* containerRef 作用：获取容器宽度，用于判断是否溢出*/}
        {/* contentRef 作用： 获取tabs宽度，动态设置flex布局，判断是否溢出 containerRef，如果溢出，则设置contentRef的布局为justify-content:flex-start + 滚动 overflow-x: auto，
                            默认布局为justify-content: center;*/}
        <div ref={contentRef} className={clsx({ [styles.overflow]: isOverflow })}>
          {hideOtherTabs ? (
            <div className={clsx(styles.tabItem, styles.singleTab, styles.boldTextOnly)}> {/* 添加 styles.boldTextOnly */}
              {activeTypeName}
            </div>
          ) : (
            tabs.map((tab) => (
              <div
                key={tab}
                className={clsx(styles.tabItem, { [styles.active]: activeTypeName === tab })}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            ))
          )}
        </div>
      </div>
      {/* 右侧按钮 */}
      <div className={styles.topBarRight}>
        {hideOtherTabs && (
          <button
            onClick={onSubmitForm}
            className={clsx(styles.publishButton
              , { [styles.publishButtonDisabled]: !isPublishEnabled }
            )}
            disabled={!isPublishEnabled}
          >✨发布</button>
        )}
      </div>
    </div>
  );
};

export default TopNavigationBar; 