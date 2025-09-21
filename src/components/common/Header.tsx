import React, { useState, FC } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { User } from '../../types';
import AuthModal from '../auth/AuthModal';

interface HeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

const Header: FC<HeaderProps> = ({ 
  user, 
  isAuthenticated, 
  onLogin, 
  onRegister, 
  onLogout 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleShowRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await onLogin(email, password);
    if (result.success) {
      handleCloseModal();
    }
    return result;
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const result = await onRegister(username, email, password);
    if (result.success) {
      handleCloseModal();
    }
    return result;
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Главная</Nav.Link>
              </LinkContainer>
              {isAuthenticated && (
                <>
                  <LinkContainer to="/feed">
                    <Nav.Link>Лента</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/subscriptions">
                    <Nav.Link>Подписки</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
            
            <Nav>
              {isAuthenticated && user ? (
                <NavDropdown 
                  title={user.username} 
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Профиль</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>
                    Выйти
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Button 
                    variant="outline-light" 
                    className="me-2"
                    onClick={handleShowLogin}
                  >
                    Войти
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleShowRegister}
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <AuthModal
        show={showAuthModal}
        onHide={handleCloseModal}
        onLogin={handleLogin}
        onRegister={handleRegister}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;