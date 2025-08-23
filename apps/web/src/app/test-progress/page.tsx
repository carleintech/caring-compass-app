"use client";

import { useState } from "react";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testSteps = [
  "Personal Information",
  "Medical History",
  "Current Symptoms",
  "Lifestyle Assessment",
  "Mental Health Screening",
  "Final Review"
];

export default function TestProgressPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < testSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Progress Tracker Demo</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ProgressTracker
            currentStep={currentStep}
            totalSteps={testSteps.length}
            steps={testSteps}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Step Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg font-medium">
                Step {currentStep}: {testSteps[currentStep - 1]}
              </p>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  This is where the actual content for {testSteps[currentStep - 1]} would appear.
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm">
                    Example content area for step {currentStep}...
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={currentStep === testSteps.length}
                >
                  Next
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="secondary"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• The progress tracker shows the current step and overall progress</li>
              <li>• Completed steps are marked with a checkmark</li>
              <li>• The current step is highlighted in blue</li>
              <li>• Use the navigation buttons to move between steps</li>
              <li>• The progress bar updates automatically based on the current step</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
