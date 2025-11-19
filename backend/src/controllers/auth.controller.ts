import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  userToResponse,
} from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const registerValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phoneNumber').optional().isMobilePhone('any'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, fullName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }

    // Create user
    const user = await createUser({ email, password, fullName, phoneNumber });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      data: {
        user: userToResponse(user),
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during registration',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      data: {
        user: userToResponse(user),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during login',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: userToResponse(user),
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};
