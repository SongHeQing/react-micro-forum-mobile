import styles from './index.module.scss';
import { useState } from 'react';
import { register } from '@/apis/userApi';
// import { useNavigate } from 'react-router';
import { Modal } from 'antd-mobile';
// import { useDispatch } from 'react-redux';
// import type { RegisterParams } from '@/types/user';
import clsx from 'clsx';
import { isfieldErrorsResponseType } from '@/utils/typeGuards';
import { useNavigate } from 'react-router';
/**
 * 注册页面
 */
const Register = () => {
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log(email, password);
    register({ email, password },).then(() => {
      // setIsModalVisible(true);
      navigate('/verify-code', { state: { value: email, password, type: 'register', typeName: '注册', verifyType: 'email', verifyTypeName: '邮箱' } });
    }).catch(err => {
      if (isfieldErrorsResponseType(err.response.data)) {
        const { fieldErrors } = err.response.data;
        setResponseErrorMessage([...Object.values(fieldErrors) as string[]]);
      } else {
        setResponseErrorMessage([err.response.data.message]);
      }
    });
  }

  const [responseErrorMessage, setResponseErrorMessage] = useState<string[]>([]);

  // const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);




  return (
    <div className={styles.LoginPage}>
      <div className={styles.Top}>
        <div className={styles.Logo}>
        </div>
      </div>
      <div className={styles.Card}>
        <h2 className={styles.Title}>欢迎注册微社区账号</h2>
        <div className={styles.InputGroup}>
          <input className={styles.Input}
            placeholder="请输入邮箱"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
          <div className={styles.EyeIcon} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? (
              <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 336c-97.202 0-176 78.798-176 176s78.798 176 176 176 176-78.798 176-176-78.798-176-176-176z m0 272c-52.935 0-96-43.065-96-96s43.065-96 96-96 96 43.065 96 96-43.065 96-96 96z" fill="#333333"></path>
                <path d="M940.237 357.788C841.901 227.802 681.123 135.725 512 135.725S182.1 227.802 83.763 357.788c-69.017 91.231-69.017 217.191 0 308.423C182.1 796.198 342.877 888.275 512 888.275s329.901-92.077 428.237-222.064c69.018-91.232 69.018-217.191 0-308.423z m-63.799 260.157C787.625 735.345 647.98 808.275 512 808.275c-135.979 0-275.623-72.93-364.437-190.329-47.19-62.38-47.19-149.514-0.001-211.893C236.377 288.654 376.021 215.725 512 215.725c135.979 0 275.624 72.93 364.438 190.328 47.19 62.38 47.19 149.513 0 211.892z" fill="#333333"></path>
              </svg>
            ) : (
              <svg className={styles.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4718">
                <path d="M943.254 375.558l-0.12-0.1c-17.357-14.294-42.775-11.232-56.859 6.295C798.229 491.322 663.174 561.584 512 561.584s-286.229-70.262-374.274-179.831c-14.084-17.527-39.502-20.589-56.859-6.295l-0.12 0.1c-16.76 13.801-19.687 38.642-6.122 55.594 43.269 54.077 96.432 99.831 156.62 134.821L170.943 689.61c-9.685 19.855-1.439 43.803 18.416 53.486h0.001c19.855 9.685 43.802 1.439 53.486-18.416l60.279-123.591c52.793 21.266 109.532 34.73 168.875 38.927v137.568c0 22.091 17.908 40 40 40s40-17.909 40-40V640.016c59.343-4.196 116.082-17.661 168.875-38.927l60.279 123.591c9.685 19.855 33.631 28.101 53.486 18.417 19.856-9.685 28.102-33.632 18.417-53.487l-60.302-123.637c60.188-34.99 113.352-80.744 156.62-134.821 13.565-16.953 10.639-41.794-6.121-55.594z"></path>
              </svg>
            )}
          </div>
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
        {/* 错误提示 */}
        <div className={clsx(styles.Error, responseErrorMessage.length > 0)}>
          {responseErrorMessage.map((message, index) => (
            <div className={styles.ErrorText} key={index}>{message}</div>
          ))}
        </div>
        {/* 忘记密码 */}
        <div className={styles.Options}>
          {/* <span className={styles.Link}>更换设备登录</span> */}
          <span className={styles.Link}>忘记密码</span>
        </div>
        <button className={`${styles.LoginBtn} ${isLoginButtonDisabled ? styles.Disabled : ''}`}
          onClick={handleRegister}
          disabled={isLoginButtonDisabled}
        >立即注册</button>
        {/* <div className={styles.SmsLogin}>验证码登录</div> */}
      </div>
      <div className={styles.BottomLinks}>
      </div>
      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content="请输入邮箱验证码"
      />
    </div >
  );
}

export default Register;
