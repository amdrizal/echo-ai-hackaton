"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoalHandler = exports.updateGoalHandler = exports.getGoalByIdHandler = exports.getGoalsHandler = exports.createGoalHandler = exports.updateGoalValidation = exports.createGoalValidation = void 0;
const express_validator_1 = require("express-validator");
const goal_model_1 = require("../models/goal.model");
const validCategories = [
    'career',
    'health',
    'financial',
    'education',
    'relationships',
    'personal',
    'creative',
];
const validStatuses = ['active', 'completed', 'abandoned', 'on_hold'];
exports.createGoalValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('category')
        .isIn(validCategories)
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('targetDate').optional().isISO8601(),
];
exports.updateGoalValidation = [
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('category').optional().isIn(validCategories),
    (0, express_validator_1.body)('status').optional().isIn(validStatuses),
    (0, express_validator_1.body)('targetDate').optional().isISO8601(),
];
const createGoalHandler = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const { title, description, category, targetDate, createdFromVoice } = req.body;
        const goal = await (0, goal_model_1.createGoal)({
            userId: req.user.id,
            title,
            description,
            category,
            targetDate,
            createdFromVoice: createdFromVoice || false,
        });
        return res.status(201).json({
            success: true,
            data: (0, goal_model_1.goalToResponse)(goal),
        });
    }
    catch (error) {
        console.error('Create goal error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.createGoalHandler = createGoalHandler;
const getGoalsHandler = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const { status, category, limit, offset } = req.query;
        const filters = {
            status: status,
            category: category,
            limit: limit ? parseInt(limit) : 10,
            offset: offset ? parseInt(offset) : 0,
        };
        const { goals, total } = await (0, goal_model_1.findGoalsByUserId)(req.user.id, filters);
        return res.status(200).json({
            success: true,
            data: {
                goals: goals.map(goal_model_1.goalToResponse),
                total,
                limit: filters.limit,
                offset: filters.offset,
            },
        });
    }
    catch (error) {
        console.error('Get goals error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.getGoalsHandler = getGoalsHandler;
const getGoalByIdHandler = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const goalId = parseInt(req.params.id);
        const goal = await (0, goal_model_1.findGoalById)(goalId);
        if (!goal) {
            return res.status(404).json({
                success: false,
                error: 'Goal not found',
            });
        }
        // Check ownership
        if (goal.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not your goal',
            });
        }
        return res.status(200).json({
            success: true,
            data: (0, goal_model_1.goalToResponse)(goal),
        });
    }
    catch (error) {
        console.error('Get goal error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.getGoalByIdHandler = getGoalByIdHandler;
const updateGoalHandler = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const goalId = parseInt(req.params.id);
        const existingGoal = await (0, goal_model_1.findGoalById)(goalId);
        if (!existingGoal) {
            return res.status(404).json({
                success: false,
                error: 'Goal not found',
            });
        }
        // Check ownership
        if (existingGoal.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not your goal',
            });
        }
        const { title, description, category, status, targetDate } = req.body;
        const updatedGoal = await (0, goal_model_1.updateGoal)(goalId, {
            title,
            description,
            category,
            status,
            targetDate,
        });
        return res.status(200).json({
            success: true,
            data: (0, goal_model_1.goalToResponse)(updatedGoal),
        });
    }
    catch (error) {
        console.error('Update goal error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.updateGoalHandler = updateGoalHandler;
const deleteGoalHandler = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const goalId = parseInt(req.params.id);
        const goal = await (0, goal_model_1.findGoalById)(goalId);
        if (!goal) {
            return res.status(404).json({
                success: false,
                error: 'Goal not found',
            });
        }
        // Check ownership
        if (goal.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not your goal',
            });
        }
        await (0, goal_model_1.deleteGoal)(goalId);
        return res.status(200).json({
            success: true,
            message: 'Goal deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete goal error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.deleteGoalHandler = deleteGoalHandler;
//# sourceMappingURL=goal.controller.js.map