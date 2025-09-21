import React, { useState, useEffect, FC } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  initialMode?: 'login' | 'register';
}

const AuthModal: FC<AuthModalProps> = ({ show, onHide, onLogin, onRegister, initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');

  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
  }, [initialMode, show]);

  const handleSwitchToRegister = () => {
    setIsLoginMode(false);
  };

  const handleSwitchToLogin = () => {
    setIsLoginMode(true);
  };

  const handleClose = () => {
    onHide();
  };

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLoginMode ? 'Вход' : 'Регистрация'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoginMode ? (
          <LoginForm 
            onLogin={onLogin} 
            onSwitchToRegister={handleSwitchToRegister} 
          />
        ) : (
          <RegisterForm 
            onRegister={onRegister} 
            onSwitchToLogin={handleSwitchToLogin} 
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;