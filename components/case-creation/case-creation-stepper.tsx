"use client";

import { useState } from "react";
import { DebtorChoiceStep } from "./debtor-choice-step";
import { DebtorCreationStep } from "./debtor-creation-step";
import { DebtorSelectionStep } from "./debtor-selection-step";
import { CaseCreationStep } from "./case-creation-step";
import { Card, CardContent } from "@/components/ui/card";
import type { DebtorFormData } from "@/lib/validations/debtor-schema";
import type { CaseFormData } from "@/lib/validations/case-schema";

interface Debtor {
  id: string;
  type: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
}

interface CaseCreationStepperProps {
  organizationId: string;
  debtors: Debtor[];
  onCreateDebtor: (
    data: DebtorFormData & { organizationId: string }
  ) => Promise<{ id: string }>;
  onCreateCase: (
    data: CaseFormData & { debtorId: string; organizationId: string }
  ) => Promise<void>;
}

type Step = "choice" | "debtor-create" | "debtor-select" | "case-create";

function getDebtorName(debtor: Debtor) {
  if (debtor.type === "COMPANY") {
    return debtor.companyName || "Unknown Company";
  }
  return (
    `${debtor.firstName || ""} ${debtor.lastName || ""}`.trim() || "Unknown"
  );
}

export function CaseCreationStepper({
  organizationId,
  debtors,
  onCreateDebtor,
  onCreateCase,
}: CaseCreationStepperProps) {
  const [currentStep, setCurrentStep] = useState<Step>("choice");
  const [selectedChoice, setSelectedChoice] = useState<
    "new" | "existing" | null
  >(null);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDebtorChoice = (choice: "new" | "existing") => {
    setSelectedChoice(choice);
    if (choice === "new") {
      setCurrentStep("debtor-create");
    } else {
      setCurrentStep("debtor-select");
    }
  };

  const handleDebtorCreate = async (data: DebtorFormData) => {
    setIsSubmitting(true);
    try {
      const result = await onCreateDebtor({
        ...data,
        organizationId,
      });
      setSelectedDebtorId(result.id);
      setCurrentStep("case-create");
    } catch (error) {
      console.error("Error creating debtor:", error);
      // Error will be handled by the form component
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDebtorSelect = (debtorId: string) => {
    setSelectedDebtorId(debtorId);
    setCurrentStep("case-create");
  };

  const handleCaseCreate = async (
    data: CaseFormData & { debtorId: string }
  ) => {
    setIsSubmitting(true);
    try {
      await onCreateCase({
        ...data,
        organizationId,
      });
    } catch (error) {
      console.error("Error creating case:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "debtor-create" || currentStep === "debtor-select") {
      setCurrentStep("choice");
      setSelectedChoice(null);
      setSelectedDebtorId(null);
    } else if (currentStep === "case-create") {
      if (selectedChoice === "new") {
        setCurrentStep("debtor-create");
      } else {
        setCurrentStep("debtor-select");
      }
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "choice":
        return 1;
      case "debtor-create":
      case "debtor-select":
        return 2;
      case "case-create":
        return 3;
      default:
        return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "choice":
        return "Choose Debtor";
      case "debtor-create":
        return "Create Debtor";
      case "debtor-select":
        return "Select Debtor";
      case "case-create":
        return "Create Case";
      default:
        return "";
    }
  };

  const selectedDebtor = selectedDebtorId
    ? debtors.find((d) => d.id === selectedDebtorId)
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  getStepNumber() >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span
                className={
                  getStepNumber() >= 1 ? "font-medium" : "text-muted-foreground"
                }
              >
                Choose Debtor
              </span>
            </div>
            <div className="h-px flex-1 bg-border mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  getStepNumber() >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={
                  getStepNumber() >= 2 ? "font-medium" : "text-muted-foreground"
                }
              >
                {selectedChoice === "new" ? "Create Debtor" : "Select Debtor"}
              </span>
            </div>
            <div className="h-px flex-1 bg-border mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  getStepNumber() >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span
                className={
                  getStepNumber() >= 3 ? "font-medium" : "text-muted-foreground"
                }
              >
                Create Case
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === "choice" && (
            <DebtorChoiceStep
              onSelect={handleDebtorChoice}
              selectedChoice={selectedChoice}
            />
          )}

          {currentStep === "debtor-create" && (
            <DebtorCreationStep
              onSubmit={handleDebtorCreate}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === "debtor-select" && (
            <DebtorSelectionStep
              debtors={debtors}
              onSelect={handleDebtorSelect}
              onBack={handleBack}
              selectedDebtorId={selectedDebtorId}
            />
          )}

          {currentStep === "case-create" && selectedDebtor && (
            <CaseCreationStep
              debtorId={selectedDebtor.id}
              debtorName={getDebtorName(selectedDebtor)}
              onSubmit={handleCaseCreate}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
