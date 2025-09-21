import { mockApi } from './api';
import { Post, Comment, User } from '../types';

export interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}

export const postService = {
  async getPosts(page = 1, limit = 10, tags?: string[]): Promise<Post[]> {
    const response = await mockApi.getPosts(page, limit, tags);
    return response.posts;
  },

  async getPostById(id: string): Promise<Post> {
    return await mockApi.getPostById(id);
  },

  async createPost(data: CreatePostData): Promise<Post> {
    return await mockApi.createPost(data);
  },

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    return await mockApi.updatePost(id, data);
  },

  async deletePost(id: string): Promise<void> {
    await mockApi.deletePost(id);
  },

  async getComments(postId: string): Promise<Comment[]> {
    return await mockApi.getComments(postId);
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    return await mockApi.createComment(postId, content);
  },

  async getFeed(page = 1, limit = 10, tags?: string[]): Promise<Post[]> {
    const response = await mockApi.getFeed(page, limit, tags);
    return response.posts;
  },

  async getSubscriptions(): Promise<User[]> {
    return await mockApi.getSubscriptions();
  },

  async subscribe(userId: string): Promise<void> {
    await mockApi.subscribe(userId);
  },

  async unsubscribe(userId: string): Promise<void> {
    await mockApi.unsubscribe(userId);
  },

  async getTags(): Promise<string[]> {
    return await mockApi.getTags();
  },

  async getAllUsers(): Promise<User[]> {
    return await mockApi.getAllUsers();
  }
};