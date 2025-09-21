import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { postService } from '../../services/postService';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const subs = await postService.getSubscriptions();
      setSubscriptions(subs);
    } catch (err) {
      setError('Ошибка при загрузке подписок');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await postService.getAllUsers();
      setAllUsers(users);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
    }
  };

  const handleSubscribe = async (userId: string) => {
    setIsProcessing(userId);
    try {
      await postService.subscribe(userId);
      await fetchSubscriptions();
    } catch (err) {
      setError('Ошибка при подписке');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUnsubscribe = async (userId: string) => {
    setIsProcessing(userId);
    try {
      await postService.unsubscribe(userId);
      await fetchSubscriptions();
    } catch (err) {
      setError('Ошибка при отписке');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await Promise.all([fetchSubscriptions(), fetchAllUsers()]);
    } catch (err) {
      setError('Ошибка при обновлении данных');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([fetchSubscriptions(), fetchAllUsers()]);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const isSubscribed = (userId: string) => {
    return subscriptions.some(sub => sub.id === userId);
  };

  const usersToShow = allUsers.filter(u => u.id !== user?.id);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <div>Загрузка подписок...</div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <span>Управление подписками</span>
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
      </Card.Header>
      <Card.Body>
        {isRefreshing && (
          <Alert variant="info" className="d-flex align-items-center mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            Обновление данных подписок...
          </Alert>
        )}
        
        {usersToShow.length === 0 ? (
          <p>Нет пользователей для подписки.</p>
        ) : (
          <ListGroup>
            {usersToShow.map(userItem => (
              <ListGroup.Item 
                key={userItem.id} 
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{userItem.username}</strong>
                  <div className="text-muted small">{userItem.email}</div>
                </div>
                <Button 
                  variant={isSubscribed(userItem.id) ? "outline-danger" : "outline-primary"} 
                  size="sm"
                  onClick={() => 
                    isSubscribed(userItem.id) 
                      ? handleUnsubscribe(userItem.id) 
                      : handleSubscribe(userItem.id)
                  }
                  disabled={isProcessing === userItem.id || isRefreshing}
                >
                  {isProcessing === userItem.id ? (
                    <Spinner animation="border" size="sm" />
                  ) : isSubscribed(userItem.id) ? (
                    'Отписаться'
                  ) : (
                    'Подписаться'
                  )}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        
        {subscriptions.length > 0 && (
          <div className="mt-3">
            <h6>Вы подписаны на ({subscriptions.length}):</h6>
            <div>
              {subscriptions.map(sub => (
                <span key={sub.id} className="badge bg-primary me-1 mb-1">
                  {sub.username}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SubscriptionManager;