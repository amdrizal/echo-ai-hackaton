import api from './api';
import { Goal, CreateGoalInput, GoalCategory, GoalStatus } from '../types/goal';

interface GoalsResponse {
  goals: Goal[];
  total: number;
  limit: number;
  offset: number;
}

export const goalService = {
  async createGoal(data: CreateGoalInput): Promise<Goal> {
    const response = await api.post<{ success: boolean; data: Goal }>('/goals', data);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error('Failed to create goal');
  },

  async getGoals(filters?: {
    status?: GoalStatus;
    category?: GoalCategory;
    limit?: number;
    offset?: number;
  }): Promise<GoalsResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get<{ success: boolean; data: GoalsResponse }>(
      `/goals?${params.toString()}`
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error('Failed to fetch goals');
  },

  async getGoalById(id: number): Promise<Goal> {
    const response = await api.get<{ success: boolean; data: Goal }>(`/goals/${id}`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error('Failed to fetch goal');
  },

  async updateGoal(id: number, data: Partial<CreateGoalInput>): Promise<Goal> {
    const response = await api.put<{ success: boolean; data: Goal }>(`/goals/${id}`, data);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error('Failed to update goal');
  },

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};
