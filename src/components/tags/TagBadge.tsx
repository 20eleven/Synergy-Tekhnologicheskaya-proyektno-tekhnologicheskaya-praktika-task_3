import React from 'react';
import { Badge } from 'react-bootstrap';

interface TagBadgeProps {
  tag: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  return (
    <Badge bg="secondary" className="me-1">
      {tag}
    </Badge>
  );
};

export default TagBadge;