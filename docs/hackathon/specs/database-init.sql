-- Echo-AI Database Initialization Script
-- Run this tonight to set up your PostgreSQL database

-- Connect to PostgreSQL and create database
-- Command: psql -U postgres
-- Then run: CREATE DATABASE echoai_dev;
-- Then run: \c echoai_dev
-- Then run: \i /path/to/this/file.sql

-- Drop existing tables (for clean slate)
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Create Goals Table
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'personal',
    status VARCHAR(20) DEFAULT 'active',
    created_from_voice BOOLEAN DEFAULT true,
    vapi_conversation_id VARCHAR(255),
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_category CHECK (category IN ('career', 'health', 'financial', 'education', 'relationships', 'personal', 'creative')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'completed', 'abandoned', 'on_hold'))
);

-- Create Indexes for Goals
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_created_at ON goals(created_at);
CREATE INDEX idx_goals_vapi_conversation_id ON goals(vapi_conversation_id);

-- Create Conversations Table (Optional but Recommended)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vapi_call_id VARCHAR(255) UNIQUE NOT NULL,
    transcript TEXT,
    summary TEXT,
    goals_extracted JSONB,
    duration_seconds INTEGER,
    call_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_call_status CHECK (call_status IN ('completed', 'failed', 'abandoned'))
);

-- Create Indexes for Conversations
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_vapi_call_id ON conversations(vapi_call_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- Insert test user for development
-- Password for this user is: "TestPass123!" (hashed with bcrypt)
-- Use this for testing tomorrow!
INSERT INTO users (email, password_hash, full_name, phone_number) VALUES
('test@echoai.com', '$2b$10$N9qo8uLOickgx2ZMRZo7ee.CnpMJdZr2l0JzGYKUl/eM6SsNJL6fu', 'Test User', '+1234567890');

-- Get the test user ID and create sample goals
INSERT INTO goals (user_id, title, description, category, status, created_from_voice) VALUES
(1, 'Learn Spanish fluently', 'Practice 30 minutes daily using Duolingo and conversation practice', 'education', 'active', true),
(1, 'Launch side project', 'Build and ship MVP within 3 months', 'career', 'active', true),
(1, 'Exercise regularly', 'Go to gym 3 times per week', 'health', 'active', false);

-- Verify setup
SELECT 'Database initialized successfully!' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS goal_count FROM goals;
