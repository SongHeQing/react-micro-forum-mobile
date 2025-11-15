# Toast 组件使用文档

## 简介

Toast 组件是一个支持指令式调用的轻量级提示组件，可以在任何地方通过函数调用来显示提示信息，无需在 JSX 中手动添加组件标签。

## 功能特性

1. 支持指令式调用（无需在 JSX 中添加组件标签）
2. 自动显示和隐藏（默认 3 秒后自动消失）
3. 支持自定义显示时间
4. 进入和退出动画效果
5. 当前一个提示还未消失时，新的提示会立即替换旧的提示

## 使用方法

### 1. 导入组件

```typescript
import { showToast, showSuccess, showWarning } from '@/components/Toast';
```

### 2. 基础使用

```typescript
// 显示成功提示
showSuccess('操作成功');

// 显示警告提示
showWarning('操作警告');
```

### 3. 自定义显示时间

```typescript
// 显示成功提示，5 秒后自动消失
showSuccess('操作成功', 5000);

// 显示警告提示，1 秒后自动消失
showWarning('操作警告', 1000);
```

### 4. 使用基础方法

```typescript
// 显示成功提示
showToast('success', '自定义成功消息', 3000);

// 显示警告提示
showToast('warning', '自定义警告消息', 3000);
```

## 连续调用行为

当一个 Toast 还未消失时，如果调用新的 Toast，旧的 Toast 会立即消失，新的 Toast 会立即显示：

```typescript
// 连续调用测试
setTimeout(() => {
  showSuccess('第一条消息');
}, 0);

setTimeout(() => {
  showWarning('第二条消息会替换第一条');
}, 1000);

setTimeout(() => {
  showSuccess('第三条消息会替换第二条');
}, 2000);
```

## 注意事项

1. 组件会自动在页面 body 中创建和销毁 DOM 元素
2. 无需手动管理组件的显示和隐藏状态
3. 组件使用单例模式，同一时间只会显示一个 Toast