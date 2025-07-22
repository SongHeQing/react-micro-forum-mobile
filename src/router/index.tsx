import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import Detail from '@/pages/ArticleDetail';
import PublishArticle from '@/pages/PublishArticle';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyCode from '@/pages/VerifyCode';
import ArticleDetail from '@/pages/ArticleDetail';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail" element={<Detail />} />
      <Route path="/publish" element={<PublishArticle />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
