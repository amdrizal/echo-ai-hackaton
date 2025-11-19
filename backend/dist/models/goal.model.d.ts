export type GoalCategory = 'career' | 'health' | 'financial' | 'education' | 'relationships' | 'personal' | 'creative';
export type GoalStatus = 'active' | 'completed' | 'abandoned' | 'on_hold';
export interface Goal {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    category: GoalCategory;
    status: GoalStatus;
    created_from_voice: boolean;
    vapi_conversation_id?: string;
    target_date?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface CreateGoalInput {
    userId: number;
    title: string;
    description?: string;
    category: GoalCategory;
    targetDate?: string;
    createdFromVoice?: boolean;
    vapiConversationId?: string;
}
export interface UpdateGoalInput {
    title?: string;
    description?: string;
    category?: GoalCategory;
    status?: GoalStatus;
    targetDate?: string;
}
export interface GoalFilters {
    status?: GoalStatus;
    category?: GoalCategory;
    limit?: number;
    offset?: number;
}
export declare const createGoal: (input: CreateGoalInput) => Promise<Goal>;
export declare const findGoalsByUserId: (userId: number, filters?: GoalFilters) => Promise<{
    goals: Goal[];
    total: number;
}>;
export declare const findGoalById: (id: number) => Promise<Goal | null>;
export declare const updateGoal: (id: number, input: UpdateGoalInput) => Promise<Goal | null>;
export declare const deleteGoal: (id: number) => Promise<boolean>;
export declare const goalToResponse: (goal: Goal) => {
    id: number;
    userId: number;
    title: string;
    description: string | undefined;
    category: GoalCategory;
    status: GoalStatus;
    createdFromVoice: boolean;
    vapiConversationId: string | undefined;
    targetDate: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=goal.model.d.ts.map