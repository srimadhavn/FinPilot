"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Brain,
  Shield,
  Target,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  MoveUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { AnimatedSection } from "@/components/animated-section"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #336699 0%, #86BBD8 100%)" }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "#2F4858" }}>FinPilot</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/#features">Features</Link>
              </Button>
              <Button asChild className="rounded-xl shadow-md">
                <Link href="/advisor">
                  Start Planning <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Add top padding to account for fixed nav */}
      <div className="pt-20">
        {/* Hero Section */}
        <AnimatedSection className="relative overflow-hidden">
          <div className="container mx-auto px-6 py-24 lg:py-32">
            <div
              className="text-center max-w-4xl mx-auto"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg" style={{ background: "linear-gradient(135deg, #336699 0%, #86BBD8 100%)" }}>
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight">
                Your AI Co-Pilot for
                <span className="gradient-text"> Smarter Investing</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
                Navigate your financial future with personalized, intelligent advice. Let FinPilot guide you to smarter
                investment decisions tailored to your goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" asChild className="rounded-xl shadow-md group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Link href="/advisor">
                    Start Your Free Plan
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="rounded-xl">
                  <Link href="#how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements with parallax */}
          <div 
            className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          ></div>
          <div 
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
        </AnimatedSection>

        {/* Problem & Solution Section */}
        <AnimatedSection id="how-it-works" className="py-20" delay={100}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                Investing Doesn't Have to Be Complicated
              </h2>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="text-left bg-card border rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-destructive">The Problem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 text-lg text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-3 flex-shrink-0"></div>
                        <span>Overwhelming and confusing investment options</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-3 flex-shrink-0"></div>
                        <span>Uncertainty about risk and suitable investments</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-3 flex-shrink-0"></div>
                        <span>Lack of time for research and management</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-left bg-card border rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">The Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground mb-4">
                      FinPilot uses advanced AI to simplify investing by providing:
                    </p>
                    <ul className="space-y-3 text-lg">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span>Personalized investment recommendations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span>Clear risk assessment and guidance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span>Goal-oriented investment planning</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Key Features Section */}
        <AnimatedSection id="features" className="py-20" delay={200}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why Choose FinPilot?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of investing with AI-powered features designed for your success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Brain className="w-8 h-8 text-primary" />}
                title="Personalized Advice"
                description="AI-driven recommendations tailored to your unique financial situation and goals."
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-primary" />}
                title="Risk Assessment"
                description="Understand your comfort level and get investments that match your risk tolerance."
              />
              <FeatureCard
                icon={<Target className="w-8 h-8 text-primary" />}
                title="Goal-Oriented Planning"
                description="Align your investments with your dreams - whether it's travel, retirement, or freedom."
              />
              <FeatureCard
                icon={<MessageCircle className="w-8 h-8 text-primary" />}
                title="Effortless Onboarding"
                description="Get started in minutes with our friendly chat-based questionnaire."
              />
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection className="py-20 bg-secondary/50" delay={300}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">How FinPilot Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get personalized investment advice in three simple steps.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <HowItWorksStep
                  step="1"
                  icon={<MessageCircle className="w-8 h-8 text-primary" />}
                  title="Answer Questions"
                  description="Chat with our AI to share your investment goals, risk tolerance, and financial situation."
                />
                <HowItWorksStep
                  step="2"
                  icon={<Brain className="w-8 h-8 text-primary" />}
                  title="Get Recommendations"
                  description="Receive personalized investment recommendations powered by advanced AI analysis."
                />
                <HowItWorksStep
                  step="3"
                  icon={<TrendingUp className="w-8 h-8 text-primary" />}
                  title="Start Investing"
                  description="Begin your investment journey with confidence, backed by AI-powered insights."
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection className="py-20" delay={400}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied investors who trust FinPilot.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <TestimonialCard
                quote="FinPilot completely transformed how I think about investing. The AI recommendations were spot-on for my risk tolerance, and I finally feel confident about my financial future!"
                author="Sarah Johnson"
                role="Marketing Manager"
              />
              <TestimonialCard
                quote="As a beginner investor, I was overwhelmed by all the options. FinPilot made it simple and personalized. The chat interface felt like talking to a knowledgeable friend!"
                author="Michael Chen"
                role="Software Developer"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Final CTA Section */}
        <AnimatedSection className="py-20 bg-primary/5" delay={500}>
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Transform Your Financial Future?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Join thousands of smart investors who trust FinPilot for personalized, AI-powered investment advice. Start
                your journey today - it's free!
              </p>

              <Button size="lg" asChild className="rounded-xl shadow-md group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-lg">
                <Link href="/advisor">
                  <Zap className="w-6 h-6 mr-3" />
                  Start Your Journey with FinPilot
                  <MoveUpRight className="w-6 h-6 ml-3 group-hover:rotate-45 transition-transform" />
                </Link>
              </Button>

              <p className="text-sm text-muted-foreground mt-6">No credit card required • Free to start • Secure & private</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <footer className="bg-card text-card-foreground border-t">
          <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-bold">FinPilot</span>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Your AI-powered investment advisor, making smart investing accessible to everyone.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 FinPilot. All rights reserved. Built with AI for smarter investing.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50 rounded-xl shadow-lg">
    <CardHeader>
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ step, icon, title, description }: { step: string, icon: React.ReactNode, title: string, description: string }) => (
  <div className="text-center relative">
    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
      {step}
    </div>
    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/20">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl shadow-lg">
    <CardHeader>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-muted-foreground">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
