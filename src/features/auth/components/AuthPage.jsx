import React, { useState } from 'react';
import { NavBar, Footer } from '../../../shared';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const [activeModal, setActiveModal] = useState('login'); // Auto-open login modal

  const openLogin = () => setActiveModal('login');
  const openRegister = () => setActiveModal('register');
  const closeModal = () => setActiveModal(null);

  const switchToRegister = () => setActiveModal('register');
  const switchToLogin = () => setActiveModal('login');

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar onLoginClick={openLogin} onRegisterClick={openRegister} />
      
      {/* Main content with gradient background */}
      <main className="flex-1 relative">
        {/* Gradient background - vibrant colors like in the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500"></div>
        
        {/* Empty content area - modals will be displayed over this */}
        <div className="relative z-10 flex items-center justify-center min-h-full">
          {/* This area is intentionally left empty to match the image */}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <Login 
        isOpen={activeModal === 'login'} 
        onClose={closeModal}
        onSwitchToRegister={switchToRegister}
      />
      <Register 
        isOpen={activeModal === 'register'} 
        onClose={closeModal}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default AuthPage;
