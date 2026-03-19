import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';

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
const Channel = lazy(() => import('@/pages/Channel'));
const CreateChannel = lazy(() => import('@/pages/CreateChannel'));
const CompleteChannelInfo = lazy(() => import('@/pages/CompleteChannelInfo'));

// 创建路由配置
const router = createBrowserRouter([
  {
    path: "/", element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "channels", element: <div>频道</div> },
      { path: "profile", element: <Profile /> },
      { path: "messages", element: <div>消息页面</div> }
    ]
  },
  { path: "/publish", element: <PublishArticle /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-code", element: <VerifyCode /> },
  { path: "/article/:id", element: <ArticleDetail /> },
  { path: "/user/:id", element: <User /> },
  { path: "/settings", element: <Settings /> },
  { path: "/channel/:id", element: <Channel /> },
  { path: "/create-channel", element: <CreateChannel /> },
  { path: "/complete-channel-info", element: <CompleteChannelInfo /> }
]);

export default router;