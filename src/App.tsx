import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginPage from './pages/LoginPage';
import StudentProfile from './pages/StudentProfile';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './pages/MenuLeft';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          {/* Trang mặc định chuyển về login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Trang đăng nhập */}
          <Route path="/login" element={<LoginPage />} />

          {/* Layout chính sau đăng nhập */}
          <Route
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {/* Chỉ giữ đúng 2 route cần thiết */}
            <Route path="/profile" element={<StudentProfile />} />
          </Route>

          {/* Fallback nếu không đúng route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
};

export default App;
