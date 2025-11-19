"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name is required'),
    (0, express_validator_1.body)('phoneNumber').optional().isMobilePhone('any'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
const register = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { email, password, fullName, phoneNumber } = req.body;
        // Check if user already exists
        const existingUser = await (0, user_model_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists',
            });
        }
        // Create user
        const user = await (0, user_model_1.createUser)({ email, password, fullName, phoneNumber });
        // Generate token
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        return res.status(201).json({
            success: true,
            data: {
                user: (0, user_model_1.userToResponse)(user),
                token,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during registration',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { email, password } = req.body;
        // Find user
        const user = await (0, user_model_1.findUserByEmail)(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        // Verify password
        const isValidPassword = await (0, user_model_1.verifyPassword)(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        return res.status(200).json({
            success: true,
            data: {
                user: (0, user_model_1.userToResponse)(user),
                token,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during login',
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        const user = await (0, user_model_1.findUserById)(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: (0, user_model_1.userToResponse)(user),
        });
    }
    catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map