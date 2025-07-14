"""
AI-Powered Investment Plan Generation Service
Generates personalized investment plans using AI analysis
"""
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
from models import InvestmentPlan, InvestmentOption, RiskBreakdown
from ai_service import ai_service

class InvestmentPlanService:
    def __init__(self):
        self.color_palette = {
            "primary": "#336699",      # Lapis Lazuli
            "secondary": "#86BBD8",    # Carolina Blue  
            "success": "#9EE493",      # Light Green
            "charcoal": "#2F4858",     # Charcoal
            "nyanza": "#DAF7DC",       # Nyanza
            "mid_blue": "#6B8CAE"      # Mid-tone blue
        }

    def generate_plan(self, profile_data: Dict, feedback: Optional[str] = None) -> InvestmentPlan:
        """Generate an AI-powered investment plan based on user profile"""
        
        # Use asyncio to call async AI function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            plan = loop.run_until_complete(self.generate_ai_plan(profile_data, feedback))
            return plan
        finally:
            loop.close()
    
    async def generate_ai_plan(self, profile_data: Dict, feedback: Optional[str] = None) -> InvestmentPlan:
        """Generate investment plan using AI analysis"""
        
        # Extract profile data
        monthly_investment = self._parse_amount(profile_data.get("monthly_investment", "5000"))
        risk_tolerance = profile_data.get("risk_tolerance", "")
        preference = profile_data.get("preference", "")
        goal = profile_data.get("goal", "")
        age = profile_data.get("age", "30")
        income = profile_data.get("income", "")
        experience = profile_data.get("experience", "")
        
        # Create AI prompt for investment analysis
        ai_prompt = self._create_investment_prompt(
            monthly_investment, risk_tolerance, preference, goal, 
            age, income, experience, feedback
        )
        
        # Get AI-generated investment plan
        ai_response = await ai_service.chat(ai_prompt)
        
        # Parse AI response to create structured investment plan
        plan = self._parse_ai_response(ai_response.message, monthly_investment, risk_tolerance, goal)
        
        return plan

    def _parse_amount(self, amount_str: str) -> int:
        """Parse amount string to integer with proper logic"""
        if not amount_str or amount_str == "undefined":
            return 5000
            
        amount_str = amount_str.lower().strip()
        
        # Handle range selections properly
        if "$100-500" in amount_str:
            return 300  # Average of range
        elif "$500-1000" in amount_str or "$500-1,000" in amount_str:
            return 750  # Average of range
        elif "$1000-2000" in amount_str or "$1,000-2,000" in amount_str:
            return 1500  # Average of range
        elif "more than $2000" in amount_str or "more than $2,000" in amount_str:
            return 3000  # Conservative estimate
        
        # Extract first number found if direct amount
        import re
        numbers = re.findall(r'\d+', amount_str.replace(',', ''))
        if numbers:
            return int(numbers[0])
            
        return 5000  # Default fallback

    def _create_investment_prompt(
        self, 
        monthly_investment: int, 
        risk_tolerance: str, 
        preference: str, 
        goal: str,
        age: str,
        income: str,
        experience: str,
        feedback: Optional[str] = None
    ) -> str:
        """Create AI prompt for personalized investment analysis"""
        
        # Create risk-specific guidance for AI
        risk_guidance = self._get_risk_specific_guidance(risk_tolerance, age, goal)
        
        prompt = f"""
You are an expert financial advisor AI. Create a HIGHLY PERSONALIZED investment plan that PRIMARILY considers the client's FINANCIAL GOAL, then balances with risk tolerance.

CRITICAL: Investment strategy must FIRST match the GOAL, then adjust for risk comfort. Different goals require completely different approaches regardless of risk tolerance.

Client Profile:
- Monthly Investment Amount: ${monthly_investment:,} USD
- Age: {age} years
- PRIMARY FINANCIAL GOAL: {goal} ⭐ (THIS DRIVES THE STRATEGY)
- Risk Tolerance: {risk_tolerance} (secondary consideration)
- Investment Preference: {preference}
- Income Level: {income}
- Investment Experience: {experience}
{f"- Additional Feedback: {feedback}" if feedback else ""}

{risk_guidance}

GOAL-BASED STRATEGY RULES:
1. EMERGENCY FUND: Always conservative (80% low risk) - liquidity is key, not growth
2. HOME PURCHASE: Timeline matters more than risk tolerance
   - Short-term (1-3 years): 60% low risk regardless of risk tolerance
   - Long-term (5+ years): Can be more aggressive
3. RETIREMENT: Age-based allocation
   - Under 35: Can be aggressive (60% high risk) even if moderate risk tolerance
   - 35-50: Balanced approach 
   - Over 50: Conservative regardless of stated risk tolerance
4. WEALTH BUILDING: Risk tolerance becomes primary factor

INVESTMENT SELECTION RULES:
- EMERGENCY FUND: Savings accounts, liquid funds, short-term FDs only
- HOME PURCHASE (short): FDs, debt funds, conservative hybrid funds
- HOME PURCHASE (long): Large-cap funds, balanced funds, some growth
- RETIREMENT (young): Small-cap, mid-cap, index funds, ELSS
- RETIREMENT (older): Large-cap, balanced funds, debt funds
- WEALTH BUILDING: Based on risk tolerance

PERSONALIZATION FACTORS:
- Age: {self._get_age_guidance(age)}
- Goal Timeline: {self._get_goal_guidance(goal)}
- Risk Mapping: {self._get_risk_mapping(risk_tolerance)}

Respond in this exact JSON format:
{{
  "riskAllocation": {{
    "high": <percentage_based_on_goal_first_then_risk>,
    "medium": <percentage_based_on_goal_first_then_risk>, 
    "low": <percentage_based_on_goal_first_then_risk>
  }},
  "investments": [
    {{
      "type": "<investment_type_matching_goal>",
      "name": "<specific_Indian_fund_or_instrument>",
      "amount": <amount_in_rupees>,
      "percentage": <percentage>,
      "risk": "<High/Medium/Low>",
      "holdingPeriod": "<duration_matching_goal>",
      "reason": "<explanation_why_this_fits_GOAL_and_risk_profile>"
    }}
  ]
}}

REMEMBER: The same person with different goals should get COMPLETELY different plans. Goal drives strategy first, risk tolerance adjusts within that framework!
"""
        return prompt

    def _get_risk_specific_guidance(self, risk_tolerance: str, age: str, goal: str) -> str:
        """Get specific guidance based on risk tolerance"""
        risk_lower = risk_tolerance.lower()
        
        if "aggressive" in risk_lower or "high" in risk_lower:
            return """
RISK PROFILE: AGGRESSIVE INVESTOR
- This client wants HIGH RETURNS and can handle HIGH VOLATILITY
- Allocate 60-80% to high-risk investments
- Focus on growth stocks, small-cap funds, sector ETFs, crypto
- Minimize safe investments (max 20% in bonds/FDs)
"""
        elif "conservative" in risk_lower or "low" in risk_lower:
            return """
RISK PROFILE: CONSERVATIVE INVESTOR  
- This client prioritizes CAPITAL SAFETY over high returns
- Allocate 60-80% to low-risk investments
- Focus on government bonds, FDs, debt funds, blue-chip dividend stocks
- Minimize high-risk investments (max 20% in stocks)
"""
        else:
            return """
RISK PROFILE: MODERATE INVESTOR
- This client wants BALANCED growth with moderate risk
- Allocate 40-50% to medium-risk investments
- Focus on diversified mutual funds, index funds, large-cap stocks
- Balance between safety and growth
"""

    def _get_allocation_guidance(self, risk_tolerance: str) -> str:
        """Get allocation guidance based on risk tolerance"""
        risk_lower = risk_tolerance.lower()
        
        if "aggressive" in risk_lower or "high" in risk_lower:
            return "High Risk: 60-80%, Medium Risk: 15-25%, Low Risk: 5-20%"
        elif "conservative" in risk_lower or "low" in risk_lower:
            return "High Risk: 5-20%, Medium Risk: 15-25%, Low Risk: 60-80%"
        else:
            return "High Risk: 25-35%, Medium Risk: 40-50%, Low Risk: 20-30%"

    def _get_age_guidance(self, age: str) -> str:
        """Get age-specific guidance"""
        try:
            age_num = int(age)
            if age_num < 30:
                return "Young investor - can take more risks for long-term growth"
            elif age_num < 50:
                return "Mid-career - balance growth and stability" 
            else:
                return "Approaching retirement - focus on capital preservation"
        except:
            return "Consider age-appropriate risk allocation"

    def _get_goal_guidance(self, goal: str) -> str:
        """Get goal-specific guidance"""
        goal_lower = goal.lower()
        if "retirement" in goal_lower:
            return "Long-term goal - can handle market volatility for better returns"
        elif "house" in goal_lower or "home" in goal_lower:
            return "Medium-term goal - balanced approach with some safety"
        elif "emergency" in goal_lower:
            return "Safety-first approach - prioritize liquidity and capital preservation"
        elif "wealth" in goal_lower or "growth" in goal_lower:
            return "Growth-focused - can take higher risks for wealth building"
        else:
            return "Align investment risk with goal timeline"

    def _get_experience_guidance(self, experience: str) -> str:
        """Get experience-specific guidance"""
        exp_lower = experience.lower()
        if "beginner" in exp_lower or "new" in exp_lower:
            return "New investor - start with diversified, low-cost options"
        elif "experienced" in exp_lower or "advanced" in exp_lower:
            return "Experienced investor - can handle complex instruments and sector bets"
        else:
            return "Intermediate investor - balanced approach with some focused bets"

    def _get_risk_mapping(self, risk_tolerance: str) -> str:
        """Map risk tolerance responses to actual risk levels"""
        risk_lower = risk_tolerance.lower()
        if "very concerned" in risk_lower:
            return "Conservative investor - prioritize capital safety"
        elif "somewhat worried" in risk_lower:
            return "Moderate-conservative investor - limited risk acceptable"
        elif "not too bothered" in risk_lower:
            return "Moderate investor - balanced approach to risk/reward"
        elif "completely fine" in risk_lower:
            return "Moderate-aggressive investor - comfortable with volatility for growth"
        elif "aggressive" in risk_lower:
            return "Aggressive investor - maximum growth focus"
        else:
            return "Moderate investor - balanced risk approach"

    def _parse_ai_response(self, ai_content: str, monthly_investment: int, risk_tolerance: str = "moderate", goal: str = "wealth building") -> InvestmentPlan:
        """Parse AI response and create structured investment plan"""
        
        try:
            # Try to extract JSON from AI response
            json_start = ai_content.find('{')
            json_end = ai_content.rfind('}') + 1
            
            if json_start != -1 and json_end != -1:
                json_str = ai_content[json_start:json_end]
                ai_data = json.loads(json_str)
                
                # Extract risk allocation
                risk_allocation = ai_data.get("riskAllocation", {"high": 30, "medium": 40, "low": 30})
                
                # Create investment options from AI data
                options = []
                for inv in ai_data.get("investments", []):
                    # Assign colors based on risk level
                    color = self._get_risk_color(inv.get("risk", "Medium"))
                    
                    options.append(InvestmentOption(
                        type=inv.get("type", "Mixed Investment"),
                        name=inv.get("name", "AI Selected Investment"),
                        amount=inv.get("amount", monthly_investment // len(ai_data.get("investments", [1]))),
                        percentage=inv.get("percentage", 100 // len(ai_data.get("investments", [1]))),
                        reason=inv.get("reason", "AI-generated personalized investment recommendation"),
                        holdingPeriod=inv.get("holdingPeriod", "1-3 years"),
                        risk=inv.get("risk", "Medium"),
                        color=color
                    ))
                
                # Create plan ID
                plan_id = f"ai_plan_{int(datetime.now().timestamp())}"
                
                return InvestmentPlan(
                    totalAmount=monthly_investment,
                    monthlyInvestment=monthly_investment,
                    options=options,
                    riskBreakdown=RiskBreakdown(
                        high=risk_allocation.get("high", 30),
                        medium=risk_allocation.get("medium", 40),
                        low=risk_allocation.get("low", 30)
                    ),
                    timeline=ai_data.get("timeline", "3-5 years"),
                    expectedReturn=ai_data.get("expectedReturn", "8-12%"),
                    recommendations=ai_data.get("recommendations", [
                        "Review and rebalance portfolio quarterly",
                        "Consider increasing investment amount annually",
                        "Monitor performance and adjust strategy as needed"
                    ]),
                    planId=plan_id,
                    createdAt=datetime.now().isoformat()
                )
                
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error parsing AI response: {e}")
            
        # Fallback: Create a basic plan if AI parsing fails
        return self._create_fallback_plan(monthly_investment, risk_tolerance, goal)

    def _get_risk_color(self, risk_level: str) -> str:
        """Get color based on risk level"""
        risk_colors = {
            "High": self.color_palette["charcoal"],
            "Medium": self.color_palette["primary"], 
            "Low": self.color_palette["success"]
        }
        return risk_colors.get(risk_level, self.color_palette["secondary"])

    def _create_fallback_plan(self, monthly_investment: int, risk_tolerance: str = "moderate", goal: str = "wealth building") -> InvestmentPlan:
        """Create a proper fallback plan based on user preferences"""
        
        plan_id = f"fallback_plan_{int(datetime.now().timestamp())}"
        risk_lower = risk_tolerance.lower()
        
        # Create appropriate allocations based on ACTUAL user preferences
        if "aggressive" in risk_lower or "high" in risk_lower:
            # AGGRESSIVE: High growth stocks and equity
            options = [
                InvestmentOption(
                    type="Growth Stocks",
                    name="High Growth Equity Fund",
                    amount=int(monthly_investment * 0.70),
                    percentage=70,
                    reason="High-growth potential for aggressive investors seeking maximum returns",
                    holdingPeriod="5+ years",
                    risk="High",
                    color=self.color_palette["charcoal"]
                ),
                InvestmentOption(
                    type="Equity Index Funds", 
                    name="S&P 500 Index Fund",
                    amount=int(monthly_investment * 0.30),
                    percentage=30,
                    reason="Diversified market exposure for long-term growth",
                    holdingPeriod="3-5 years",
                    risk="Medium",
                    color=self.color_palette["primary"]
                )
            ]
            risk_breakdown = RiskBreakdown(high=70, medium=30, low=0)
            
        elif "conservative" in risk_lower or "low" in risk_lower:
            # CONSERVATIVE: Safety first
            options = [
                InvestmentOption(
                    type="Fixed Deposits",
                    name="High-Yield Savings",
                    amount=int(monthly_investment * 0.60),
                    percentage=60,
                    reason="Capital preservation with guaranteed returns",
                    holdingPeriod="1-2 years",
                    risk="Low", 
                    color=self.color_palette["success"]
                ),
                InvestmentOption(
                    type="Government Bonds",
                    name="Treasury Bonds",
                    amount=int(monthly_investment * 0.40),
                    percentage=40,
                    reason="Government-backed secure investment",
                    holdingPeriod="3-5 years",
                    risk="Low",
                    color=self.color_palette["nyanza"]
                )
            ]
            risk_breakdown = RiskBreakdown(high=0, medium=20, low=80)
            
        else:
            # MODERATE: Balanced approach  
            options = [
                InvestmentOption(
                    type="Balanced Mutual Funds",
                    name="Diversified Portfolio Fund",
                    amount=int(monthly_investment * 0.50),
                    percentage=50,
                    reason="Balanced growth with moderate risk",
                    holdingPeriod="3-5 years",
                    risk="Medium",
                    color=self.color_palette["primary"]
                ),
                InvestmentOption(
                    type="Index Funds",
                    name="Market Index Fund", 
                    amount=int(monthly_investment * 0.30),
                    percentage=30,
                    reason="Broad market exposure for steady growth",
                    holdingPeriod="3-5 years",
                    risk="Medium",
                    color=self.color_palette["secondary"]
                ),
                InvestmentOption(
                    type="Fixed Deposits",
                    name="Stable Income Fund",
                    amount=int(monthly_investment * 0.20),
                    percentage=20,
                    reason="Stable returns for risk management",
                    holdingPeriod="1-2 years",
                    risk="Low",
                    color=self.color_palette["success"]
                )
            ]
            risk_breakdown = RiskBreakdown(high=20, medium=50, low=30)
        
        # Determine timeline and expected return based on goal and risk
        if "emergency" in goal.lower():
            timeline = "1-2 years"
            expected_return = "4-6%"
        elif "retirement" in goal.lower():
            timeline = "10+ years"
            expected_return = "8-12%" if "high" in risk_lower else "6-10%"
        elif "house" in goal.lower():
            timeline = "3-7 years"
            expected_return = "6-9%"
        else:
            timeline = "3-5 years"
            expected_return = "7-11%"
        
        # Create recommendations based on profile
        recommendations = [
            "Review and rebalance portfolio every 6 months",
            "Consider increasing investment amount by 10% annually",
            "Monitor performance and adjust strategy as needed"
        ]
        
        if "emergency" in goal.lower():
            recommendations.append("Maintain easy access to funds for emergencies")
        elif "retirement" in goal.lower():
            recommendations.append("Start retirement planning early for compound growth")
        elif "house" in goal.lower():
            recommendations.append("Consider separate savings for down payment")
        
        return InvestmentPlan(
            totalAmount=monthly_investment,
            monthlyInvestment=monthly_investment,
            options=options,
            riskBreakdown=risk_breakdown,
            timeline=timeline,
            expectedReturn=expected_return,
            recommendations=recommendations,
            planId=plan_id,
            createdAt=datetime.now().isoformat()
        )

# Global instance
investment_plan_service = InvestmentPlanService()
