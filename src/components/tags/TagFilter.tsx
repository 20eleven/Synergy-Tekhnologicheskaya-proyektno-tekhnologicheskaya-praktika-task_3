import React, { useState } from 'react';
import { Card, Form, Badge, Button } from 'react-bootstrap';
import { useTags } from '../../hooks/useTags';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTags, onTagsChange }) => {
  const { tags, isLoading } = useTags();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = tags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  if (isLoading) {
    return <div>Загрузка тегов...</div>;
  }

  return (
    <Card>
      <Card.Header>Фильтр по тегам</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Поиск тегов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        
        <div>
          {filteredTags.map(tag => (
            <Badge
              key={tag}
              bg={selectedTags.includes(tag) ? 'primary' : 'secondary'}
              className="me-1 mb-1"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="mt-3">
            <small className="text-muted">Выбрано: {selectedTags.join(', ')}</small>
            <br />
            <Button 
              variant="link" 
              size="sm" 
              className="p-0"
              onClick={() => onTagsChange([])}
            >
              Сбросить фильтр
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TagFilter;