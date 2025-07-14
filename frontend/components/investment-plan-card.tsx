"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestmentOption } from "@/types/investment-plan"
import { AnimatedSection } from "@/components/animated-section"
import { cn } from "@/lib/utils"

interface InvestmentPlanCardProps {
  option: InvestmentOption;
  index: number;
}

export function InvestmentPlanCard({ option, index }: InvestmentPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "border-[#2F4858]/30 text-[#2F4858] bg-[#2F4858]/5";
      case "Medium": return "border-[#86BBD8]/50 text-[#336699] bg-[#86BBD8]/10";
      case "Low": return "border-[#9EE493]/50 text-[#2F4858] bg-[#9EE493]/15";
      default: return "";
    }
  };

  return (
    <AnimatedSection delay={index * 100}>
      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "shadow-md" : "shadow-sm"
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {option.name}
              </CardTitle>
              <CardDescription>{option.type}</CardDescription>
            </div>
            <Badge className={cn("ml-2", getRiskColor(option.risk))}>
              {option.risk} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Investment</p>
              <p className="text-2xl font-bold">₹{option.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Holding Period</p>
              <p className="text-lg font-medium">{option.holdingPeriod}</p>
            </div>
          </div>
          
          <div className={cn(
            "overflow-hidden transition-all duration-300 space-y-3",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="p-3 bg-muted/40 rounded-lg">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                <AlertCircle size={14} />
                Why This Investment?
              </h4>
              <p className="text-sm text-muted-foreground">{option.reason}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-center text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                Learn More <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </AnimatedSection>
  );
}
