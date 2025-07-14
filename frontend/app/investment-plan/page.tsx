"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, RefreshCw, Download, Share2, TrendingUp, Target, DollarSign, Shield, Brain, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

interface InvestmentOption {
  name: string
  allocation: number
  amount: number
  risk: string
  expectedReturn: string
  description: string
  color: string
}

interface RiskBreakdown {
  low: number
  medium: number
  high: number
}

interface InvestmentPlan {
  totalAmount: number
  monthlyInvestment: number
  options: InvestmentOption[]
  riskBreakdown: RiskBreakdown
  timeline: string
  expectedReturn: string
  recommendations: string[]
}

interface UserProfile {
  monthly_investment: string
  preference: string
  risk_tolerance: string
  goal: string
}

export default function InvestmentPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = searchParams.get('profileId')
  
  const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (profileId) {
      generateInitialPlan()
    } else {
      // If no profile ID, redirect back to advisor
      router.push('/advisor')
    }
  }, [profileId])

  const generateInitialPlan = async () => {
    setIsLoading(true)
    try {
      // Mock profile data for now - in real implementation, fetch from backend
      const mockProfile = {
        monthly_investment: "$1000",
        preference: "Moderate growth",
        risk_tolerance: "Medium risk",
        goal: "Retirement planning"
      }
      setUserProfile(mockProfile)
      
      const response = await fetch('http://localhost:8000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId,
          profileData: mockProfile
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate investment plan')
      }

      const data = await response.json()
      // Ensure monthlyInvestment is a number
      const planData = data.plan
      if (planData && typeof planData.monthlyInvestment === 'string') {
        // Extract number from string like "$1000 per month"
        const match = planData.monthlyInvestment.match(/\d+/)
        planData.monthlyInvestment = match ? parseInt(match[0]) : 0
      }
      setInvestmentPlan(planData)
    } catch (error) {
      console.error('Error generating plan:', error)
      // Fallback to mock data for development
      setInvestmentPlan(getMockPlan())
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegeneratePlan = async () => {
    if (!userProfile) return
    
    setIsRegenerating(true)
    try {
      const response = await fetch('http://localhost:8000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId,
          profileData: userProfile,
          feedback: feedback
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate investment plan')
      }

      const data = await response.json()
      // Ensure monthlyInvestment is a number
      const planData = data.plan
      if (planData && typeof planData.monthlyInvestment === 'string') {
        // Extract number from string like "$1000 per month"
        const match = planData.monthlyInvestment.match(/\d+/)
        planData.monthlyInvestment = match ? parseInt(match[0]) : 0
      }
      setInvestmentPlan(planData)
      setFeedback('')
      setShowFeedback(false)
    } catch (error) {
      console.error('Error regenerating plan:', error)
      // Fallback to mock data for development
      setInvestmentPlan(getMockPlan())
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleSavePlan = async () => {
    if (!investmentPlan || !profileId) return
    
    setIsSaving(true)
    try {
      const response = await fetch('http://localhost:8000/api/save-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId,
          plan: investmentPlan
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save investment plan')
      }

      const data = await response.json()
      console.log('Plan saved successfully:', data)
      // Could show success message here
    } catch (error) {
      console.error('Error saving plan:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getMockPlan = (): InvestmentPlan => ({
    totalAmount: 12000,
    monthlyInvestment: 1000,
    options: [
      {
        name: "Large Cap Equity Funds",
        allocation: 40,
        amount: 4800,
        risk: "Medium",
        expectedReturn: "12-15%",
        description: "Diversified portfolio of large-cap stocks for stable growth",
        color: "#336699"
      },
      {
        name: "Mid & Small Cap Funds",
        allocation: 25,
        amount: 3000,
        risk: "High",
        expectedReturn: "15-18%",
        description: "Higher growth potential with increased volatility",
        color: "#86BBD8"
      },
      {
        name: "Debt Funds",
        allocation: 20,
        amount: 2400,
        risk: "Low",
        expectedReturn: "7-9%",
        description: "Fixed income securities for stability and regular income",
        color: "#9EE493"
      },
      {
        name: "International Funds",
        allocation: 15,
        amount: 1800,
        risk: "Medium",
        expectedReturn: "10-12%",
        description: "Global diversification with international markets exposure",
        color: "#6B8CAE"
      }
    ],
    riskBreakdown: {
      low: 20,
      medium: 55,
      high: 25
    },
    timeline: "5-7 years",
    expectedReturn: "11-14%",
    recommendations: [
      "Review and rebalance portfolio every 6 months",
      "Consider increasing SIP amount by 10% annually",
      "Monitor international fund performance closely",
      "Maintain emergency fund of 6 months expenses"
    ]
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Generating your personalized investment plan...</p>
        </div>
      </div>
    )
  }

  if (!investmentPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to generate investment plan</p>
          <Button onClick={generateInitialPlan} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/advisor" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Back to Advisor</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #336699 0%, #86BBD8 100%)" }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#2F4858" }}>Investment Plan</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#2F4858" }}>
            Your Personalized Investment Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered investment strategy tailored to your financial goals and risk tolerance
          </p>
        </div>

        {/* Plan Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Monthly Investment</h3>
            <p className="text-3xl font-bold text-primary">
              ${investmentPlan.monthlyInvestment?.toLocaleString() || '0'}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expected Returns</h3>
            <p className="text-3xl font-bold text-green-600">
              {investmentPlan.expectedReturn}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <p className="text-3xl font-bold text-blue-600">
              {investmentPlan.timeline}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
            <div className="flex justify-center gap-1">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {investmentPlan.riskBreakdown.low}% Low
              </Badge>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Allocation */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                Investment Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                {investmentPlan.options.map((option, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{option.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {option.allocation}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${option.amount?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={option.risk === 'High' ? 'destructive' : option.risk === 'Medium' ? 'default' : 'secondary'}
                        >
                          {option.risk} Risk
                        </Badge>
                        <span className="text-sm text-green-600 font-medium">
                          {option.expectedReturn} returns
                        </span>
                      </div>
                      <Progress value={option.allocation} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {investmentPlan.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button
            onClick={() => setShowFeedback(!showFeedback)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Plan
          </Button>
          
          <Button
            onClick={handleSavePlan}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#336699] to-[#86BBD8] hover:from-[#2F4858] hover:to-[#336699]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Save Plan
              </>
            )}
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Plan
          </Button>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <Card className="mt-8 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold">Provide Feedback for Regeneration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Tell us what you'd like to change about your investment plan
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., I want more conservative investments, or I'd like to increase my equity allocation..."
                className="mb-4"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleRegeneratePlan}
                  disabled={isRegenerating || !feedback.trim()}
                  className="flex items-center gap-2"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Regenerate with Feedback
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFeedback(false)
                    setFeedback('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
