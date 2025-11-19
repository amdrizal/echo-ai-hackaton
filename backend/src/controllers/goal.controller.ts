import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createGoal,
  findGoalsByUserId,
  findGoalById,
  updateGoal,
  deleteGoal,
  goalToResponse,
  GoalCategory,
  GoalStatus,
} from '../models/goal.model';

const validCategories: GoalCategory[] = [
  'career',
  'health',
  'financial',
  'education',
  'relationships',
  'personal',
  'creative',
];

const validStatuses: GoalStatus[] = ['active', 'completed', 'abandoned', 'on_hold'];

export const createGoalValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category')
    .isIn(validCategories)
    .withMessage('Invalid category'),
  body('targetDate').optional().isISO8601(),
];

export const updateGoalValidation = [
  body('title').optional().notEmpty(),
  body('category').optional().isIn(validCategories),
  body('status').optional().isIn(validStatuses),
  body('targetDate').optional().isISO8601(),
];

export const createGoalHandler = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
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

    const goal = await createGoal({
      userId: req.user.id,
      title,
      description,
      category,
      targetDate,
      createdFromVoice: createdFromVoice || false,
    });

    return res.status(201).json({
      success: true,
      data: goalToResponse(goal),
    });
  } catch (error) {
    console.error('Create goal error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const getGoalsHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { status, category, limit, offset } = req.query;

    const filters = {
      status: status as GoalStatus | undefined,
      category: category as GoalCategory | undefined,
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    };

    const { goals, total } = await findGoalsByUserId(req.user.id, filters);

    return res.status(200).json({
      success: true,
      data: {
        goals: goals.map(goalToResponse),
        total,
        limit: filters.limit,
        offset: filters.offset,
      },
    });
  } catch (error) {
    console.error('Get goals error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const getGoalByIdHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const goalId = parseInt(req.params.id);
    const goal = await findGoalById(goalId);

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
      data: goalToResponse(goal),
    });
  } catch (error) {
    console.error('Get goal error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const updateGoalHandler = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
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
    const existingGoal = await findGoalById(goalId);

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

    const updatedGoal = await updateGoal(goalId, {
      title,
      description,
      category,
      status,
      targetDate,
    });

    return res.status(200).json({
      success: true,
      data: goalToResponse(updatedGoal!),
    });
  } catch (error) {
    console.error('Update goal error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const deleteGoalHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const goalId = parseInt(req.params.id);
    const goal = await findGoalById(goalId);

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

    await deleteGoal(goalId);

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};
