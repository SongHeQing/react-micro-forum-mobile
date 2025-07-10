import styles from "./index.module.scss";
import clsx from "clsx";


interface TopNavigationBarProps {
  onTypeChange?: (type: string) => void;
  onClose?: () => void;
  hideOtherTabs: boolean; // 新增：是否隐藏其他tabs
  onSubmitForm: () => void; // 新增：提交表单的回调
  activeTypeName: string; // 新增：当前激活的tab名称
  // isPublishEnabled: boolean; // 新增：控制发布按钮是否启用
}

const TopNavigationBar = ({ onTypeChange, onClose, hideOtherTabs, onSubmitForm, activeTypeName }: TopNavigationBarProps) => {
  const tabs = ["文章", "测试1", "测试2"]; // 

  const handleTabClick = (tab: string) => {
    onTypeChange?.(tab);
  };

  return (
    <div className={styles.topBarContainer}>
      <div className={styles.topBarLeft}>
        <div className={styles.closeIcon} onClick={onClose}>
          X
        </div>
      </div>
      <div className={styles.topBarCenter}>
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
      <div className={styles.topBarRight}>
        {hideOtherTabs && (
          <button
            onClick={onSubmitForm}
            className={clsx(styles.publishButton
              // , { [styles.publishButtonDisabled]: !isPublishEnabled }
            )}
          // disabled={!isPublishEnabled}
          >✨ 发布</button>
        )}
      </div>
    </div>
  );
};

export default TopNavigationBar; 