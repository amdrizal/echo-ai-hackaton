"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalToResponse = exports.deleteGoal = exports.updateGoal = exports.findGoalById = exports.findGoalsByUserId = exports.createGoal = void 0;
const database_1 = require("../config/database");
const createGoal = async (input) => {
    const { userId, title, description, category, targetDate, createdFromVoice = false, vapiConversationId, } = input;
    const result = await (0, database_1.query)(`INSERT INTO goals (user_id, title, description, category, target_date, created_from_voice, vapi_conversation_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`, [userId, title, description || null, category, targetDate || null, createdFromVoice, vapiConversationId || null]);
    return result.rows[0];
};
exports.createGoal = createGoal;
const findGoalsByUserId = async (userId, filters = {}) => {
    const { status, category, limit = 10, offset = 0 } = filters;
    let whereClause = 'WHERE user_id = $1';
    const params = [userId];
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
    const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM goals ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);
    // Get goals with pagination
    const result = await (0, database_1.query)(`SELECT * FROM goals ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...params, limit, offset]);
    return {
        goals: result.rows,
        total,
    };
};
exports.findGoalsByUserId = findGoalsByUserId;
const findGoalById = async (id) => {
    const result = await (0, database_1.query)('SELECT * FROM goals WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findGoalById = findGoalById;
const updateGoal = async (id, input) => {
    const { title, description, category, status, targetDate } = input;
    const updates = [];
    const params = [];
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
        return (0, exports.findGoalById)(id);
    }
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    const result = await (0, database_1.query)(`UPDATE goals SET ${updates.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`, [...params, id]);
    return result.rows[0] || null;
};
exports.updateGoal = updateGoal;
const deleteGoal = async (id) => {
    const result = await (0, database_1.query)('DELETE FROM goals WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};
exports.deleteGoal = deleteGoal;
const goalToResponse = (goal) => {
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
exports.goalToResponse = goalToResponse;
//# sourceMappingURL=goal.model.js.map