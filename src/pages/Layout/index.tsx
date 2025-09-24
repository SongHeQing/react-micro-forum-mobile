import TabBar from '../Home/components/TabBar';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const TabBarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'channels' | 'publish' | 'messages' | 'profile'>('home');

  // 根据当前路由确定激活的标签
  useEffect(() => {
    const pathMap: Record<string, typeof activeTab> = {
      '/': 'home',
      '/channels': 'channels',
      '/publish': 'publish',
      '/messages': 'messages',
      '/profile': 'profile',
    };

    setActiveTab(pathMap[location.pathname] || 'home');
  }, [location.pathname]);

  const handleTabChange = (tab: 'home' | 'channels' | 'publish' | 'messages' | 'profile') => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'channels':
        navigate('/channels');
        break;
      case 'publish':
        navigate('/publish');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <>
      <Outlet />
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
};

export default TabBarLayout;