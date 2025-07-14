"""
Simple FinPilot FastAPI Backend for Testing
Without database operations initially
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, List, Optional

# Import the Pydantic models (not SQLAlchemy)
from models import (
    NextQuestionRequest, NextQuestionResponse, 
    SaveProfileRequest, SaveProfileResponse,
    GeneratePlanRequest, GeneratePlanResponse,
    SavePlanRequest, SavePlanResponse
)
from ai_service import ai_service
from investment_plan_service import investment_plan_service
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI application
app = FastAPI(
    title="FinPilot API",
    description="AI-powered investment advisory backend with Gemini AI integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for testing
profiles_storage: Dict[str, Dict] = {}
sessions_storage: Dict[str, Dict] = {}
plans_storage: Dict[str, Dict] = {}  # Storage for investment plans

# Helper function to check profile completion
def is_profile_complete(answers) -> bool:
    """Check if profile is complete without API calls"""
    # Core required fields
    required_fields = ['monthly_investment', 'preference', 'risk_tolerance', 'goal']
    answers_dict = answers.model_dump()
    
    # Check core fields
    core_complete = all(
        answers_dict.get(field) and 
        answers_dict.get(field) != 'undefined' and 
        str(answers_dict.get(field)).strip() != '' and
        len(str(answers_dict.get(field)).strip()) > 2  # Ensure meaningful data, not just "ok" or "yes"
        for field in required_fields
    )
    
    # Optional fields for better profiling
    optional_fields = ['age', 'income', 'experience', 'time_horizon']
    optional_count = sum(1 for field in optional_fields if answers_dict.get(field) and len(str(answers_dict.get(field)).strip()) > 2)
    
    # Complete if all core fields are filled OR core fields + at least 2 optional fields
    return core_complete or (core_complete and optional_count >= 2)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "FinPilot FastAPI Backend",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "ai_provider": "gemini"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "1.0.0",
        "ai_provider": "gemini"
    }

# Next question endpoint
@app.post("/api/next-question", response_model=NextQuestionResponse)
async def get_next_question(request: NextQuestionRequest):
    """Generate next question using Gemini AI"""
    try:
        # Log request ID for debugging
        request_id = request.requestId or "unknown"
        print(f"🔄 Processing request: {request_id}")
        
        # If there's a user message in the latest chat history, extract profile info
        updated_answers = request.answers
        if request.chatHistory and request.chatHistory[-1].role == "user":
            latest_user_message = request.chatHistory[-1].message
            # Use optimized extraction that doesn't call API
            updated_answers = await ai_service.extract_profile_info(latest_user_message, request.answers)
            print(f"🔍 Profile extraction result: {updated_answers.model_dump()}")
        
        # Only call AI if we need to ask a question (not for every message)
        is_complete = is_profile_complete(updated_answers)
        
        if is_complete:
            # Don't call AI for completion message
            ai_response_message = "Perfect! I have all the information needed. Your investment profile is complete and ready for plan generation."
        else:
            # Build minimal prompt and call AI only when needed
            prompt = ai_service.build_prompt(request.chatHistory, updated_answers)
            ai_response = await ai_service.chat(prompt, updated_answers)
            ai_response_message = ai_response.message
        
        print(f"📊 Profile completion check: {updated_answers.model_dump()}")
        print(f"🎯 Is complete: {is_complete}")
        
        # Generate session ID for tracking
        session_id = f"session_{len(sessions_storage) + 1}"
        
        # Store session in memory
        sessions_storage[session_id] = {
            "request_id": request_id,
            "chat_history": [msg.model_dump() for msg in request.chatHistory],
            "current_answers": updated_answers.model_dump(),
            "is_complete": is_complete,
            "created_at": datetime.now().isoformat()
        }
        
        print(f"💾 Chat session stored: {session_id} (request: {request_id})")
        
        return NextQuestionResponse(
            message=ai_response_message,
            options=None,
            isComplete=is_complete,
            updatedAnswers=updated_answers
        )
        
    except Exception as e:
        print(f"❌ Error generating next question: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Save profile endpoint
@app.post("/api/save-profile", response_model=SaveProfileResponse)
async def save_profile(request: SaveProfileRequest):
    """Save user investment profile"""
    try:
        # Generate profile ID
        profile_id = f"profile_{len(profiles_storage) + 1}"
        
        # Create user profile
        profile_data = {
            "id": profile_id,
            "monthly_investment": request.monthlyInvestment,
            "preference": request.investmentPreference,
            "risk_tolerance": request.riskTolerance,
            "goal": request.goal,
            "age": request.age,
            "income": request.income,
            "experience": request.experience,
            "time_horizon": request.timeHorizon,
            "created_at": datetime.now().isoformat()
        }
        
        # Store in memory
        profiles_storage[profile_id] = profile_data
        
        print(f"✅ Profile saved successfully: {profile_id}")
        
        return SaveProfileResponse(
            success=True,
            message="Investment profile created successfully! Welcome to FinPilot!",
            profileId=profile_id
        )
        
    except Exception as e:
        print(f"❌ Error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to save profile")

# Get stored profiles (for testing)
@app.get("/api/profiles")
async def get_profiles():
    """Get all stored profiles (testing only)"""
    return {
        "profiles": profiles_storage,
        "sessions": sessions_storage,
        "plans": plans_storage,
        "total_profiles": len(profiles_storage),
        "total_sessions": len(sessions_storage),
        "total_plans": len(plans_storage)
    }

# Generate investment plan endpoint
@app.post("/api/generate-plan", response_model=GeneratePlanResponse)
async def generate_investment_plan(request: GeneratePlanRequest):
    """Generate personalized investment plan based on user profile"""
    try:
        # Get profile data
        profile_data = profiles_storage.get(request.profileId)
        if not profile_data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        print(f"🔄 Generating investment plan for profile: {request.profileId}")
        
        # Generate investment plan
        investment_plan = await investment_plan_service.generate_ai_plan(
            profile_data, 
            request.feedback
        )
        
        # Store the plan
        plan_id = investment_plan.planId or f"plan_{int(datetime.now().timestamp())}"
        plans_storage[plan_id] = {
            "plan": investment_plan.model_dump(),
            "profile_id": request.profileId,
            "created_at": datetime.now().isoformat()
        }
        
        message = "📊 I've created your personalized investment plan based on your profile."
        if request.feedback:
            message = f"I've adjusted your investment plan based on your feedback: '{request.feedback}'"
        
        print(f"✅ Investment plan generated: {investment_plan.planId} for profile: {request.profileId}")
        
        return GeneratePlanResponse(
            success=True,
            plan=investment_plan,
            message=message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error generating investment plan: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate investment plan")

# Save investment plan endpoint
@app.post("/api/save-plan", response_model=SavePlanResponse)
async def save_investment_plan(request: SavePlanRequest):
    """Save investment plan to persistent storage"""
    try:
        # Store the plan with timestamp
        plan_id = request.plan.planId or f"plan_{int(datetime.now().timestamp())}"
        
        plans_storage[plan_id] = {
            "plan": request.plan.model_dump(),
            "profile_id": request.profileId,
            "saved_at": datetime.now().isoformat()
        }
        
        print(f"✅ Investment plan saved: {plan_id}")
        
        return SavePlanResponse(
            success=True,
            message="🎉 Your investment plan has been successfully saved! You can access it anytime from your dashboard.",
            planId=plan_id
        )
        
    except Exception as e:
        print(f"❌ Error saving investment plan: {e}")
        raise HTTPException(status_code=500, detail="Failed to save investment plan")

# Get investment plan endpoint
@app.get("/api/plan/{plan_id}")
async def get_investment_plan(plan_id: str):
    """Get investment plan by ID"""
    plan_data = plans_storage.get(plan_id)
    if not plan_data:
        raise HTTPException(status_code=404, detail="Investment plan not found")
    
    return plan_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
