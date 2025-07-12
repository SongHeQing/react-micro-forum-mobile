import styles from './index.module.scss';
import { useState } from 'react';
import { login } from '@/apis/userApi';
import { useNavigate } from 'react-router';
import { Toast } from 'antd-mobile';
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true);
  const handleLogin = () => {
    login({ username, password }).then(() => {
      navigate('/');
    }).catch(err => {
      console.log(err.message);
      Toast.show(err.message);
    });

    // 如果输入了用户名和密码则切换登录按钮的禁用状态
    if (username && password) {
      setIsLoginButtonDisabled(false);
    } else {
      setIsLoginButtonDisabled(true);
    }

  }


  return (
    <div className={styles.LoginPage}>
      <div className={styles.Card}>
        <h2 className={styles.Title}>登录账号 体验完整功能</h2>
        <div className={styles.InputGroup}>
          <input className={styles.Input}
            placeholder="请输入手机号"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value) {
                setIsLoginButtonDisabled(false);
              } else {
                setIsLoginButtonDisabled(true);
              }
            }}
          />
        </div>
        <div className={styles.InputGroup}>
          {/* 点击则切换密码的显示状态 */}
          <div className={styles.EyeIcon} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>👁️</div>
          <input className={styles.Input}
            placeholder="请输入密码"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value) {
                setIsLoginButtonDisabled(false);
              } else {
                setIsLoginButtonDisabled(true);
              }
            }}
          />
        </div>
        <div className={styles.Options}>
          <span className={styles.Link}>更换设备登录</span>
          <span className={styles.Link}>忘记密码</span>
        </div>
        <button className={`${styles.LoginBtn} ${isLoginButtonDisabled ? styles.Disabled : ''}`}
          onClick={handleLogin}
          disabled={isLoginButtonDisabled}
        >登 录</button>
        <div className={styles.SmsLogin}>短信验证码登录</div>
      </div>
      <div className={styles.BottomLinks}>
        <span>换个账号</span>
        <span>|</span>
        <span>注册</span>
        <span>|</span>
        <span>帮助</span>
      </div>
    </div>
  )
}

export default Login;