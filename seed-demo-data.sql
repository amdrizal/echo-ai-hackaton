-- seed-demo-data.sql - Demo data for Echo-AI Hackathon
-- This script creates a demo user and sample goals for testing and demonstration
--
-- Demo User Credentials:
--   Email: demo@echoai.com
--   Password: Demo123!
--
-- Usage:
--   psql -U postgres -d echoai_dev -f seed-demo-data.sql
--
-- Or via URL:
--   psql "postgresql://postgres:password@localhost:5432/echoai_dev" -f seed-demo-data.sql

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Clear existing demo data (safe to run multiple times)
DELETE FROM goals WHERE user_id IN (
    SELECT id FROM users WHERE email = 'demo@echoai.com'
);
DELETE FROM users WHERE email = 'demo@echoai.com';

-- Re-enable foreign key checks
SET session_replication_role = 'default';

-- Create demo user
-- Password hash for "Demo123!" (bcrypt hashed)
-- Note: In production, passwords should be hashed via bcrypt in the application
INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    created_at,
    updated_at
) VALUES (
    'demo-user-001',
    'demo@echoai.com',
    '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', -- Placeholder hash
    'Demo',
    'User',
    NOW(),
    NOW()
);

-- Get the user ID for reference
-- Note: Adjust the user_id value based on your actual user creation
-- The following assumes the user was just created with id 'demo-user-001'

-- Create sample goals across different categories
-- Goal 1: Career - Voice-Created Goal
INSERT INTO goals (
    id,
    user_id,
    title,
    description,
    category,
    status,
    priority,
    created_via_voice,
    created_at,
    updated_at
) VALUES (
    'goal-career-001',
    'demo-user-001',
    'Complete Advanced TypeScript Course',
    'Finish the advanced TypeScript course on Udemy and build one production application with TypeScript',
    'Career',
    'in_progress',
    'high',
    true,
    NOW() - INTERVAL '5 days',
    NOW()
);

-- Goal 2: Health - Voice-Created Goal
INSERT INTO goals (
    id,
    user_id,
    title,
    description,
    category,
    status,
    priority,
    created_via_voice,
    created_at,
    updated_at
) VALUES (
    'goal-health-001',
    'demo-user-001',
    'Run a 5K Race',
    'Train for and complete a 5K race in under 25 minutes',
    'Health',
    'in_progress',
    'high',
    true,
    NOW() - INTERVAL '7 days',
    NOW()
);

-- Goal 3: Finance - Manual Goal
INSERT INTO goals (
    id,
    user_id,
    title,
    description,
    category,
    status,
    priority,
    created_via_voice,
    created_at,
    updated_at
) VALUES (
    'goal-finance-001',
    'demo-user-001',
    'Save $5,000 for Emergency Fund',
    'Build a 3-month emergency fund by saving $500 each month',
    'Financial',
    'pending',
    'high',
    false,
    NOW() - INTERVAL '2 days',
    NOW()
);

-- Goal 4: Personal Development - Voice-Created Goal
INSERT INTO goals (
    id,
    user_id,
    title,
    description,
    category,
    status,
    priority,
    created_via_voice,
    created_at,
    updated_at
) VALUES (
    'goal-personal-001',
    'demo-user-001',
    'Read 12 Books This Year',
    'Read one book per month, focusing on personal development and fiction',
    'Personal Development',
    'in_progress',
    'medium',
    true,
    NOW() - INTERVAL '30 days',
    NOW()
);

-- Goal 5: Relationships - Manual Goal
INSERT INTO goals (
    id,
    user_id,
    title,
    description,
    category,
    status,
    priority,
    created_via_voice,
    created_at,
    updated_at
) VALUES (
    'goal-relationships-001',
    'demo-user-001',
    'Weekly Dinner with Family',
    'Have a family dinner every Sunday to strengthen relationships',
    'Relationships',
    'pending',
    'medium',
    false,
    NOW() - INTERVAL '3 days',
    NOW()
);

-- Create sample milestones for tracking progress
-- Milestone 1: TypeScript Course - 25% Complete
INSERT INTO milestones (
    id,
    goal_id,
    title,
    description,
    target_date,
    completed,
    completed_at,
    created_at,
    updated_at
) VALUES (
    'milestone-001',
    'goal-career-001',
    'Complete Module 1: Advanced Types',
    'Learn union types, intersection types, and generics',
    NOW() + INTERVAL '7 days',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days'
);

-- Milestone 2: TypeScript Course - 50% Planned
INSERT INTO milestones (
    id,
    goal_id,
    title,
    description,
    target_date,
    completed,
    completed_at,
    created_at,
    updated_at
) VALUES (
    'milestone-002',
    'goal-career-001',
    'Complete Module 2: Advanced Patterns',
    'Master decorators, meta-programming, and design patterns',
    NOW() + INTERVAL '14 days',
    false,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW()
);

-- Milestone 3: 5K Training - Week 1
INSERT INTO milestones (
    id,
    goal_id,
    title,
    description,
    target_date,
    completed,
    completed_at,
    created_at,
    updated_at
) VALUES (
    'milestone-003',
    'goal-health-001',
    'Complete Week 1 Training',
    'Run 3 times this week: 2 miles each session',
    NOW() + INTERVAL '3 days',
    false,
    NULL,
    NOW() - INTERVAL '2 days',
    NOW()
);

-- Milestone 4: Books - Q1 Target
INSERT INTO milestones (
    id,
    goal_id,
    title,
    description,
    target_date,
    completed,
    completed_at,
    created_at,
    updated_at
) VALUES (
    'milestone-004',
    'goal-personal-001',
    'Read 3 Books in Q1',
    'Complete one book per month in January, February, and March',
    NOW() + INTERVAL '30 days',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '5 days'
);

-- Create sample voice conversation records
INSERT INTO voice_sessions (
    id,
    user_id,
    goal_id,
    vapi_call_id,
    transcript,
    duration_seconds,
    status,
    created_at,
    updated_at
) VALUES (
    'voice-session-001',
    'demo-user-001',
    'goal-career-001',
    'vapi-call-12345',
    'I want to improve my TypeScript skills by taking an advanced course. I''d like to complete it within the next month so I can apply it to my current project. This will help me become more efficient at work.',
    245,
    'completed',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
);

INSERT INTO voice_sessions (
    id,
    user_id,
    goal_id,
    vapi_call_id,
    transcript,
    duration_seconds,
    status,
    created_at,
    updated_at
) VALUES (
    'voice-session-002',
    'demo-user-001',
    'goal-health-001',
    'vapi-call-12346',
    'My goal is to run a 5K race. I currently can run about 2 miles, so I need to build up my endurance. I want to complete this by the end of Q1 and finish in under 25 minutes.',
    312,
    'completed',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
);

INSERT INTO voice_sessions (
    id,
    user_id,
    goal_id,
    vapi_call_id,
    transcript,
    duration_seconds,
    status,
    created_at,
    updated_at
) VALUES (
    'voice-session-003',
    'demo-user-001',
    'goal-personal-001',
    'vapi-call-12347',
    'I want to start reading more books. I''ve been too busy with work. My goal is to read one book per month for the rest of the year. I like both fiction and non-fiction, especially self-help books.',
    189,
    'completed',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
);

-- Print confirmation message
SELECT format('
╔════════════════════════════════════════════════════════════╗
║                    DEMO DATA CREATED                       ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Demo User:                                               ║
║    Email:    demo@echoai.com                              ║
║    Password: Demo123!                                     ║
║                                                            ║
║  Sample Data:                                             ║
║    - 1 Demo User Account                                  ║
║    - 5 Sample Goals (Career, Health, Finance, etc.)      ║
║    - 4 Milestones for tracking progress                  ║
║    - 3 Voice Session Records                             ║
║                                                            ║
║  Ready for Demo Presentation                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
') as result;
