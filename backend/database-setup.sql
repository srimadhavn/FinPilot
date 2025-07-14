-- FinPilot PostgreSQL Database Setup
-- Run this script to set up the database structure

-- Create database (run this manually in psql or pgAdmin)
-- CREATE DATABASE finpilot;

-- Connect to the finpilot database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "gen_random_uuid";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_investment VARCHAR(50) NOT NULL,
    preference VARCHAR(100) NOT NULL,
    risk_tolerance VARCHAR(100) NOT NULL,
    goal VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    chat_history JSONB DEFAULT '[]'::jsonb,
    current_answers JSONB DEFAULT '{}'::jsonb,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_is_complete ON chat_sessions(is_complete);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO user_profiles (monthly_investment, preference, risk_tolerance, goal) 
-- VALUES 
--     ('₹10,000', 'Balanced approach', 'Somewhat worried', 'Financial freedom'),
--     ('₹25,000', 'Long-term wealth building', 'Not too bothered', 'Retirement planning'),
--     ('₹5,000', 'Short-term profits', 'Very concerned', 'Emergency fund');

-- Check the tables
-- SELECT * FROM user_profiles;
-- SELECT * FROM chat_sessions;
