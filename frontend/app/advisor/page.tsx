"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, ArrowLeft, CheckCircle, Loader2, Send, MoveUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { AnimatedSection } from "@/components/animated-section"
import { cn } from "@/lib/utils"

interface UserAnswers {
  monthly_investment?: string
  preference?: string
  risk_tolerance?: string
  goal?: string
  age?: string
  income?: string
  experience?: string
  time_horizon?: string
}

interface ChatMessage {
  role: "ai" | "user"
  message: string
  timestamp: number
}

export default function FinPilotOnboarding() {
  const router = useRouter()
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [answers, setAnswers] = useState<UserAnswers>({})
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessingOption, setIsProcessingOption] = useState(false)
  
  // Natural conversation input
  const [customInput, setCustomInput] = useState("")
  
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [showPlanSection, setShowPlanSection] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef<string | null>(null)
  const isRequestPendingRef = useRef(false)
  const saveControllerRef = useRef<AbortController | null>(null)
  const optionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function to cancel pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (saveControllerRef.current) {
        saveControllerRef.current.abort()
      }
      if (optionTimeoutRef.current) {
        clearTimeout(optionTimeoutRef.current)
      }
    }
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, isTyping])

  // Start the conversation only once
  useEffect(() => {
    if (!isInitialized && !isInitializing && !isRequestPendingRef.current) {
      setIsInitializing(true)
      setIsInitialized(true)
      
      // Add a small delay to ensure component is fully mounted
      setTimeout(() => {
        getNextQuestion([], {})
        setIsInitializing(false)
      }, 100)
    }
  }, [isInitialized, isInitializing])

  const getNextQuestion = async (updatedChatHistory?: ChatMessage[], updatedAnswers?: UserAnswers) => {
    // Prevent multiple simultaneous calls
    if (isTyping || isRequestPendingRef.current) {
      console.log("Skipping duplicate request - already in progress")
      return
    }
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    isRequestPendingRef.current = true
    
    // Generate unique request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    requestIdRef.current = requestId
    
    setIsTyping(true)

    try {
      const response = await fetch("http://localhost:8000/api/next-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatHistory: updatedChatHistory || chatHistory,
          answers: updatedAnswers || answers,
          requestId: requestId, // Add request ID for backend tracking
        }),
        signal: abortControllerRef.current.signal,
      })

      // Check if this request is still the current one
      if (requestIdRef.current !== requestId) {
        console.log("Request outdated, ignoring response")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to get next question")
      }

      const data = await response.json()
      
      // Double-check request is still current before updating state
      if (requestIdRef.current === requestId) {
        // Simulate typing delay
        setTimeout(() => {
          // Final check before state update
          if (requestIdRef.current === requestId) {
            setChatHistory((prev) => [
              ...prev,
              {
                role: "ai",
                message: data.message,
                timestamp: Date.now(),
              },
            ])
            
            // Update answers with extracted profile information
            if (data.updatedAnswers) {
              setAnswers(data.updatedAnswers)
              console.log("✅ Profile updated:", data.updatedAnswers)
            }
            
            setIsTyping(false)
            
            if (data.isComplete) {
              setIsComplete(true)
            }
          }
        }, 1500)
      }

    } catch (error) {
      // Only handle error if request wasn't aborted and is still current
      if (requestIdRef.current === requestId && !abortControllerRef.current?.signal.aborted) {
        console.error("Error getting next question:", error)
        setIsTyping(false)
        setChatHistory((prev) => [
          ...prev,
          {
            role: "ai",
            message: "I'm sorry, I'm having trouble connecting right now. Please try again.",
            timestamp: Date.now(),
          },
        ])
      }
    } finally {
      // Clean up request tracking
      if (requestIdRef.current === requestId) {
        isRequestPendingRef.current = false
        abortControllerRef.current = null
      }
    }
  }

  const handleOptionSelect = (option: string) => {
    // Prevent rapid-fire option selections
    if (isProcessingOption || isTyping) {
      console.log("Option selection in progress, skipping")
      return
    }

    // Skip "Talk to AI" for now - just use predefined options
    if (option === "💬 Talk to AI") {
      return
    }

    // Set processing state and debounce
    setIsProcessingOption(true)
    
    // Clear any existing timeout
    if (optionTimeoutRef.current) {
      clearTimeout(optionTimeoutRef.current)
    }

    // Debounce the actual processing
    optionTimeoutRef.current = setTimeout(() => {
      handleUserResponse(option)
      setIsProcessingOption(false)
    }, 300) // 300ms debounce
  }

  const handleCustomInputSubmit = () => {
    if (customInput.trim() && !isProcessingOption && !isTyping) {
      setIsProcessingOption(true)
      const inputValue = customInput.trim()
      setCustomInput("")
      
      // Clear any existing timeout
      if (optionTimeoutRef.current) {
        clearTimeout(optionTimeoutRef.current)
      }

      // Debounce the actual processing
      optionTimeoutRef.current = setTimeout(() => {
        handleUserResponse(inputValue)
        setIsProcessingOption(false)
      }, 300)
    }
  }

  const handleCustomInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCustomInputSubmit()
    }
  }

  const handleUserResponse = async (userMessage: string) => {
    // Add user message to chat
    const newChatHistory = [
      ...chatHistory,
      {
        role: "user" as const,
        message: userMessage,
        timestamp: Date.now(),
      },
    ]

    setChatHistory(newChatHistory)

    // Get next question - AI will extract and update profile info automatically
    await getNextQuestion(newChatHistory, answers)
  }

  const handleSaveProfile = async () => {
    // Prevent duplicate save requests
    if (isSaving) {
      console.log("Save already in progress, skipping duplicate request")
      return
    }

    // Cancel any existing save request
    if (saveControllerRef.current) {
      saveControllerRef.current.abort()
    }

    // Create new abort controller for this save request
    saveControllerRef.current = new AbortController()
    setIsSaving(true)

    try {
      const response = await fetch("http://localhost:8000/api/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyInvestment: answers.monthly_investment,
          investmentPreference: answers.preference,
          riskTolerance: answers.risk_tolerance,
          goal: answers.goal,
        }),
        signal: saveControllerRef.current.signal,
      })

      if (response.ok) {
        const result = await response.json();
        setCurrentProfileId(result.profileId);
        
        setChatHistory(prev => [
          ...prev,
          {
            role: "ai",
            message: "🎉 Congratulations! Your investment profile has been created successfully. Redirecting to your personalized investment plan...",
            timestamp: Date.now(),
          },
        ])
        
        // Redirect to investment plan page after a short delay
        setTimeout(() => {
          router.push(`/investment-plan?profileId=${result.profileId}`)
        }, 2000);
      } else {
        console.error("Failed to save profile")
        setChatHistory(prev => [
          ...prev,
          {
            role: "ai",
            message: "❌ Sorry, there was an error saving your profile. Please try again.",
            timestamp: Date.now(),
          },
        ])
      }
    } catch (error) {
      // Only handle error if request wasn't aborted
      if (!saveControllerRef.current?.signal.aborted) {
        console.error("Error saving profile:", error)
        setChatHistory(prev => [
          ...prev,
          {
            role: "ai",
            message: "❌ Sorry, there was an error saving your profile. Please try again.",
            timestamp: Date.now(),
          },
        ])
      }
    } finally {
      setIsSaving(false)
      saveControllerRef.current = null
    }
  }
  
  // Calculate progress based on filled answers
  const totalQuestions = 4
  const answeredQuestions = Object.values(answers).filter(Boolean).length
  const progress = (answeredQuestions / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #336699 0%, #86BBD8 100%)" }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#2F4858" }}>FinPilot Advisor</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Summary */}
          <AnimatedSection className="lg:col-span-1" delay={100}>
            <Card className="p-6 sticky top-28 shadow-lg border rounded-xl overflow-hidden">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
                <div className="h-1 w-16 rounded-full" style={{ background: "linear-gradient(90deg, #336699 0%, #86BBD8 50%, #9EE493 100%)" }}></div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{answeredQuestions} of {totalQuestions} questions answered</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={cn(
                      "h-2 rounded-full",
                      progress === 100 ? "bg-gradient-to-r from-green-400/20 to-primary/20" : ""
                    )}
                  />
                </div>

                {/* Profile Details */}
                <div className="space-y-5">
                  <ProfileDetail label="Monthly Investment" value={answers.monthly_investment} />
                  <ProfileDetail label="Investment Preference" value={answers.preference} />
                  <ProfileDetail label="Risk Tolerance" value={answers.risk_tolerance} />
                  <ProfileDetail label="Investment Goal" value={answers.goal} />
                </div>

                {/* Save Profile Button */}
                {isComplete && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full mt-8 text-lg py-6 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#336699] to-[#86BBD8] hover:from-[#2F4858] hover:to-[#336699]"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Your Profile...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Generate Investment Plan
                        <MoveUpRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Center - Chat Interface */}
          <AnimatedSection className="lg:col-span-2" delay={200}>
            <div className="space-y-8">
              {/* Chat Interface */}
              <Card className={cn(
                "flex flex-col shadow-lg border rounded-xl overflow-hidden transition-all duration-500",
                "h-[70vh]"
              )}>
                {/* Chat Header */}
                <div className="border-b p-4" style={{ background: "linear-gradient(135deg, #DAF7DC 0%, #F8FDFF 100%)" }}>
                  <h2 className="text-lg font-semibold flex items-center" style={{ color: "#2F4858" }}>
                    <Brain className="w-5 h-5 mr-2" style={{ color: "#336699" }} />
                    Investment Planning Chat
                  </h2>
                  <p className="text-sm" style={{ color: "#2F4858" }}>Let's build your personalized investment plan.</p>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6"
                >
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      style={{
                        opacity: 0,
                        animation: `fadeSlideIn 0.4s ease-out ${index * 0.1}s forwards`,
                      }}
                    >
                      {message.role === 'ai' && (
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm">
                          <Brain className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm">
                          <Send className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-end gap-3 justify-start animate-fadeIn">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl px-5 py-3 shadow-sm rounded-bl-none">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Natural Text Input - Always visible for conversation */}
                {!isComplete && (
                  <div className="border-t p-5 bg-background/50 backdrop-blur-sm">
                    <div className="flex gap-2">
                      <Input
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyPress={handleCustomInputKeyPress}
                        placeholder="Type your response here..."
                        disabled={isProcessingOption || isTyping}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        onClick={handleCustomInputSubmit}
                        disabled={!customInput.trim() || isProcessingOption || isTyping}
                        size="sm"
                        className="px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </main>
    </div>
  )
}

const ProfileDetail = ({ label, value }: { label: string, value?: string }) => (
  <div className="p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-border">
    <label className="text-sm font-medium text-muted-foreground block mb-1">{label}</label>
    {value ? (
       <p className="text-lg font-semibold text-foreground">{value}</p>
    ) : (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-pulse"></div>
        <p className="text-sm text-muted-foreground/70 italic">Not answered yet</p>
      </div>
    )}
  </div>
)
