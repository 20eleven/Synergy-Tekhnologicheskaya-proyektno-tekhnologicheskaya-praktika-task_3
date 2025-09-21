import React, { useState, FC, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { validateEmail, validatePassword } from '../../utils/validation';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToRegister: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setLoginError(result.error || 'Ошибка входа');
      }
    } catch (error) {
      setLoginError('Произошла ошибка при входе. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {loginError && (
        <Alert variant="danger">{loginError}</Alert>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      
      <div className="d-grid gap-2">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </div>
      
      <div className="text-center mt-3">
        <p>
          Нет аккаунта?{' '}
          <Button 
            variant="link" 
            onClick={onSwitchToRegister}
            className="p-0"
          >
            Зарегистрируйтесь
          </Button>
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;