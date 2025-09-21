import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Блог</h5>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted">
              Приложение для блога
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;