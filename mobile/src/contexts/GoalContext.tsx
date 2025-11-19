import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Goal, CreateGoalInput, GoalCategory, GoalStatus } from '../types/goal';
import { goalService } from '../services/goalService';

interface GoalContextType {
  goals: Goal[];
  loading: boolean;
  fetchGoals: (filters?: {
    status?: GoalStatus;
    category?: GoalCategory;
  }) => Promise<void>;
  createGoal: (data: CreateGoalInput) => Promise<Goal>;
  updateGoal: (id: number, data: Partial<CreateGoalInput>) => Promise<Goal>;
  deleteGoal: (id: number) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

export const GoalContext = createContext<GoalContextType>({
  goals: [],
  loading: false,
  fetchGoals: async () => {},
  createGoal: async () => ({} as Goal),
  updateGoal: async () => ({} as Goal),
  deleteGoal: async () => {},
  refreshGoals: async () => {},
});

interface GoalProviderProps {
  children: ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async (filters?: {
    status?: GoalStatus;
    category?: GoalCategory;
  }) => {
    try {
      setLoading(true);
      const response = await goalService.getGoals(filters);
      setGoals(response.goals);
    } catch (error) {
      console.error('Fetch goals error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (data: CreateGoalInput): Promise<Goal> => {
    try {
      const newGoal = await goalService.createGoal(data);
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (error) {
      console.error('Create goal error:', error);
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (
    id: number,
    data: Partial<CreateGoalInput>
  ): Promise<Goal> => {
    try {
      const updatedGoal = await goalService.updateGoal(id, data);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
      return updatedGoal;
    } catch (error) {
      console.error('Update goal error:', error);
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (id: number): Promise<void> => {
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error('Delete goal error:', error);
      throw error;
    }
  }, []);

  const refreshGoals = useCallback(async () => {
    await fetchGoals();
  }, [fetchGoals]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        loading,
        fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
        refreshGoals,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = React.useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalProvider');
  }
  return context;
};
