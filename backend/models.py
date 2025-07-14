from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

class MessageRole(str, Enum):
    AI = "ai"
    USER = "user"

class ChatMessage(BaseModel):
    role: MessageRole
    message: str

class UserAnswers(BaseModel):
    monthly_investment: Optional[str] = None
    preference: Optional[str] = None
    risk_tolerance: Optional[str] = None
    goal: Optional[str] = None
    age: Optional[str] = None
    income: Optional[str] = None
    experience: Optional[str] = None
    time_horizon: Optional[str] = None

class NextQuestionRequest(BaseModel):
    chatHistory: List[ChatMessage]
    answers: UserAnswers
    requestId: Optional[str] = None

class NextQuestionResponse(BaseModel):
    message: str
    options: Optional[List[str]] = None
    isComplete: bool
    updatedAnswers: Optional[UserAnswers] = None

class SaveProfileRequest(BaseModel):
    monthlyInvestment: str
    investmentPreference: str
    riskTolerance: str
    goal: str
    age: Optional[str] = None
    income: Optional[str] = None
    experience: Optional[str] = None
    timeHorizon: Optional[str] = None

class SaveProfileResponse(BaseModel):
    success: bool
    message: str
    profileId: str

class AIResponse(BaseModel):
    message: str
    options: Optional[List[str]] = None

# New models for Investment Plan functionality
class InvestmentOption(BaseModel):
    type: str
    name: str
    amount: int
    percentage: int
    reason: str
    holdingPeriod: str
    risk: str  # "High" | "Medium" | "Low"
    color: Optional[str] = None

class RiskBreakdown(BaseModel):
    high: int
    medium: int
    low: int

class InvestmentPlan(BaseModel):
    totalAmount: int
    monthlyInvestment: int
    options: List[InvestmentOption]
    riskBreakdown: RiskBreakdown
    timeline: str
    expectedReturn: str
    recommendations: List[str]
    planId: Optional[str] = None
    createdAt: str

class GeneratePlanRequest(BaseModel):
    profileId: str
    feedback: Optional[str] = None

class GeneratePlanResponse(BaseModel):
    success: bool
    plan: InvestmentPlan
    message: str

class SavePlanRequest(BaseModel):
    profileId: str
    plan: InvestmentPlan

class SavePlanResponse(BaseModel):
    success: bool
    message: str
    planId: str
