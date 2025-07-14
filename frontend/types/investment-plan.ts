export interface InvestmentOption {
  type: string;          // Investment type (Stocks, Index Funds, etc.)
  name: string;          // Specific investment name
  amount: number;        
  percentage: number;    
  reason: string;        // Beginner-friendly explanation
  holdingPeriod: string; 
  risk: "High" | "Medium" | "Low"; // Risk level
  color?: string;      
}

export interface InvestmentPlan {
  totalAmount: number;
  options: InvestmentOption[];
  riskBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  planId?: string;
  createdAt: string;
}
