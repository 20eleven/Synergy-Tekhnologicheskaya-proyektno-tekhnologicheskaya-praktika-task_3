import React, { useState, useEffect, FC } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { postService } from '../../services/postService';
import PostCard from '../blog/PostCard';
import TagFilter from '../tags/TagFilter';
import { Post } from '../../types';

const Feed: FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchFeed = async (pageNum: number, refresh = false) => {
    const setLoadingState = refresh ? setIsRefreshing : setIsLoading;
    setLoadingState(true);
    setError(null);
    
    try {
      const feedPosts = await postService.getFeed(pageNum, 10, selectedTags.length > 0 ? selectedTags : undefined);
      
      if (pageNum === 1) {
        setPosts(feedPosts);
      } else {
        setPosts(prev => [...prev, ...feedPosts]);
      }
      setHasMore(feedPosts.length === 10);
    } catch (error) {
      setError('Ошибка при загрузке ленты');
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchFeed(1);
  }, [selectedTags]); // Reload on tag change

  const handleLoadMore = () => {
    fetchFeed(page + 1);
    setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchFeed(1, true);
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Загрузка ленты постов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <TagFilter 
            selectedTags={selectedTags} 
            onTagsChange={handleTagsChange} 
          />
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Лента постов</h2>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Обновление...
                </>
              ) : (
                'Обновить'
              )}
            </Button>
          </div>
          
          {isRefreshing && posts.length > 0 && (
            <Alert variant="info" className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              Обновление ленты...
            </Alert>
          )}
          
          {posts.length === 0 ? (
            <Alert variant="info">
              {selectedTags.length > 0 
                ? `Нет постов с тегами: ${selectedTags.join(', ')}`
                : 'Пока нет постов от ваших подписок. Подпишитесь на пользователей, чтобы видеть их посты в ленте.'
              }
            </Alert>
          ) : (
            <>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {hasMore && (
                <div className="text-center mt-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleLoadMore}
                    disabled={isLoading || isRefreshing}
                  >
                    {(isLoading || isRefreshing) ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Загрузка...
                      </>
                    ) : (
                      'Загрузить еще'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Feed;