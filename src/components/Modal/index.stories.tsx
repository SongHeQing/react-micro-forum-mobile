import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Modal from './index';
import { ModalProps } from './index';

// 这是一个 Storybook 配置文件，用于展示和测试组件
// Storybook 是一个用于开发和展示 UI 组件的工具
// 它允许你在隔离的环境中查看组件在不同状态下的表现

export default {
  title: 'Components/Modal', // 在 Storybook 中的组件分类和名称
  component: Modal, // 要展示的组件
} as Meta;

// 模板函数，用于创建不同的故事
const Template: StoryFn<React.ComponentProps<typeof Modal>> = (args) => <Modal {...args} />;

// 默认故事 - 展示 Modal 组件的基本用法
export const Default = Template.bind({});
Default.args = {
  visible: true,
  title: '标题',
  options: ['选项1', '选项2'],
} as ModalProps;

// 多选项故事 - 展示 Modal 组件在有多个选项时的表现
export const WithManyOptions = Template.bind({});
WithManyOptions.args = {
  visible: true,
  title: '选择操作',
  options: ['选项1', '选项2', '选项3', '选项4'],
} as ModalProps;