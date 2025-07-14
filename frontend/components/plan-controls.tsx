"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DownloadCloud,
  Share2,
  Save,
  RefreshCw,
  CheckCircle,
  Loader2
} from "lucide-react"

interface PlanControlsProps {
  onSavePlan: () => Promise<void>;
  onRegeneratePlan: (feedback?: string) => Promise<void>;
  isSaving: boolean;
  isRegenerating: boolean;
}

export function PlanControls({
  onSavePlan,
  onRegeneratePlan,
  isSaving,
  isRegenerating
}: PlanControlsProps) {
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRegeneratePlan = async () => {
    await onRegeneratePlan(feedback);
    setFeedback("");
    setIsDialogOpen(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Investment Plan</CardTitle>
        <CardDescription>Review and manage your personalized plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            disabled
          >
            <DownloadCloud size={16} /> Export as PDF
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            disabled
          >
            <Share2 size={16} /> Share Plan
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-primary/30 hover:border-primary"
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Adjust & Regenerate Plan
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Your Investment Plan</DialogTitle>
              <DialogDescription>
                Tell us what you'd like to change about your current plan, and we'll create a new version.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="For example: 'Make it safer', 'I want more growth potential', 'More details on crypto', etc."
              className="min-h-[100px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRegeneratePlan} disabled={isRegenerating}>
                {isRegenerating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="mr-2" /> Regenerate Plan
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full text-lg py-6 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#336699] to-[#86BBD8] hover:from-[#2F4858] hover:to-[#336699]"
          size="lg"
          onClick={onSavePlan}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" /> Saving Plan...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" /> Save My Investment Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
