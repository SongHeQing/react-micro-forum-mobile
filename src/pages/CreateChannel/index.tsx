import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import styles from './index.module.scss'
import CreateChannelTitle from './icons/create-channel-title.svg?react'
import ArrowRight from './icons/arrow-right.svg?react'
import ToastComponent from '@/components/Toast'
import { autoResizeTextarea } from '@/utils/textareaUtils'
import { createChannel } from '@/apis/channelApi'

const CreateChannel: React.FC = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  // 步骤状态管理
  const [step, setStep] = useState<number>(1)

  // 表单数据状态管理
  const [formData, setFormData] = useState({
    channelName: '', // 频道名称 (最多14字符)
    channelAvatar: null as File | null,
    channelDescription: '', // 频道简介 (最多20字符)
    channelDetail: '',       // 详细简介 (最多500字符)
    channelBackground: null as File | null, // 频道背景图片
  })

  // 表单验证状态
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  // 预览URL状态
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null)

  // 实时检测表单是否符合要求
  useEffect(() => {
    if (step === 1) {
      // 第一步需要检查频道名称和头像
      setIsFormValid(!!formData.channelName.trim() && !!formData.channelAvatar)
    } else {
      // 第二步需要检查频道简介和详细简介（可选，但有最大长度限制）
      const isDescriptionValid = formData.channelDescription.length <= 20;
      const isDetailValid = formData.channelDetail.length <= 500;
      setIsFormValid(isDescriptionValid && isDetailValid)
    }
  }, [formData, step])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'channelDescription' || e.target.name === 'channelDetail') {
      // 输入框为textarea时，需要手动调用autoResizeTextarea函数
      autoResizeTextarea(e.target as HTMLTextAreaElement)
    }
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      channelAvatar: file
    }))

    // 生成预览URL
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    } else {
      setAvatarPreview(null)
    }
  }

  // 处理背景图片上传
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      channelBackground: file
    }))

    // 生成预览URL
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setBackgroundPreview(previewUrl)
    } else {
      setBackgroundPreview(null)
    }
  }

  // 处理下一步按钮点击
  const handleNextStep = async () => {
    if (step === 1) {
      // 检查频道名称是否为空
      if (!formData.channelName.trim()) {
        ToastComponent.warning('请输入频道名称')
        return
      }

      // 检查频道名称是否包含特殊字符
      const specialCharRegex = /[^\u4e00-\u9fa5\w\s]/ // 匹配中文、英文、数字、下划线和空格以外的字符
      if (specialCharRegex.test(formData.channelName)) {
        ToastComponent.warning('频道名称不能包含特殊字符')
        return
      }

      // 检查是否选择了头像
      if (!formData.channelAvatar) {
        ToastComponent.warning('请选择头像')
        return
      }

      setStep(2)
    } else {
      // 检查频道简介长度
      if (formData.channelDescription.length > 20) {
        ToastComponent.warning('频道简介不能超过20个字')
        return
      }

      // 检查详细简介长度
      if (formData.channelDetail.length > 500) {
        ToastComponent.warning('详细简介不能超过500个字')
        return
      }

      // 提交表单逻辑 - 使用FormData格式上传数据和文件
      const channelFormData = new FormData()
      channelFormData.append('channelname', formData.channelName)
      if (formData.channelAvatar) {
        channelFormData.append('avatar', formData.channelAvatar)
      }
      channelFormData.append('description', formData.channelDescription)
      channelFormData.append('detail', formData.channelDetail)
      if (formData.channelBackground) {
        channelFormData.append('background', formData.channelBackground)
      }

      try {
        await createChannel(channelFormData)
        ToastComponent.success('频道创建成功！')
        // 创建成功后返回上一页或跳转到频道列表
        setTimeout(() => {
          navigate(-1)
        }, 1500)
      } catch (error) {
        console.error('创建频道失败:', error)
        ToastComponent.warning('频道创建失败，请重试')
      }
    }
  }

  // 处理返回按钮点击
  const handleBack = () => {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep(1)
    }
  }

  return (
    <div className={styles.createChannel}>
      {/* 背景装饰元素 */}
      <div className={styles.backgroundDecorations}>
        <div className={styles.gradient1}></div>
      </div>

      <div className={styles.content}>
        {/* 标题 */}
        <div className={styles.title}>
          <CreateChannelTitle />
          <div className={styles.gradient2}></div>
          {/* 添加额外的装饰元素以匹配Figma设计 */}
          <div className={styles.decorationGroup}>
            <div className={styles.decorationElement1}></div>
            <div className={styles.decorationElement2}></div>
            <div className={styles.decorationElement3}></div>
            <div className={styles.decorationElement4}></div>
            <div className={styles.decorationElement5}></div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className={styles.stepIndicator}>
          <div className={styles.step}>
            <div className={`${styles.stepCircle} ${step === 1 ? styles.active : ''}`}>
              <div className={styles.stepDot}>
                1
              </div>
            </div>
            <span className={styles.stepLabel}>基本信息</span>
          </div>

          <div className={styles.stepLine}></div>

          <div className={styles.step}>
            <div className={`${styles.stepCircle} ${step === 2 ? styles.active : ''}`}>
              <div className={styles.stepDot}>
                2
              </div>
            </div>
            <span className={styles.stepLabel}>完善信息</span>
          </div>
        </div>

        {/* 表单区域 - 第一步 */}
        {step === 1 && (
          <div className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>个人信息</div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>创建人*</label>
                <div className={styles.placeholder}>
                  {user.userInfo.nickname || ''}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>频道信息</div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>频道名*</label>
                <input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="最多14个字"
                  maxLength={14}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>频道头像*</label>
                <div className={styles.right}>
                  <div className={styles.avatarUpload}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className={styles.fileInput}
                      aria-label="上传频道头像"
                    />
                    <div className={styles.uploadPlaceholder}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="频道头像预览" className={styles.avatarPreview} />
                      ) : (
                        <span>+</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 表单区域 - 第二步 */}
        {step === 2 && (
          <div className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.sectionTitle}>信息完善</div>

              {/* 频道简介输入框 - 按照Figma设计 */}
              <div className={styles.formItem}>
                <label className={styles.formItemLabel}>频道简介</label>
                <div className={styles.formItemContent}>
                  <textarea
                    name="channelDescription"
                    value={formData.channelDescription}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    placeholder="概况本频道主题，语言明确且有吸引力"
                    maxLength={20}
                    rows={1}
                  />
                  <span className={styles.formItemHint}>
                    {formData.channelDescription.length <= 0
                      ? '5-20'
                      : `${formData.channelDescription.length}/20`}
                  </span>
                </div>
              </div>

              {/* 详细简介输入框 - 按照Figma设计 */}
              <div className={styles.formItem}>
                <label className={styles.formItemLabel}>详细简介</label>
                <div className={styles.formItemContent}>
                  <textarea
                    name="channelDetail"
                    value={formData.channelDetail}
                    onChange={handleInputChange}
                    className={`${styles.formTextarea} ${styles.large}`}
                    placeholder="概况本频道主题，语言明确且有吸引力"
                    maxLength={500}
                    rows={1}
                  />
                  <span className={styles.formItemHint}>
                    {formData.channelDetail.length <= 0
                      ? '20-500'
                      : `${formData.channelDetail.length}/500`}
                  </span>
                </div>
              </div>

              {/* 频道背景设置 - 按照Figma设计 */}
              <div className={styles.inputGroup}>
                <span className={styles.label}>频道背景</span>
                <div className={styles.right}>
                  <div className={styles.backgroundAction} onClick={() => backgroundInputRef.current?.click()}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      ref={backgroundInputRef}
                      className={styles.fileInput}
                      aria-label="上传频道背景"
                    />
                    {backgroundPreview ? (
                      <img
                        src={backgroundPreview}
                        alt="频道背景预览"
                        className={styles.backgroundPreview}
                      />
                    ) : (
                      <>
                        <span className={styles.setBackgroundText}>去设置</span>
                        <ArrowRight />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.topSection}>
        {/* 返回按钮 */}
        <svg onClick={handleBack} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 19L8.5 12L15.5 5" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 下一步按钮 */}
      <div className={styles.bottomSection}>
        <button
          className={`${styles.nextButton} ${isFormValid ? styles.nextButtonActive : styles.nextButtonInactive}`}
          onClick={handleNextStep}
        >
          {step === 1 ? '下一步' : '创建我的频道'}
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;