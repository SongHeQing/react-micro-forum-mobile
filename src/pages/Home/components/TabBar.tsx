import styles from './TabBar.module.scss';
import { useNavigate } from 'react-router';

// 加号svg的vw转化

const TabBar = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.TabBar}>
      <div className={styles.TabItem + ' ' + styles.TabItemActive}>
        <span className={styles.Icon}>
          <svg className={styles.Icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M879.555 310.718l-218.756-194.44c-42.437-37.72-95.622-56.578-148.813-56.576-53.19 0.001-106.387 18.862-148.821 56.584L144.438 310.718A192.002 192.002 0 0 0 80 454.218V768c0 106.038 85.961 192 192 192h480c106.039 0 192-85.962 192-192V454.224a192.001 192.001 0 0 0-64.445-143.506zM416 880V720c0-52.935 43.065-96 96-96s96 43.065 96 96v160H416z m448-112c0 61.757-50.243 112-112 112h-64V720c0-97.202-78.798-176-176-176s-176 78.798-176 176v160h-64c-61.757 0-112-50.243-112-112V454.218a112.09 112.09 0 0 1 37.589-83.708l218.727-194.433a143.868 143.868 0 0 1 95.677-36.376 143.846 143.846 0 0 1 95.659 36.371L826.407 370.51A112.096 112.096 0 0 1 864 454.224V768z"  ></path></svg>
        </span>
        <span className={styles.Label}>首页</span>
      </div>
      <div className={styles.TabItem}>
        <span className={styles.Icon}>🧭</span>
        <span className={styles.Label}>频道</span>
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