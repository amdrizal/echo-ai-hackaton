import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/register',
      data
    );

    if (response.data.success) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      return response.data.data;
    }

    throw new Error('Registration failed');
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/login',
      credentials
    );

    if (response.data.success) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      return response.data.data;
    }

    throw new Error('Login failed');
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');

    if (response.data.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }

    throw new Error('Failed to fetch user');
  },

  async getStoredUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },
};
