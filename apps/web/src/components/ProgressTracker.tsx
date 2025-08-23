"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressTracker({ currentStep, totalSteps, steps }: ProgressTrackerProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>
        
        <div className="space-y-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={step}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isCurrent ? "bg-primary/10" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNumber}
                </div>
                <span
                  className={`text-sm ${
                    isCurrent ? "font-medium" : isCompleted ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
