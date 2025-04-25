import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import UserPass from './pages/UserPass';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

// Отдельный компонент с маршрутами и защитой
const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/passwords" replace /> : <Login />}
      />
      <Route
        path="/passwords"
        element={isAuthenticated ? <UserPass /> : <Navigate to="/login" replace />}
      />
      {/* Редирект с корня на /login или /passwords */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/passwords" : "/login"} replace />}
      />
      {/* Можно добавить 404 */}
      <Route path="*" element={<h1>404: Страница не найдена</h1>} />
    </Routes>
  );
};

export default App;
