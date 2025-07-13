# SCSS 到 CSS Module 重构指南

## 重构前后对比

### 1. 文件结构变化

**重构前：**
```
src/components/Card/
├── index.scss          # 普通SCSS文件
└── index.tsx           # 使用字符串类名
```

**重构后：**
```
src/components/Card/
├── index.module.scss   # CSS Module文件
└── index.tsx           # 使用styles对象
```

### 2. SCSS文件重构

#### 重构前（嵌套结构）：
```scss
.card {
  width: vw(1210);
  
  .card-header {
    display: flex;
    
    .card-header-channel {
      display: flex;
      
      .card-header-channel-avatar-img {
        width: vw(110);
      }
    }
  }
}
```

#### 重构后（扁平化结构）：
```scss
.cardContainer {
  width: vw(1210);
}

.cardHeader {
  display: flex;
}

.cardHeaderChannel {
  display: flex;
}

.cardHeaderChannelAvatarImg {
  width: vw(110);
}
```

### 3. TSX文件重构

#### 重构前：
```tsx
import './index.scss';

return (
  <div className="card">
    <div className="card-header">
      <div className="card-header-channel">
        <img className="card-header-channel-avatar-img" />
      </div>
    </div>
  </div>
);
```

#### 重构后：
```tsx
import styles from './index.module.scss';

return (
  <div className={styles.cardContainer}>
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderChannel}>
        <img className={styles.cardHeaderChannelAvatarImg} />
      </div>
    </div>
  </div>
);
```

### 4. 动画类名处理

#### 重构前：
```tsx
const { getAnimationClassName } = useClickAnimation();

<svg className={getAnimationClassName('icon icon-fill')} />
```

#### 重构后：
```tsx
const { getModuleAnimationClassName } = useClickAnimation();

<svg className={getModuleAnimationClassName(styles.icon, styles.iconAnimate)} />
```

## 重构优势

### 1. **样式隔离**
- CSS Module自动生成唯一类名，避免样式冲突
- 每个组件的样式都是独立的

### 2. **更好的TypeScript支持**
- 类名有类型检查，避免拼写错误
- IDE提供自动补全

### 3. **更清晰的代码结构**
- 扁平化的类名结构，易于维护
- 明确的样式依赖关系

### 4. **更好的性能**
- 只加载组件需要的样式
- 减少CSS选择器的复杂度

## 命名规范

### 1. **类名命名**
- 使用PascalCase：`cardContainer`、`cardHeader`
- 避免连字符：`card-header` → `cardHeader`
- 语义化命名：`iconFill`、`iconStroke`

### 2. **文件命名**
- 组件样式：`ComponentName.module.scss`
- 页面样式：`PageName.module.scss`

### 3. **导入命名**
```tsx
import styles from './index.module.scss';
// 或者
import componentStyles from './ComponentName.module.scss';
```

## 常用模式

### 1. **条件类名**
```tsx
import clsx from 'clsx';

<div className={clsx(
  styles.baseClass,
  isActive && styles.activeClass,
  isDisabled && styles.disabledClass
)} />
```

### 2. **组合类名**
```tsx
<div className={`${styles.baseClass} ${styles.modifierClass}`} />
```

### 3. **动态类名**
```tsx
<div className={styles[`variant${variant}`]} />
```

## 注意事项

### 1. **全局样式**
- CSS Module中的样式默认是局部的
- 需要全局样式时使用`:global`选择器

```scss
:global(.global-class) {
  // 全局样式
}
```

### 2. **第三方库样式**
- 某些第三方库可能需要全局类名
- 使用`:global`包装这些类名

### 3. **CSS变量**
- CSS变量在CSS Module中仍然可以正常使用
- 建议在根级别定义全局变量

```scss
:root {
  --primary-color: #333;
}

.component {
  color: var(--primary-color);
}
```

## 迁移步骤

1. **重命名文件**：`.scss` → `.module.scss`
2. **扁平化嵌套结构**：将嵌套的SCSS转换为扁平结构
3. **更新类名**：使用PascalCase命名
4. **更新导入**：`import './styles.scss'` → `import styles from './styles.module.scss'`
5. **更新JSX**：`className="class-name"` → `className={styles.className}`
6. **处理条件类名**：使用`clsx`或条件表达式
7. **测试样式**：确保所有样式正常工作

## 工具支持

### 1. **VS Code插件**
- CSS Modules
- SCSS IntelliSense

### 2. **TypeScript配置**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

### 3. **Webpack配置**
```js
{
  test: /\.module\.scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    },
    'sass-loader'
  ]
}
``` 