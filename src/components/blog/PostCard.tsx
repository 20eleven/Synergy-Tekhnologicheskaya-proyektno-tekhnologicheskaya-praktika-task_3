import React, { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import TagBadge from '../tags/TagBadge';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title>
              <Link to={`/post/${post.id}`} className="text-decoration-none">
                {post.title}
              </Link>
            </Card.Title>
            <Card.Text>
              {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
            </Card.Text>
          </div>
          {!post.isPublic && (
            <span className="badge bg-secondary">Скрытый</span>
          )}
        </div>
        
        <div className="mb-2">
          {post.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Автор: {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
          </small>
          
          {onEdit && onDelete && (
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => onEdit(post)}
              >
                Редактировать
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                Удалить
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;