export type GoalCategory =
  | 'career'
  | 'health'
  | 'financial'
  | 'education'
  | 'relationships'
  | 'personal'
  | 'creative';

export type GoalStatus =
  | 'active'
  | 'completed'
  | 'abandoned'
  | 'on_hold';

export interface Goal {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  createdFromVoice: boolean;
  vapiConversationId?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  createdFromVoice?: boolean;
}
