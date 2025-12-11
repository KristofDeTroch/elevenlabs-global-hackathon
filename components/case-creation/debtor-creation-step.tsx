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
  debtorFormSchema,
  type DebtorFormData,
} from "@/lib/validations/debtor-schema";

interface DebtorCreationStepProps {
  onSubmit: (data: DebtorFormData) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function DebtorCreationStep({
  onSubmit,
  onBack,
  isSubmitting = false,
}: DebtorCreationStepProps) {
  const [formData, setFormData] = useState<DebtorFormData>({
    type: "INDIVIDUAL",
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    taxId: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = debtorFormSchema.safeParse(formData);

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

    try {
      await onSubmit(result.data);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create debtor",
      });
    }
  };

  const updateField = (field: keyof DebtorFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Create New Debtor</h2>
        <p className="text-muted-foreground">
          Enter the debtor information below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debtor Type</CardTitle>
          <CardDescription>
            Select whether this is an individual or company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={formData.type === "INDIVIDUAL" ? "default" : "outline"}
              onClick={() => updateField("type", "INDIVIDUAL")}
            >
              Individual
            </Button>
            <Button
              type="button"
              variant={formData.type === "COMPANY" ? "default" : "outline"}
              onClick={() => updateField("type", "COMPANY")}
            >
              Company
            </Button>
          </div>
        </CardContent>
      </Card>

      {formData.type === "INDIVIDUAL" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName || ""}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="John"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName || ""}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Doe"
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={formData.companyName || ""}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Acme Corporation"
                aria-invalid={!!errors.companyName}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john.doe@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {formData.type === "INDIVIDUAL" ? "SSN" : "Tax ID / EIN"}
            </label>
            <Input
              value={formData.taxId || ""}
              onChange={(e) => updateField("taxId", e.target.value)}
              placeholder={
                formData.type === "INDIVIDUAL" ? "123-45-6789" : "12-3456789"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Street Address</label>
            <Input
              value={formData.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">City</label>
              <Input
                value={formData.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Postal Code</label>
              <Input
                value={formData.postalCode || ""}
                onChange={(e) => updateField("postalCode", e.target.value)}
                placeholder="10001"
              />
            </div>
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
          {isSubmitting ? "Creating..." : "Create Debtor"}
        </Button>
      </div>
    </form>
  );
}
