import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"; // For visual step indication
// Example: Import specific form field components if needed (Input, Select, etc.)
// Example: Import icons for steps

interface KYCStep {
  id: string;
  title: string;
  content: React.ReactNode; // Content for this step (e.g., a form section)
  // Optional: validation function for this step
  // isValid?: () => boolean; 
}

interface KYCStepperProps {
  steps: KYCStep[];
  onComplete: (formData: Record<string, any>) => void; // Called when all steps are done
}

const KYCStepper: React.FC<KYCStepperProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  console.log("Rendering KYCStepper, current step:", currentStep + 1, "of", steps.length);

  const handleNext = () => {
    // Here you would typically validate the current step's form data
    // For this example, we'll just proceed
    // const currentStepData = ... extract data from current step's form elements
    // setFormData(prev => ({ ...prev, ...currentStepData }));

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log("KYC process completed. Final data:", formData);
      onComplete(formData); // Call onComplete with all collected data
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const ActiveStepComponent = steps[currentStep];

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>KYC Verification - Step {currentStep + 1} of {steps.length}</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">{ActiveStepComponent.title}</p>
        <Progress value={progressPercentage} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="py-6 min-h-[200px]">
        {/* Render the content of the current step */}
        {/* This should ideally be a component that can manage its own form state */}
        {/* and provide data back to the stepper */}
        {ActiveStepComponent.content || <p>Content for {ActiveStepComponent.title} goes here.</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Complete KYC' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Example usage (would be defined in the page using KYCStepper):
/*
const kycStepsExample: KYCStep[] = [
  { id: 'personal', title: 'Personal Information', content: <div>Form for personal info...</div> },
  { id: 'document', title: 'Document Upload', content: <div>Form for document upload...</div> },
  { id: 'review', title: 'Review & Submit', content: <div>Summary of information...</div> },
];

// <KYCStepper steps={kycStepsExample} onComplete={(data) => console.log('KYC Data:', data)} />
*/

export default KYCStepper;