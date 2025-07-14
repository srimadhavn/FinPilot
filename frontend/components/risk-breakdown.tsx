"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RiskBreakdownProps {
  riskBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

export function RiskBreakdown({ riskBreakdown }: RiskBreakdownProps) {
  const total = riskBreakdown.high + riskBreakdown.medium + riskBreakdown.low;
  
  // Calculate percentages
  const highPercent = Math.round((riskBreakdown.high / total) * 100);
  const mediumPercent = Math.round((riskBreakdown.medium / total) * 100);
  const lowPercent = Math.round((riskBreakdown.low / total) * 100);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Risk Breakdown</CardTitle>
        <CardDescription>
          Understanding your risk exposure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#2F4858" }}></span>
              High Risk
            </span>
            <span className="text-sm text-muted-foreground">{highPercent}%</span>
          </div>
          <Progress value={highPercent} className="h-2 bg-muted" />
          {highPercent > 40 && (
            <p className="text-xs text-muted-foreground">
              High risk investments have potential for greater returns but more volatility.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#86BBD8" }}></span>
              Medium Risk
            </span>
            <span className="text-sm text-muted-foreground">{mediumPercent}%</span>
          </div>
          <Progress value={mediumPercent} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#9EE493" }}></span>
              Low Risk
            </span>
            <span className="text-sm text-muted-foreground">{lowPercent}%</span>
          </div>
          <Progress value={lowPercent} className="h-2" />
          {lowPercent > 40 && (
            <p className="text-xs text-muted-foreground">
              Low risk investments offer stability and protect your principal investment.
            </p>
          )}
        </div>

        <div className="p-3 border rounded-lg bg-muted/50 mt-4">
          <h4 className="text-sm font-medium mb-1">Risk Profile</h4>
          <p className="text-sm text-muted-foreground">
            {highPercent > 50 
              ? "Your portfolio is aggressive with high growth potential and volatility." 
              : lowPercent > 50 
                ? "Your portfolio is conservative, focusing on stability and income." 
                : "Your portfolio is balanced between growth and stability."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
