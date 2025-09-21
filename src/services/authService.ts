import { mockApi } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await mockApi.login(credentials.email, credentials.password);
    return response.user;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await mockApi.register(data.username, data.email, data.password);
    return response.user;
  },

  async logout(): Promise<void> {
    await mockApi.logout();
  },

  async getCurrentUser(): Promise<User | null> {
    return await mockApi.getCurrentUser();
  },
};