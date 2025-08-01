import { BrowserRouter, Routes, Route } from 'react-router';
// import Home from '@/pages/Home';
// import PublishArticle from '@/pages/PublishArticle';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import VerifyCode from '@/pages/VerifyCode';
// import ArticleDetail from '@/pages/ArticleDetail';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('@/pages/Home'));
const PublishArticle = lazy(() => import('@/pages/PublishArticle'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const VerifyCode = lazy(() => import('@/pages/VerifyCode'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));

const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publish" element={<PublishArticle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Router;
