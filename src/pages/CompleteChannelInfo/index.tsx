import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavBar, Toast } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import styles from './index.module.scss';

// 创建频道第二步：完善信息页面
const CompleteChannelInfo: React.FC = () => {
  const navigate = useNavigate();
  const [channelDescription, setChannelDescription] = useState(''); // 频道简介
  const [channelDetail, setChannelDetail] = useState(''); // 详细简介
  
  // 处理返回上一页
  const handleBack = () => {
    navigate(-1);
  };
  
  // 处理下一步按钮点击
  const handleNextStep = () => {
    // 检查必填字段
    if (!channelDescription.trim()) {
      Toast.show('请输入频道简介');
      return;
    }
    
    if (channelDescription.length < 5) {
      Toast.show('频道简介至少需要5个字');
      return;
    }
    
    if (channelDescription.length > 20) {
      Toast.show('频道简介不能超过20个字');
      return;
    }
    
    if (!channelDetail.trim()) {
      Toast.show('请输入详细简介');
      return;
    }
    
    if (channelDetail.length < 20) {
      Toast.show('详细简介至少需要20个字');
      return;
    }
    
    if (channelDetail.length > 500) {
      Toast.show('详细简介不能超过500个字');
      return;
    }
    
    // 这里可以添加提交逻辑
    console.log('频道信息:', { channelDescription, channelDetail });
    Toast.show('频道创建成功！');
    // 跳转到频道页面或其他页面
    navigate('/channel');
  };
  
  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <NavBar 
        className={styles.navBar}
        back={null}
        left={<LeftOutline fontSize={24} />}
        onBack={handleBack}
      >
        创建你喜欢的频道吧
      </NavBar>
      
      {/* 步骤指示器 */}
      <div className={styles.stepsContainer}>
        <div className={styles.step}>
          <div className={styles.stepNumberContainer}>
            <div className={styles.stepNumberCompleted}>
              <span className={styles.number}>1</span>
            </div>
          </div>
          <span className={styles.stepLabelCompleted}>基本信息</span>
        </div>
        
        <div className={styles.stepLine}></div>
        
        <div className={styles.step}>
          <div className={styles.stepNumberContainer}>
            <div className={styles.stepNumberActive}>
              <span className={styles.number}>2</span>
            </div>
          </div>
          <span className={styles.stepLabelActive}>完善信息</span>
        </div>
      </div>
      
      {/* 表单内容 */}
      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>信息完善</h2>
          
          {/* 频道简介输入框 */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>频道简介</label>
            <div className={styles.inputWrapper}>
              <textarea
                className={styles.textarea}
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                placeholder="概况本频道主题，语言明确且有吸引力"
                maxLength={20}
              />
              <span className={styles.wordCount}>
                {channelDescription.length}/20
              </span>
            </div>
          </div>
          
          {/* 详细简介输入框 */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>详细简介</label>
            <div className={styles.inputWrapper}>
              <textarea
                className={`${styles.textarea} ${styles.large}`}
                value={channelDetail}
                onChange={(e) => setChannelDetail(e.target.value)}
                placeholder="概况本频道主题，语言明确且有吸引力"
                maxLength={500}
              />
              <span className={styles.wordCount}>
                {channelDetail.length}/500
              </span>
            </div>
          </div>
          
          {/* 频道背景设置 */}
          <div className={styles.backgroundSetting}>
            <span className={styles.backgroundLabel}>频道背景</span>
            <div className={styles.backgroundAction}>
              <span className={styles.setBackgroundText}>去设置</span>
              <div className={styles.arrowIcon}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 下一步按钮 */}
      <div className={styles.nextButtonContainer}>
        <div className={styles.nextButton} onClick={handleNextStep}>
          <span className={styles.buttonText}>创建我的频道</span>
        </div>
      </div>
    </div>
  );
};

export default CompleteChannelInfo;