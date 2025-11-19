import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const createGoalValidation: import("express-validator").ValidationChain[];
export declare const updateGoalValidation: import("express-validator").ValidationChain[];
export declare const createGoalHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getGoalsHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getGoalByIdHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGoalHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGoalHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=goal.controller.d.ts.map