"""
Gemini AI Integration Service for FastAPI Backend
"""

import os
import asyncio
from typing import List, Optional
from models import ChatMessage, UserAnswers, AIResponse
from dotenv import load_dotenv

load_dotenv()


class GeminiService:
    """Service class for Gemini AI integration"""
    
    def __init__(self):
        """Initialize Gemini service with configuration"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print(f"✅ Gemini AI service initialized successfully")
        except ImportError:
            raise ImportError("google-generativeai package not installed. Run: pip install google-generativeai")
        except Exception as e:
            raise Exception(f"Failed to initialize Gemini AI: {e}")
    
    async def chat(self, prompt: str, answers: Optional['UserAnswers'] = None) -> AIResponse:
        """Main chat method using Gemini AI"""
        try:
            return await self._call_gemini(prompt, answers)
        except Exception as e:
            print(f"Error in AI chat: {e}")
            # Use fallback question generation when API fails
            if answers:
                fallback_message = self._get_fallback_question(answers)
            else:
                fallback_message = "I'm here to help create your investment profile. To get started, what amount can you invest monthly? (e.g., $500, $1000, $2000)"
            
            return AIResponse(
                message=fallback_message,
                options=None
            )
    
    async def _call_gemini(self, prompt: str, answers: Optional[UserAnswers] = None) -> AIResponse:
        """Call Gemini AI API with optimized token usage"""
        try:
            # Handle initial prompt case without API call
            if prompt.startswith("INITIAL_PROMPT:"):
                return AIResponse(
                    message="Welcome! I'll help you create your investment profile. To get started, what specific amount can you invest monthly? (e.g., $500, $1000, $2000)",
                    options=None
                )
            
            # Create concise prompt to minimize tokens
            enhanced_prompt = f"""Financial advisor collecting investment profile. Required: 4 core + 4 optional fields:

CORE (Priority):
1. Monthly amount ($ number)
2. Investment preference (conservative/moderate/aggressive)  
3. Risk tolerance (low/medium/high)
4. Financial goal (retirement/house/education/emergency)

OPTIONAL (Better profiling):
5. Age (years)
6. Income level (annual salary range)
7. Investment experience (beginner/intermediate/advanced)
8. Time horizon (short/medium/long term)

Context: {prompt}

Ask ONE direct question for missing core info first, then optional. Be concise (1-2 sentences).

Examples:
- "What monthly amount can you invest? ($500, $1000, $2000)"
- "Risk tolerance: low/medium/high?"
- "What's your age range? (20s, 30s, 40s, 50s+)"
- "Investment experience: beginner/intermediate/advanced?"

Response: ONE focused question only."""

            # Call Gemini API
            import google.generativeai as genai
            response = self.model.generate_content(enhanced_prompt)
            
            if response.text:
                return AIResponse(
                    message=response.text.strip(),
                    options=None  # No options - free text input
                )
            else:
                return self._fallback_response()
                
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            # Use fallback question generation when API fails
            if answers:
                fallback_message = self._get_fallback_question(answers)
            else:
                fallback_message = "I'm here to help create your investment profile. To get started, what amount can you invest monthly? (e.g., $500, $1000, $2000)"
            
            return AIResponse(
                message=fallback_message,
                options=None
            )
    
    def _fallback_response(self) -> AIResponse:
        """Fallback response when Gemini fails"""
        return AIResponse(
            message="I'm here to help create your investment profile. To get started, what amount can you invest monthly? (e.g., $500, $1000, $2000)",
            options=None
        )
    
    def _get_fallback_question(self, answers: 'UserAnswers') -> str:
        """Get fallback question based on missing profile information"""
        if not answers.monthly_investment:
            return "What amount can you invest monthly? (e.g., $500, $1000, $2000)"
        elif not answers.risk_tolerance:
            return "What's your risk tolerance: low (safe), medium (balanced), or high (aggressive)?"
        elif not answers.goal:
            return "What's your primary financial goal: retirement, house down payment, education, or emergency fund?"
        elif not answers.preference:
            return "Investment preference: conservative (bonds/CDs), moderate (balanced funds), or aggressive (stocks)?"
        elif not answers.age:
            return "What's your age range? (20s, 30s, 40s, 50s+)"
        elif not answers.experience:
            return "Investment experience: beginner, intermediate, or advanced?"
        else:
            return "Great! I have enough information to create your investment profile."
    
    def build_prompt(self, chat_history: List[ChatMessage], answers: UserAnswers) -> str:
        """Build optimized prompt with minimal token usage"""
        
        # If no conversation has started and no data collected, start with first question
        if not chat_history and not any([answers.monthly_investment, answers.preference, answers.risk_tolerance, answers.goal, answers.age, answers.income, answers.experience, answers.time_horizon]):
            return "INITIAL_PROMPT: Ask for monthly investment amount to start the profile collection process."
        
        # Get only the last 2 messages to minimize context
        recent_history = chat_history[-2:] if len(chat_history) > 2 else chat_history
        conversation = ""
        for message in recent_history:
            role = "User" if message.role == "user" else "Advisor"
            conversation += f"{role}: {message.message}\n"
        
        # Compact profile status
        collected = []
        core_missing = []
        optional_missing = []
        
        # Core fields
        if answers.monthly_investment:
            collected.append(f"Amount: {answers.monthly_investment}")
        else:
            core_missing.append("Monthly amount")
            
        if answers.preference:
            collected.append(f"Preference: {answers.preference}")
        else:
            core_missing.append("Investment preference")
            
        if answers.risk_tolerance:
            collected.append(f"Risk: {answers.risk_tolerance}")
        else:
            core_missing.append("Risk tolerance")
            
        if answers.goal:
            collected.append(f"Goal: {answers.goal}")
        else:
            core_missing.append("Financial goal")
        
        # Optional fields
        if answers.age:
            collected.append(f"Age: {answers.age}")
        else:
            optional_missing.append("Age")
            
        if answers.income:
            collected.append(f"Income: {answers.income}")
        else:
            optional_missing.append("Income level")
            
        if answers.experience:
            collected.append(f"Experience: {answers.experience}")
        else:
            optional_missing.append("Investment experience")
            
        if answers.time_horizon:
            collected.append(f"Horizon: {answers.time_horizon}")
        else:
            optional_missing.append("Time horizon")
        
        # Create minimal prompt
        prompt = f"""Profile Status:
Collected: {', '.join(collected) if collected else 'None'}
Core Missing: {', '.join(core_missing) if core_missing else 'None'}
Optional Missing: {', '.join(optional_missing) if optional_missing else 'None'}

Recent Chat:
{conversation if conversation else 'Starting'}

Task: Ask for the first core missing item, then optional items. If all core complete, acknowledge."""
        
        return prompt

    async def extract_profile_info(self, user_message: str, current_answers: UserAnswers) -> UserAnswers:
        """Extract profile information using simple keyword matching to avoid API calls"""
        try:
            # Simple keyword-based extraction to avoid API calls
            updated_answers = UserAnswers(
                monthly_investment=current_answers.monthly_investment,
                preference=current_answers.preference,
                risk_tolerance=current_answers.risk_tolerance,
                goal=current_answers.goal,
                age=current_answers.age,
                income=current_answers.income,
                experience=current_answers.experience,
                time_horizon=current_answers.time_horizon
            )
            
            message_lower = user_message.lower()
            
            # Extract monthly investment amount
            if not current_answers.monthly_investment:
                import re
                # Look for money patterns: $500, 1000 dollars, Rs 10000, etc.
                money_patterns = [
                    r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # $500, $1,000.50
                    r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|bucks?|usd)',  # 500 dollars
                    r'rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # Rs 10000, Rs. 5000
                    r'invest\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # invest $1000, invest 1000
                    r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+month|monthly|each\s+month|every\s+month)',  # 1000 per month
                    r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:i\s+guess|guess|maybe|or\s+so)',  # 1000 i guess, 1000 maybe
                    r'(?:around|about|roughly)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # around 1000
                    r'(\d+(?:,\d{3})*(?:\.\d{2})?)'  # just any number - catch-all
                ]
                
                for pattern in money_patterns:
                    match = re.search(pattern, message_lower)
                    if match:
                        amount = match.group(1)
                        updated_answers.monthly_investment = f"${amount} per month"
                        break
            
            # Extract age
            if not current_answers.age:
                import re
                age_patterns = [
                    r'(\d{2})\s*(?:years?\s*old|yr|years?)',  # 25 years old
                    r'age\s*(?:is\s*)?(\d{2})',  # age is 25
                    r'i\'?m\s*(\d{2})',  # I'm 25
                    r'(\d{2})s',  # 20s, 30s
                ]
                
                for pattern in age_patterns:
                    match = re.search(pattern, message_lower)
                    if match:
                        age = match.group(1)
                        updated_answers.age = f"{age} years"
                        break
                
                # Age ranges
                age_ranges = {
                    '20s': ['20s', 'twenties', 'early twenties', 'late twenties'],
                    '30s': ['30s', 'thirties', 'early thirties', 'late thirties'],
                    '40s': ['40s', 'forties', 'early forties', 'late forties'],
                    '50s': ['50s', 'fifties', 'early fifties', 'late fifties'],
                    '60+': ['60s', 'sixties', 'retirement age', 'senior']
                }
                
                for age_range, keywords in age_ranges.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.age = age_range
                        break
            
            # Extract income
            if not current_answers.income:
                income_keywords = {
                    'low': ['low income', 'below 50k', 'under 50', 'limited income', 'tight budget'],
                    'medium': ['middle income', '50k to 100k', 'average income', 'decent salary'],
                    'high': ['high income', 'above 100k', 'over 100', 'well paid', 'good salary'],
                    'very high': ['very high income', 'above 200k', 'over 200', 'wealthy', 'rich']
                }
                
                for income_level, keywords in income_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.income = f"{income_level} income"
                        break
            
            # Extract experience
            if not current_answers.experience:
                experience_keywords = {
                    'beginner': ['beginner', 'new to investing', 'never invested', 'starting out', 'novice'],
                    'intermediate': ['intermediate', 'some experience', 'few years', 'moderate experience'],
                    'advanced': ['advanced', 'experienced', 'expert', 'many years', 'professional']
                }
                
                for exp_level, keywords in experience_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.experience = f"{exp_level} investor"
                        break
            
            # Extract time horizon
            if not current_answers.time_horizon:
                time_keywords = {
                    'short': ['short term', '1-3 years', 'few years', 'immediate', 'soon'],
                    'medium': ['medium term', '3-10 years', 'several years', 'mid term'],
                    'long': ['long term', '10+ years', 'many years', 'retirement', 'decades']
                }
                
                for time_period, keywords in time_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.time_horizon = f"{time_period} term"
                        break
            
            # Extract risk tolerance
            if not current_answers.risk_tolerance:
                risk_keywords = {
                    'low': ['low risk', 'safe', 'conservative', 'stable', 'secure', 'cautious'],
                    'medium': ['medium risk', 'moderate', 'balanced', 'medium', 'average'],
                    'high': ['high risk', 'aggressive', 'risky', 'growth', 'volatile']
                }
                
                for risk_level, keywords in risk_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.risk_tolerance = f"{risk_level} risk"
                        break
            
            # Extract investment preference
            if not current_answers.preference:
                pref_keywords = {
                    'conservative': ['conservative', 'bonds', 'cds', 'safe investments', 'fixed deposits'],
                    'moderate': ['moderate', 'balanced', 'mixed', 'diversified', 'mutual funds'],
                    'aggressive': ['aggressive', 'stocks', 'equity', 'growth stocks', 'high growth']
                }
                
                for pref_type, keywords in pref_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.preference = f"{pref_type} investments"
                        break
            
            # Extract financial goal
            if not current_answers.goal:
                goal_keywords = {
                    'retirement': ['retirement', 'retire', 'pension', 'old age'],
                    'house': ['house', 'home', 'property', 'down payment', 'mortgage'],
                    'education': ['education', 'school', 'college', 'university', 'study'],
                    'emergency': ['emergency', 'emergency fund', 'backup', 'contingency']
                }
                
                for goal_type, keywords in goal_keywords.items():
                    if any(keyword in message_lower for keyword in keywords):
                        updated_answers.goal = f"{goal_type} planning"
                        break
            
            return updated_answers
                
        except Exception as e:
            print(f"❌ Error extracting profile info: {e}")
            return current_answers

# Global service instance
ai_service = GeminiService()
