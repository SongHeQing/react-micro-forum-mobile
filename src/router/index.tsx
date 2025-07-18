import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import Detail from '@/pages/ArticleDetail';
import PublishArticle from '@/pages/PublishArticle';
import Login from '@/pages/Login';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail" element={<Detail />} />
      <Route path="/publish" element={<PublishArticle />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
