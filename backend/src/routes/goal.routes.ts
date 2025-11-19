import { Router } from 'express';
import {
  createGoalHandler,
  getGoalsHandler,
  getGoalByIdHandler,
  updateGoalHandler,
  deleteGoalHandler,
  createGoalValidation,
  updateGoalValidation,
} from '../controllers/goal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All goal routes require authentication
router.use(authenticateToken);

router.post('/', createGoalValidation, createGoalHandler);
router.get('/', getGoalsHandler);
router.get('/:id', getGoalByIdHandler);
router.put('/:id', updateGoalValidation, updateGoalHandler);
router.delete('/:id', deleteGoalHandler);

export default router;
