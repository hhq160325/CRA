import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../authSlice';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [activeView, setActiveView] = useState('login');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const switchToRegister = () => setActiveView('register');
  const switchToLogin = () => setActiveView('login');

  if (activeView === 'register') {
    return <Register onSwitchToLogin={switchToLogin} />;
  }

  return <Login onSwitchToRegister={switchToRegister} />;
};

export default AuthPage;
