import React, { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from './hooks/useAuth';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Feed from './components/feed/Feed';
import PostCard from './components/blog/PostCard';
import PostForm from './components/blog/PostForm';
import SubscriptionManager from './components/feed/SubscriptionManager';
import { usePosts } from './hooks/usePosts';
import PostDetail from './components/blog/PostDetail';
import { PostData } from './types';
import LoadingSpinner from './components/common/LoadingSpinner';

const PostsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
    createPost,
    updatePost,
    deletePost,
    fetchPosts
  } = usePosts();
  
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  React.useEffect(() => {
    fetchPosts(1, 10);
  }, []);

  const handleCreatePost = async (data: PostData) => {
  setIsCreatingPost(true);
  try {
    await createPost(data);
    setShowPostForm(false);
    await fetchPosts(1, 10);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    throw error;
  } finally {
    setIsCreatingPost(false);
  }
};

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleUpdatePost = async (data: PostData) => {
    if (!editingPost) return;
    
    try {
      await updatePost(editingPost.id, data);
      setShowPostForm(false);
      setEditingPost(null);
      await fetchPosts(1, 10);
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        alert('Ошибка при удалении поста');
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Все посты</h1>
        {isAuthenticated && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowPostForm(true)}
            disabled={isCreatingPost}
          >
            {isCreatingPost ? 'Создание...' : 'Создать пост'}
          </button>
        )}
      </div>
      
      {postsLoading && posts.length === 0 ? (
        <LoadingSpinner message='Загрузка постов...'/>
      ) : postsError ? (
        <div className="alert alert-danger">
          Ошибка загрузки постов: {postsError}
        </div>
      ) : (
        <>
          {isCreatingPost && (
            <div className="alert alert-info">
              <Spinner animation="border" size="sm" className="me-2" />
              Создание поста...
            </div>
          )}
          
          {posts.length === 0 ? (
            <div className="alert alert-info">
              Пока нет постов. {isAuthenticated ? 'Будьте первым, кто создаст пост!' : 'Войдите, чтобы создать пост.'}
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={isAuthenticated && user?.id === post.author.id ? handleEditPost : undefined}
                  onDelete={isAuthenticated && user?.id === post.author.id ? handleDeletePost : undefined}
                />
              ))}
            </>
          )}
        </>
      )}
      
      <PostForm
        show={showPostForm}
        onHide={() => {
          setShowPostForm(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        initialData={editingPost}
      />
    </>
  );
};

function App() {
  const { user, isAuthenticated, isLoading: authLoading, login, register, logout } = useAuth();
  const authKey = isAuthenticated ? 1 : 0;

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (authLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Загрузка данных пользователя...</span>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/posts" replace />;
    }
    
    return children;
  };

  if (authLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="mt-3">Загрузка приложения...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header
          user={user}
          isAuthenticated={isAuthenticated}
          onLogin={login}
          onRegister={register}
          onLogout={logout}
        />
        
        <main className="flex-grow-1">
          <Container className="py-4">
            <Routes>
              <Route 
                path="/posts" 
                element={<PostsPage key={authKey} />} 
              />
              
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/subscriptions" 
                element={
                  <ProtectedRoute>
                    <Container className="py-4">
                      <h1>Управление подписками</h1>
                      <SubscriptionManager />
                    </Container>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/post/:id" 
                element={<PostDetail />}
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Container className="py-4">
                      <h1>Профиль</h1>
                      {user && (
                        <div>
                          <p>Имя пользователя: {user.username}</p>
                          <p>Email: {user.email}</p>
                        </div>
                      )}
                    </Container>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/" 
                element={<Navigate to="/posts" replace />} 
              />
              
              {/* Redirect to the main page if route does nott exist */}
              <Route path="*" element={<Navigate to="/posts" replace />} />
            </Routes>
          </Container>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;