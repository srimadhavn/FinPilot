import { InvestmentPlan } from "../types/investment-plan";

interface UserAnswers {
  monthly_investment?: string;
  preference?: string;
  risk_tolerance?: string;
  goal?: string;
}

export async function generateInvestmentPlan(
  answers: UserAnswers,
  feedback?: string
): Promise<InvestmentPlan> {
  // This would normally be an API call to the backend
  // For now, we'll mock the response based on user answers
  
  const monthlyInvestment = parseInt(answers.monthly_investment?.replace(/[^\d]/g, '') || "5000");
  const riskTolerance = answers.risk_tolerance?.toLowerCase() || "";
  const preference = answers.preference?.toLowerCase() || "";
  const goal = answers.goal?.toLowerCase() || "";

  // Determine risk profile
  let highRisk = 0.2;
  let mediumRisk = 0.5;
  let lowRisk = 0.3;

  // Adjust based on risk tolerance
  if (riskTolerance.includes("aggressive") || riskTolerance.includes("high")) {
    highRisk = 0.5;
    mediumRisk = 0.3;
    lowRisk = 0.2;
  } else if (riskTolerance.includes("conservative") || riskTolerance.includes("low")) {
    highRisk = 0.1;
    mediumRisk = 0.3;
    lowRisk = 0.6;
  }

  // Apply feedback modifications if provided
  if (feedback) {
    if (feedback.toLowerCase().includes("safer") || feedback.toLowerCase().includes("less risk")) {
      highRisk = Math.max(0.05, highRisk - 0.2);
      lowRisk = Math.min(0.8, lowRisk + 0.2);
    } else if (feedback.toLowerCase().includes("growth") || feedback.toLowerCase().includes("more risk")) {
      highRisk = Math.min(0.7, highRisk + 0.2);
      lowRisk = Math.max(0.1, lowRisk - 0.2);
    }
  }

  // Normalize percentages
  const total = highRisk + mediumRisk + lowRisk;
  highRisk = highRisk / total;
  mediumRisk = mediumRisk / total;
  lowRisk = lowRisk / total;

  // Create the investment options
  const options = [];
  
  // Low risk options
  if (lowRisk > 0) {
    const lowRiskAmount = Math.round(monthlyInvestment * lowRisk);
    
    // Split between different low risk options
    if (lowRiskAmount > 1000) {
      options.push({
        type: "Government Bonds",
        name: "National Savings Certificate",
        amount: Math.round(lowRiskAmount * 0.6),
        percentage: Math.round(lowRisk * 60),
        reason: "Government bonds offer guaranteed returns with virtually no risk. They're ideal for capital preservation.",
        holdingPeriod: "2+ years",
        risk: "Low" as const,
        color: "#9EE493" // Light green for safe investments
      });
      
      options.push({
        type: "Fixed Deposits",
        name: "Bank FD",
        amount: Math.round(lowRiskAmount * 0.4),
        percentage: Math.round(lowRisk * 40),
        reason: "Fixed deposits provide stable returns with guaranteed principal safety and are very liquid.",
        holdingPeriod: "1+ year",
        risk: "Low" as const,
        color: "#DAF7DC" // Nyanza for ultra-safe investments
      });
    } else {
      options.push({
        type: "Fixed Deposits",
        name: "Bank FD",
        amount: lowRiskAmount,
        percentage: Math.round(lowRisk * 100),
        reason: "Fixed deposits provide stable returns with guaranteed principal safety and are very liquid.",
        holdingPeriod: "1+ year",
        risk: "Low" as const,
        color: "#9EE493" // Light green for safe investments
      });
    }
  }
  
  // Medium risk options
  if (mediumRisk > 0) {
    const mediumRiskAmount = Math.round(monthlyInvestment * mediumRisk);
    
    options.push({
      type: "Index Funds",
      name: "Nifty 50 Index Fund",
      amount: Math.round(mediumRiskAmount * 0.7),
      percentage: Math.round(mediumRisk * 70),
      reason: "Index funds track market indices, offering moderate growth with lower fees than actively managed funds.",
      holdingPeriod: "3-5 years",
      risk: "Medium" as const,
      color: "#336699" // Lapis Lazuli for primary investments
    });
    
    if (preference.includes("mutual") || !preference.includes("stock")) {
      options.push({
        type: "Mutual Funds",
        name: "Large Cap Mutual Fund",
        amount: Math.round(mediumRiskAmount * 0.3),
        percentage: Math.round(mediumRisk * 30),
        reason: "Large-cap funds invest in established companies, offering a balance of growth and stability.",
        holdingPeriod: "3+ years",
        risk: "Medium" as const,
        color: "#86BBD8" // Carolina Blue for secondary investments
      });
    } else {
      options.push({
        type: "Blue-chip Stocks",
        name: "Large Cap Stocks",
        amount: Math.round(mediumRiskAmount * 0.3),
        percentage: Math.round(mediumRisk * 30),
        reason: "Blue-chip stocks are shares of well-established companies with stable earnings and dividends.",
        holdingPeriod: "3+ years",
        risk: "Medium" as const,
        color: "#86BBD8" // Carolina Blue for secondary investments
      });
    }
  }
  
  // High risk options
  if (highRisk > 0) {
    const highRiskAmount = Math.round(monthlyInvestment * highRisk);
    
    // If cryptocurrency is preferred or no specific preference
    if (preference.includes("crypto") || feedback?.toLowerCase().includes("crypto")) {
      options.push({
        type: "Cryptocurrency",
        name: "Bitcoin / Ethereum",
        amount: Math.round(highRiskAmount * 0.5),
        percentage: Math.round(highRisk * 50),
        reason: "Cryptocurrencies offer high growth potential but come with significant volatility and regulatory risks.",
        holdingPeriod: "1-3 years",
        risk: "High" as const,
        color: "#2F4858" // Charcoal for high-risk investments
      });
      
      options.push({
        type: "Small Cap Stocks",
        name: "Small Cap Growth Stocks",
        amount: Math.round(highRiskAmount * 0.5),
        percentage: Math.round(highRisk * 50),
        reason: "Small-cap stocks have higher growth potential but greater volatility than larger companies.",
        holdingPeriod: "3-5 years",
        risk: "High" as const,
        color: "#6B8CAE" // Mid-tone blue for growth investments
      });
    } else {
      options.push({
        type: "Small Cap Stocks",
        name: "Small Cap Growth Stocks",
        amount: Math.round(highRiskAmount * 0.7),
        percentage: Math.round(highRisk * 70),
        reason: "Small-cap stocks have higher growth potential but greater volatility than larger companies.",
        holdingPeriod: "3-5 years",
        risk: "High" as const,
        color: "#2F4858" // Charcoal for high-risk investments
      });
      
      options.push({
        type: "Sector-specific ETFs",
        name: "Technology Sector ETF",
        amount: Math.round(highRiskAmount * 0.3),
        percentage: Math.round(highRisk * 30),
        reason: "Sector ETFs focus on specific industries, offering targeted exposure with concentrated risk.",
        holdingPeriod: "2-4 years",
        risk: "High" as const,
        color: "#6B8CAE" // Mid-tone blue for specialized investments
      });
    }
  }
  
  // Normalize percentages to ensure they sum to 100%
  const totalPercentage = options.reduce((sum, option) => sum + option.percentage, 0);
  if (totalPercentage !== 100) {
    const factor = 100 / totalPercentage;
    options.forEach(option => {
      option.percentage = Math.round(option.percentage * factor);
    });
    
    // Ensure percentages sum to exactly 100
    const adjustedTotal = options.reduce((sum, option) => sum + option.percentage, 0);
    if (adjustedTotal !== 100) {
      options[0].percentage += (100 - adjustedTotal);
    }
  }
  
  // Create and return the investment plan
  return {
    totalAmount: monthlyInvestment,
    options,
    riskBreakdown: {
      high: Math.round(highRisk * 100),
      medium: Math.round(mediumRisk * 100),
      low: Math.round(lowRisk * 100),
    },
    createdAt: new Date().toISOString(),
  };
}
