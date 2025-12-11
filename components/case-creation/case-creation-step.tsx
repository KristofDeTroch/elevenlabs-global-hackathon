"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  caseFormSchema,
  type CaseFormData,
} from "@/lib/validations/case-schema";

interface CaseCreationStepProps {
  debtorId: string;
  debtorName: string;
  onSubmit: (data: CaseFormData & { debtorId: string }) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function CaseCreationStep({
  debtorId,
  debtorName,
  onSubmit,
  onBack,
  isSubmitting = false,
}: CaseCreationStepProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    originalAmount: "1000.00",
    currentBalance: "1000.00",
    interestRate: "0.00",
    externalReference: "",
    dueDate: "",
    lastContactDate: "",
    nextActionDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = caseFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Validate that currentBalance equals originalAmount
    if (
      Number(result.data.currentBalance) !== Number(result.data.originalAmount)
    ) {
      setErrors({
        currentBalance:
          "Current balance must equal original amount for new cases",
      });
      return;
    }

    try {
      await onSubmit({ ...result.data, debtorId });
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create case",
      });
    }
  };

  const updateField = (field: keyof CaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Sync currentBalance with originalAmount when originalAmount changes
  const handleOriginalAmountChange = (value: string) => {
    updateField("originalAmount", value);
    if (
      !formData.currentBalance ||
      formData.currentBalance === formData.originalAmount
    ) {
      updateField("currentBalance", value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Case</h2>
        <p className="text-muted-foreground">
          Enter case details for <strong>{debtorName}</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
          <CardDescription>
            Enter the debt amount and interest rate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Original Amount ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.originalAmount}
              onChange={(e) => handleOriginalAmountChange(e.target.value)}
              required
              aria-invalid={!!errors.originalAmount}
            />
            {errors.originalAmount && (
              <p className="text-sm text-destructive mt-1">
                {errors.originalAmount}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Current Balance ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.currentBalance}
              onChange={(e) => updateField("currentBalance", e.target.value)}
              required
              aria-invalid={!!errors.currentBalance}
            />
            {errors.currentBalance && (
              <p className="text-sm text-destructive mt-1">
                {errors.currentBalance}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              For new cases, this should equal the original amount
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.interestRate || ""}
              onChange={(e) => updateField("interestRate", e.target.value)}
              aria-invalid={!!errors.interestRate}
            />
            {errors.interestRate && (
              <p className="text-sm text-destructive mt-1">
                {errors.interestRate}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
          <CardDescription>
            Additional information about the case
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">External Reference</label>
            <Input
              value={formData.externalReference || ""}
              onChange={(e) => updateField("externalReference", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional reference ID from your system
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
          <CardDescription>Key dates for this case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Contact Date</label>
            <Input
              type="date"
              value={formData.lastContactDate || ""}
              onChange={(e) => updateField("lastContactDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Next Action Date</label>
            <Input
              type="date"
              value={formData.nextActionDate || ""}
              onChange={(e) => updateField("nextActionDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {errors.submit && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Case..." : "Create Case"}
        </Button>
      </div>
    </form>
  );
}
