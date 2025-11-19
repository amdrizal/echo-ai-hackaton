import { query } from '../config/database';

export type GoalCategory =
  | 'career'
  | 'health'
  | 'financial'
  | 'education'
  | 'relationships'
  | 'personal'
  | 'creative';

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

export const createGoal = async (input: CreateGoalInput): Promise<Goal> => {
  const {
    userId,
    title,
    description,
    category,
    targetDate,
    createdFromVoice = false,
    vapiConversationId,
  } = input;

  const result = await query(
    `INSERT INTO goals (user_id, title, description, category, target_date, created_from_voice, vapi_conversation_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, title, description || null, category, targetDate || null, createdFromVoice, vapiConversationId || null]
  );

  return result.rows[0];
};

export const findGoalsByUserId = async (
  userId: number,
  filters: GoalFilters = {}
): Promise<{ goals: Goal[]; total: number }> => {
  const { status, category, limit = 10, offset = 0 } = filters;

  let whereClause = 'WHERE user_id = $1';
  const params: any[] = [userId];
  let paramIndex = 2;

  if (status) {
    whereClause += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (category) {
    whereClause += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM goals ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  // Get goals with pagination
  const result = await query(
    `SELECT * FROM goals ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  return {
    goals: result.rows,
    total,
  };
};

export const findGoalById = async (id: number): Promise<Goal | null> => {
  const result = await query('SELECT * FROM goals WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateGoal = async (
  id: number,
  input: UpdateGoalInput
): Promise<Goal | null> => {
  const { title, description, category, status, targetDate } = input;

  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramIndex}`);
    params.push(title);
    paramIndex++;
  }

  if (description !== undefined) {
    updates.push(`description = $${paramIndex}`);
    params.push(description);
    paramIndex++;
  }

  if (category !== undefined) {
    updates.push(`category = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  if (status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  if (targetDate !== undefined) {
    updates.push(`target_date = $${paramIndex}`);
    params.push(targetDate);
    paramIndex++;
  }

  if (updates.length === 0) {
    return findGoalById(id);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  const result = await query(
    `UPDATE goals SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`,
    [...params, id]
  );

  return result.rows[0] || null;
};

export const deleteGoal = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM goals WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const goalToResponse = (goal: Goal) => {
  return {
    id: goal.id,
    userId: goal.user_id,
    title: goal.title,
    description: goal.description,
    category: goal.category,
    status: goal.status,
    createdFromVoice: goal.created_from_voice,
    vapiConversationId: goal.vapi_conversation_id,
    targetDate: goal.target_date,
    createdAt: goal.created_at,
    updatedAt: goal.updated_at,
  };
};
