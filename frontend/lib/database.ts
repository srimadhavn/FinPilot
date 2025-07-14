import { Pool } from 'pg'
import { UserProfile, ChatSession, UserAnswers, ChatMessage } from './types'

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/finpilot',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Database schema types are now imported from types.ts

// Initialize database tables
export async function initializeDatabase() {
  const client = await pool.connect()
  
  try {
    // Create users table for profiles
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        monthly_investment VARCHAR(50) NOT NULL,
        preference VARCHAR(100) NOT NULL,
        risk_tolerance VARCHAR(100) NOT NULL,
        goal VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create chat sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
        chat_history JSONB DEFAULT '[]'::jsonb,
        current_answers JSONB DEFAULT '{}'::jsonb,
        is_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    client.release()
  }
}

// Database operations
export class DatabaseService {
  // Save user profile
  static async saveUserProfile(profileData: {
    monthly_investment: string
    preference: string
    risk_tolerance: string
    goal: string
  }): Promise<UserProfile> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `INSERT INTO user_profiles (monthly_investment, preference, risk_tolerance, goal)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [profileData.monthly_investment, profileData.preference, profileData.risk_tolerance, profileData.goal]
      )
      
      return result.rows[0]
    } catch (error) {
      console.error('Error saving user profile:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // Create or update chat session
  static async saveChatSession(sessionData: {
    user_id?: string
    chat_history: ChatMessage[]
    current_answers: UserAnswers
    is_complete: boolean
  }): Promise<ChatSession> {
    const client = await pool.connect()
    
    try {
      if (sessionData.user_id) {
        // Update existing session
        const result = await client.query(
          `UPDATE chat_sessions 
           SET chat_history = $2, current_answers = $3, is_complete = $4, updated_at = NOW()
           WHERE user_id = $1
           RETURNING *`,
          [sessionData.user_id, JSON.stringify(sessionData.chat_history), JSON.stringify(sessionData.current_answers), sessionData.is_complete]
        )
        
        if (result.rows.length > 0) {
          return result.rows[0]
        }
      }
      
      // Create new session
      const result = await client.query(
        `INSERT INTO chat_sessions (chat_history, current_answers, is_complete)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [JSON.stringify(sessionData.chat_history), JSON.stringify(sessionData.current_answers), sessionData.is_complete]
      )
      
      return result.rows[0]
    } catch (error) {
      console.error('Error saving chat session:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // Get chat session by ID
  static async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'SELECT * FROM chat_sessions WHERE id = $1',
        [sessionId]
      )
      
      return result.rows[0] || null
    } catch (error) {
      console.error('Error getting chat session:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'SELECT * FROM user_profiles WHERE id = $1',
        [userId]
      )
      
      return result.rows[0] || null
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // Get all user profiles (for analytics)
  static async getAllUserProfiles(limit: number = 100): Promise<UserProfile[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT $1',
        [limit]
      )
      
      return result.rows
    } catch (error) {
      console.error('Error getting user profiles:', error)
      throw error
    } finally {
      client.release()
    }
  }
}

export default pool
