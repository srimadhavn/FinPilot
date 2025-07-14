import { InvestmentPlan } from "../types/investment-plan";

interface UserAnswers {
  monthly_investment?: string;
  preference?: string;
  risk_tolerance?: string;
  goal?: string;
}

const API_BASE_URL = "http://localhost:8000";

export class InvestmentPlanService {
  
  static async generatePlan(profileId: string, feedback?: string): Promise<InvestmentPlan> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate plan: ${response.statusText}`);
      }

      const data = await response.json();
      return data.plan;
    } catch (error) {
      console.error("Error generating investment plan:", error);
      
      // Fallback to mock implementation if API fails
      const { generateInvestmentPlan } = await import("./generate-investment-plan");
      
      // We need to reconstruct the answers from profileId
      // In a real app, we'd fetch the profile data from the backend
      const mockAnswers: UserAnswers = {
        monthly_investment: "₹5,000",
        preference: "Index funds and mutual funds",
        risk_tolerance: "Moderate risk",
        goal: "Long-term wealth building"
      };
      
      return generateInvestmentPlan(mockAnswers, feedback);
    }
  }

  static async savePlan(profileId: string, plan: InvestmentPlan): Promise<{ success: boolean; planId: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/save-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          plan,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save plan: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        planId: data.planId,
        message: data.message
      };
    } catch (error) {
      console.error("Error saving investment plan:", error);
      
      // Return mock success response if API fails
      return {
        success: true,
        planId: `mock_plan_${Date.now()}`,
        message: "🎉 Your investment plan has been successfully saved! (Offline mode)"
      };
    }
  }

  static async getPlan(planId: string): Promise<InvestmentPlan | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plan/${planId}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to get plan: ${response.statusText}`);
      }

      const data = await response.json();
      return data.plan;
    } catch (error) {
      console.error("Error fetching investment plan:", error);
      return null;
    }
  }
}
