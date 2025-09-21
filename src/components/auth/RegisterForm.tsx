import React, { useState, FC } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToLogin: () => void;
}

const RegisterForm: FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateUsername(username)) {
      newErrors.username = 'Имя пользователя должно содержать от 3 до 20 символов';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setRegisterError(null);
    
    try {
      const result = await onRegister(username, email, password);
      if (!result.success) {
        setRegisterError(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setRegisterError('Произошла ошибка при регистрации. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {registerError && (
        <Alert variant="danger">{registerError}</Alert>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Имя пользователя</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      
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
      
      <Form.Group className="mb-3">
        <Form.Label>Подтвердите пароль</Form.Label>
        <Form.Control
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>
      
      <div className="d-grid gap-2">
        <Button 
          variant="success" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </div>
      
      <div className="text-center mt-3">
        <p>
          Уже есть аккаунт?{' '}
          <Button 
            variant="link" 
            onClick={onSwitchToLogin}
            className="p-0"
          >
            Войдите
          </Button>
        </p>
      </div>
    </Form>
  );
};

export default RegisterForm;