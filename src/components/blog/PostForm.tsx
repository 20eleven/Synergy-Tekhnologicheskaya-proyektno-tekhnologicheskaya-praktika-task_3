import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { validatePostTitle, validatePostContent } from '../../utils/validation';
import { PostData } from '../../types';

interface PostFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: PostData) => Promise<void>;
  initialData?: any;
}

const PostForm: React.FC<PostFormProps> = ({ show, onHide, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags.join(', '));
      setIsPublic(initialData.isPublic);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setIsPublic(true);
    setErrors({});
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validatePostTitle(title)) {
      newErrors.title = 'Заголовок должен содержать от 3 до 100 символов';
    }

    if (!validatePostContent(content)) {
      newErrors.content = 'Содержание должно содержать минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const postData: PostData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic,
      };
      
      await onSubmit(postData);
      resetForm();
      onHide();
    } catch (error) {
      setSubmitError('Произошла ошибка при сохранении поста. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Редактировать пост' : 'Создать пост'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitError && (
          <Alert variant="danger">{submitError}</Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Заголовок</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите заголовок поста"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Содержание</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Введите содержание поста"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              isInvalid={!!errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Теги (через запятую)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите теги, например: react, typescript, javascript"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="public-switch"
              label="Публичный пост"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            
            {!isPublic && (
              <Alert variant="info" className="mt-2 mb-0">
                <strong>Скрытый пост:</strong> Этот пост будет виден только вам и вашим подписчикам в ленте. 
                Он не будет отображаться на главной странице.
              </Alert>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit as any}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostForm;