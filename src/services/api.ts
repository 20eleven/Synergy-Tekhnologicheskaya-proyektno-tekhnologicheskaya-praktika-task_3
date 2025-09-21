// Mock api - demonstration only

import { Post, User, Comment } from '../types';

let mockUsers: User[] = [
  {
    id: '1',
    username: 'User1',
    email: 'user1@example.com',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    username: 'test',
    email: 'test@example.com',
    createdAt: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    username: 'Pavel',
    email: 'pavel@example.com',
    createdAt: '2023-03-10T09:15:00Z'
  }
];

let mockPosts: Post[] = [
  {
    id: '1',
    title: 'Введение в React Hooks',
    content: 'React Hooks - это нововведение в React 16.8, которое позволяет использовать состояние и другие возможности React без написания классов.',
    author: mockUsers[0],
    tags: ['react', 'javascript', 'hooks'],
    isPublic: true,
    createdAt: '2023-04-01T12:00:00Z',
    updatedAt: '2023-04-01T12:00:00Z'
  },
  {
    id: '2',
    title: 'TypeScript: Преимущества типизации',
    content: 'TypeScript - добавляет статическую типизацию и помогает избежать распространенных ошибок.',
    author: mockUsers[1],
    tags: ['typescript', 'javascript'],
    isPublic: true,
    createdAt: '2023-04-05T15:30:00Z',
    updatedAt: '2023-04-05T15:30:00Z'
  },
  {
    id: '3',
    title: 'REST API с Node.js и Express',
    content: 'Закрытое обсуждение REST API с использованием Node.js и Express.',
    author: mockUsers[0],
    tags: ['nodejs', 'express', 'api'],
    isPublic: false,
    createdAt: '2023-04-10T08:45:00Z',
    updatedAt: '2023-04-10T08:45:00Z'
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox',
    content: 'CSS Grid и Flexbox - два мощных инструмента для создания современных макетов.',
    author: mockUsers[2],
    tags: ['css', 'grid', 'flexbox'],
    isPublic: true,
    createdAt: '2023-04-12T11:20:00Z',
    updatedAt: '2023-04-12T11:20:00Z'
  }
];

let mockComments: Comment[] = [
  {
    id: '1',
    content: 'Спасибо за объяснение',
    author: mockUsers[1],
    postId: '1',
    createdAt: '2023-04-02T14:00:00Z'
  },
  {
    id: '2',
    content: 'Отличная статья!',
    author: mockUsers[2],
    postId: '1',
    createdAt: '2023-04-03T16:30:00Z'
  },
  {
    id: '3',
    content: 'Спасибо!',
    author: mockUsers[0],
    postId: '4',
    createdAt: '2023-04-13T09:15:00Z'
  }
];

let mockSubscriptions: Record<User['id'], User['id'][]> = {
  '1': ['2'],
  '2': [],
  '3': [],
};

let mockSession: { user: User | null; token: string | null } = { user: null, token: null };

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Date.now().toString();

const findUserByEmail = (email: string) => mockUsers.find(user => user.email === email);

const findUserById = (id: string) => mockUsers.find(user => user.id === id);

const findCommentsByPostId = (postId: string) => mockComments.filter(comment => comment.postId === postId);

// Mock api service
export const mockApi = {
  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);

    const user = findUserByEmail(email);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    
    const token = `token_${generateId()}`;
    mockSession = { user, token };
    
    return { user, token };
  },

  async register(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);

    if (findUserByEmail(email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const newUser: User = {
      id: generateId(),
      username,
      email,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);

    mockSubscriptions[newUser.id] = [];
    
    const token = `token_${generateId()}`;
    mockSession = { user: newUser, token };
    
    return { user: newUser, token };
  },

  async logout(): Promise<void> {
    await delay(300);
    mockSession = { user: null, token: null };
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    return mockSession.user;
  },

  // Posts endpoints
  async getPosts(page: number = 1, limit: number = 10, tags?: string[]): Promise<{ posts: Post[]; total: number }> {
    await delay(500);

    let filteredPosts = mockPosts.filter(post => post.isPublic);

    if (tags && tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        tags.some(tag => post.tags.includes(tag))
      );
    }

    filteredPosts = filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const total = filteredPosts.length;
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
    
    return { posts: paginatedPosts, total };
  },

  async getPostById(id: string): Promise<Post> {
    await delay(300);
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error('Пост не найден');
    }
    
    if (!post.isPublic) {
      if (!mockSession.user) {
        throw new Error('Этот пост является скрытым и доступен только автору и его подписчикам.');
      }
      
      if (mockSession.user.id === post.author.id) {
        return post;
      }
      
      const userSubscriptions = mockSubscriptions[mockSession.user.id] || [];
      if (!userSubscriptions.includes(post.author.id)) {
        throw new Error('Этот пост является скрытым и доступен только автору и его подписчикам.');
      }
    }
    
    return post;
  },

  async createPost(data: { title: string; content: string; tags: string[]; isPublic: boolean }): Promise<Post> {
    await delay(500);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }
    
    const newPost: Post = {
      id: generateId(),
      title: data.title,
      content: data.content,
      author: mockSession.user,
      tags: data.tags,
      isPublic: data.isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPosts = [newPost, ...mockPosts];
    return newPost;
  },

  async updatePost(id: string, data: Partial<{ title: string; content: string; tags: string[]; isPublic: boolean }>): Promise<Post> {
    await delay(500);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }
    
    const postIndex = mockPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Пост не найден');
    }
    
    const post = mockPosts[postIndex];
    if (post.author.id !== mockSession.user.id) {
      throw new Error('Нет прав для редактирования этого поста');
    }
    
    const updatedPost: Post = {
      ...post,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    mockPosts[postIndex] = updatedPost;
    return updatedPost;
  },

  async deletePost(id: string): Promise<void> {
    await delay(300);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }
    
    const postIndex = mockPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('Пост не найден');
    }
    
    const post = mockPosts[postIndex];
    if (post.author.id !== mockSession.user.id) {
      throw new Error('Нет прав для удаления этого поста');
    }
    
    mockPosts.splice(postIndex, 1);

    mockComments = mockComments.filter(comment => comment.postId !== id);
  },

  // Comments endpoints
  async getComments(postId: string): Promise<Comment[]> {
    await delay(300);

    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Пост не найден');
    }

    if (!post.isPublic && (!mockSession.user || mockSession.user.id !== post.author.id)) {
      throw new Error('У вас нет доступа к комментариям этого поста');
    }
    
    return findCommentsByPostId(postId);
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    await delay(300);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }

    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Пост не найден');
    }
    
    const newComment: Comment = {
      id: generateId(),
      content,
      author: mockSession.user,
      postId,
      createdAt: new Date().toISOString()
    };
    
    mockComments.push(newComment);
    return newComment;
  },

  // Feed endpoints
  async getFeed(page: number = 1, limit: number = 10, tags?: string[]): Promise<{ posts: Post[]; total: number }> {
  await delay(500);
  
  if (!mockSession.user) {
    throw new Error('Требуется авторизация');
  }
  
  const userSubscriptions = mockSubscriptions[mockSession.user.id] || [];
  
  let feedPosts = mockPosts.filter(post => 
    userSubscriptions.includes(post.author.id) || post.author.id === mockSession.user!.id
  );

  if (tags && tags.length > 0) {
    feedPosts = feedPosts.filter(post => 
      tags.some(tag => post.tags.includes(tag))
    );
  }

  feedPosts = feedPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const total = feedPosts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = feedPosts.slice(startIndex, startIndex + limit);
  
  return { posts: paginatedPosts, total };
},

  // Subscriptions endpoints
  async getSubscriptions(): Promise<User[]> {
    await delay(300);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }

    const userSubscriptions = mockSubscriptions[mockSession.user.id] || [];
    
    return mockUsers.filter(user => 
      userSubscriptions.includes(user.id) && user.id !== mockSession.user!.id
    );
  },

  async subscribe(userId: string): Promise<void> {
    await delay(300);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }
    
    if (userId === mockSession.user.id) {
      throw new Error('Нельзя подписаться на себя');
    }
    
    if (!findUserById(userId)) {
      throw new Error('Пользователь не найден');
    }

    if (!mockSubscriptions[mockSession.user.id]) {
      mockSubscriptions[mockSession.user.id] = [];
    }
    
    if (!mockSubscriptions[mockSession.user.id].includes(userId)) {
      mockSubscriptions[mockSession.user.id].push(userId);
    }
  },

  async unsubscribe(userId: string): Promise<void> {
    await delay(300);
    
    if (!mockSession.user) {
      throw new Error('Требуется авторизация');
    }

    if (mockSubscriptions[mockSession.user.id]) {
      mockSubscriptions[mockSession.user.id] = mockSubscriptions[mockSession.user.id].filter(id => id !== userId);
    }
  },

  // Tags endpoints
  async getTags(): Promise<string[]> {
    await delay(300);
    
    const allTags = mockPosts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  },

  // Users endpoints
  async getAllUsers(): Promise<User[]> {
    await delay(300);
    return mockUsers;
  }
};

export default mockApi;