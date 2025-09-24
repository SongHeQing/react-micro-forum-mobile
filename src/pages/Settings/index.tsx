import React from 'react';
import styles from './index.module.scss';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '@/store/modules/user';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // 清除登录状态
    dispatch(clearUserInfo());
    // 跳转到登录页
    navigate('/');
  };

  return (
    <div className={styles.settingsPage}>
      {/* 占位 */}
      <div className={styles.placeholder}></div>
      {/* 上固定栏 */}
      <div className={styles.header}>
        <svg className={styles.icon}
          onClick={() => navigate(-1)}
          viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1744" width="200" height="200"><path d="M376.235 512l356.382-356.382c15.621-15.621 15.621-40.948 0-56.568-15.621-15.621-40.947-15.621-56.568 0L291.383 483.716c-15.621 15.621-15.621 40.947 0 56.568L676.049 924.95c15.621 15.621 40.947 15.621 56.568 0s15.621-40.947 0-56.568L376.235 512z" p-id="1745"></path></svg>
        <div className={styles.title}>设置</div>
      </div>
      {/* 区域 */}
      <div className={styles.settingsSection}>
        <div className={styles.logout} onClick={handleLogout}>
          退出登录
        </div>
      </div>
    </div>
  );
};

export default Settings;