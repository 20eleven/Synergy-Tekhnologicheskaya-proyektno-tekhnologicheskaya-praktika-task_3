import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { postService } from '../../services/postService';
import { Post, Comment } from '../../types';
import TagBadge from '../tags/TagBadge';
import CommentSection from './CommentSection';
import LoadingSpinner from '../common/LoadingSpinner';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await postService.getPostById(id);
        setPost(postData);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке поста');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const commentsData = await postService.getComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error('Ошибка при загрузке комментариев:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddComment = async (content: string) => {
    if (!id) return;
    
    try {
      const newComment = await postService.createComment(id, content);
      setComments(prev => [...prev, newComment]);
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
      throw err;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки поста</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex">
            <Button variant="secondary" onClick={handleBack} className="me-2">
              Назад
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Пост не найден</Alert>
        <Button variant="secondary" onClick={handleBack}>
          Назад
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-3">
        <Button variant="secondary" onClick={handleBack}>
          Назад к постам
        </Button>
      </div>
      
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title>{post.title}</Card.Title>
              <div className="mb-2">
                {post.tags.map(tag => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
            {!post.isPublic && (
              <span className="badge bg-secondary">Скрытый</span>
            )}
          </div>
          
          <Card.Text className="post-content">{post.content}</Card.Text>
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <small className="text-muted">
              Автор: {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        </Card.Body>
      </Card>
      
      <div className="mt-4">
        <CommentSection 
          comments={comments} 
          loading={commentsLoading} 
          onAddComment={handleAddComment}
        />
      </div>
    </Container>
  );
};

export default PostDetail;