import React, { useState, FC } from 'react';
import { Card, Form, Button, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { Comment } from '../../types';
import { validateCommentContent } from '../../utils/validation';

interface CommentSectionProps {
  comments: Comment[];
  loading: boolean;
  onAddComment: (content: string) => Promise<void>;
}

const CommentSection: FC<CommentSectionProps> = ({ comments, loading, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCommentContent(newComment)) {
      setError('Комментарий должен содержать от 1 до 500 символов');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onAddComment(newComment);
      setNewComment('');
    } catch (err) {
      setError('Ошибка при добавлении комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Комментарии ({comments.length})</Card.Title>
        
        <Form onSubmit={handleSubmit} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Добавить комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              isInvalid={!!error}
              disabled={isSubmitting}
            />
            {error && (
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              type="submit"
              size="sm"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Добавление...' : 'Добавить'}
            </Button>
          </div>
        </Form>
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Загрузка комментариев...</span>
          </div>
        ) : comments.length > 0 ? (
          <ListGroup>
            {comments.map(comment => (
              <ListGroup.Item key={comment.id}>
                <div className="d-flex justify-content-between">
                  <strong>{comment.author.username}</strong>
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-0 mt-1">{comment.content}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info" className="mb-0">
            Комментариев пока нет. Будьте первым!
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default CommentSection;