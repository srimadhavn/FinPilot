// Shared types for the FinPilot application

export interface ChatMessage {
  role: "ai" | "user"
  message: string
}

export interface UserAnswers {
  monthly_investment?: string
  preference?: string
  risk_tolerance?: string
  goal?: string
}

export interface UserProfile {
  id: string
  monthly_investment: string
  preference: string
  risk_tolerance: string
  goal: string
  created_at: Date
  updated_at: Date
}

export interface ChatSession {
  id: string
  user_id?: string
  chat_history: ChatMessage[]
  current_answers: UserAnswers
  is_complete: boolean
  created_at: Date
  updated_at: Date
}

export interface AIResponse {
  message: string
  options?: string[]
}

export interface NextQuestionRequest {
  chatHistory: ChatMessage[]
  answers: UserAnswers
  sessionId?: string
}

export interface NextQuestionResponse {
  message: string
  options?: string[]
  isComplete: boolean
  sessionId?: string
}

export interface SaveProfileRequest {
  monthlyInvestment: string
  investmentPreference: string
  riskTolerance: string
  goal: string
  sessionId?: string
}

export interface SaveProfileResponse {
  success: boolean
  profileId: string
  message: string
}
