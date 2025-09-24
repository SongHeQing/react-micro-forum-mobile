import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from 'react-router';
import { verifyRegisterCode } from '@/apis/userApi';
import { Toast } from 'antd-mobile';

const CODE_LENGTH = 6;

const VerifyCode: React.FC = () => {
  // const location = useLocation();
  // const { value, password, type, typeName, verifyType, verifyTypeName } = location.state || {};
  const verifyCode = JSON.parse(sessionStorage.getItem('verifyCode') || '{}');
  const { value, password, type, verifyType, verifyTypeName } = verifyCode;

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [timer, setTimer] = useState(50);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // 处理输入
  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // 处理退格
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // 倒计时效果
  useEffect(() => {
    if (timer === 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // 是否正在提交
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // 模拟请求
  const handleSubmit = useCallback(() => {
    const verifyCode = code.join('');
    // 这里写你的请求逻辑，比如：verifyCodeApi({ code: verifyCode, value, ... })
    // console.log('自动提交验证码:', verifyCode, value, password, type, typeName, verifyType, verifyTypeName);
    if (type === 'register' && verifyType === 'email') {
      verifyRegisterCode({ email: value, password }, verifyCode).then(() => {
        // 模拟请求完成后重置 isSubmitting 并跳转到登录页
        Toast.show({ icon: 'success', content: '验证码验证成功', });
        navigate('/login');
      }).catch(() => {
        // 清空验证码
        setCode(Array(CODE_LENGTH).fill(''));
        setIsSubmitting(false);
      });
    }
  }, [code, navigate, password, type, value, verifyType]);
  // 输入满自动提交
  useEffect(() => {
    if (isSubmitting) return;
    if (code.every(char => char !== '')) {
      setIsSubmitting(true);
      handleSubmit();
    }
  }, [code, handleSubmit, isSubmitting]);

  return (
    <div className={styles.VerifyCodePage}>
      <div className={styles.Header}>
        <span className={styles.Back} onClick={() => navigate(-1)}>&lt;</span>
        <span className={styles.Title}>输入{verifyTypeName}验证码</span>
      </div>
      <div className={styles.Content}>
        <h2 className={styles.MainTitle}>输入{verifyTypeName}验证码</h2>
        <div className={styles.SubTitle}>{verifyTypeName}验证码至 <span className={styles.Phone}>{value}</span></div>
        <div className={styles.CodeInputGroup}>
          {code.map((v, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              className={styles.CodeInput}
              type="text"
              maxLength={1}
              value={v}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={isSubmitting}
            />
          ))}
        </div>
        {/* <div className={styles.Timer}>{timer}秒后重新发送</div> */}
      </div>
    </div>
  );
};

export default VerifyCode;
