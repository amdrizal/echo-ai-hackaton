"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToResponse = exports.verifyPassword = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (input) => {
    const { email, password, fullName, phoneNumber } = input;
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt_1.default.hash(password, saltRounds);
    const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, full_name, phone_number)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, password_hash, full_name, phone_number, created_at, updated_at`, [email, password_hash, fullName, phoneNumber || null]);
    return result.rows[0];
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const result = await (0, database_1.query)('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findUserById = findUserById;
const verifyPassword = async (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
exports.verifyPassword = verifyPassword;
const userToResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        createdAt: user.created_at,
    };
};
exports.userToResponse = userToResponse;
//# sourceMappingURL=user.model.js.map