import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';

const Layout = lazy(() => import('@/pages/Layout'));
const Home = lazy(() => import('@/pages/Home'));
// const Channels = lazy(() => import('@/pages/Channels'));
const Profile = lazy(() => import('@/pages/Profile'));
const PublishArticle = lazy(() => import('@/pages/PublishArticle'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const VerifyCode = lazy(() => import('@/pages/VerifyCode'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const User = lazy(() => import('@/pages/User'));
const Settings = lazy(() => import('@/pages/Settings'));

const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        {/* 使用Layout作为布局的路由组 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/channels" element={<div>频道</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<div>消息页面</div>} />
        </Route>

        {/* 不使用Layout的独立页面 */}
        <Route path="/publish" element={<PublishArticle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Router;
