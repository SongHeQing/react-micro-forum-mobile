import styles from './TabBar.module.scss';
import { useNavigate } from 'react-router';

// 加号svg的vw转化

const TabBar = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.TabBar}>
      <div className={styles.TabItem + ' ' + styles.TabItemActive}>
        <span className={styles.Icon}>🏠</span>
        <span className={styles.Label}>首页</span>
      </div>
      <div className={styles.TabItem}>
        <span className={styles.Icon}>🧭</span>
        <span className={styles.Label}>进吧</span>
      </div>
      <div className={styles.TabItem}
        onClick={() => {
          navigate('/publish');
        }}
      >
        {/* 按钮外壳，圆角 */}
        <div className={styles.TabAdd}>
          {/* svg外壳 */}
          <div className={styles.AddIconWrapper}>
            <svg viewBox="0 0 28 28" fill="none" className={styles.AddIcon}>
              <path d="M14 5V23" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <path d="M5 14H23" stroke="white" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.TabItem}>
        <span className={styles.Icon}>💬</span>
        <span className={styles.Label}>消息</span>
        {/* <span className={styles.Badge}>2</span> */}
      </div>
      <div className={styles.TabItem}>
        <span className={styles.Icon}>👤</span>
        <span className={styles.Label}>我的</span>
      </div>
    </div>
  );
};

export default TabBar; 