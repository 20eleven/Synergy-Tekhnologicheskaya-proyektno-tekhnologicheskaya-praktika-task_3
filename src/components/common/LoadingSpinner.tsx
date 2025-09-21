import React, { FC } from 'react';
import { Container, Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  message = 'Загрузка...', 
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="mt-3">{message}</span>
      </div>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">{message}</div>
      </div>
    </Container>
  );
};

export default LoadingSpinner;