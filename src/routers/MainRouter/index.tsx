import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { Login } from '../../pages/Login';
import { useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { PublicOnlyRoute } from '../../components/PublicOnlyRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/history/" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings/" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/about-pomodoro/" element={<ProtectedRoute><AboutPomodoro /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}