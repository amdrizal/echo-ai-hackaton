import { query } from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone_number?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  createdAt: Date;
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const { email, password, fullName, phoneNumber } = input;

  // Hash password
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, phone_number)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, password_hash, full_name, phone_number, created_at, updated_at`,
    [email, password_hash, fullName, phoneNumber || null]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const userToResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phoneNumber: user.phone_number,
    createdAt: user.created_at,
  };
};
