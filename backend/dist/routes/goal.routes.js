"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goal_controller_1 = require("../controllers/goal.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All goal routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.post('/', goal_controller_1.createGoalValidation, goal_controller_1.createGoalHandler);
router.get('/', goal_controller_1.getGoalsHandler);
router.get('/:id', goal_controller_1.getGoalByIdHandler);
router.put('/:id', goal_controller_1.updateGoalValidation, goal_controller_1.updateGoalHandler);
router.delete('/:id', goal_controller_1.deleteGoalHandler);
exports.default = router;
//# sourceMappingURL=goal.routes.js.map