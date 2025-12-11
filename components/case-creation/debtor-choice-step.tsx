"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DebtorChoiceStepProps {
  onSelect: (choice: "new" | "existing") => void;
  selectedChoice: "new" | "existing" | null;
}

export function DebtorChoiceStep({
  onSelect,
  selectedChoice,
}: DebtorChoiceStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Choose Debtor</h2>
        <p className="text-muted-foreground">
          Select whether you want to create a new debtor or use an existing one
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedChoice === "new" ? "border-primary ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect("new")}
        >
          <CardHeader>
            <CardTitle>Create New Debtor</CardTitle>
            <CardDescription>
              Add a new individual or company debtor to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={selectedChoice === "new" ? "default" : "outline"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("new");
              }}
            >
              Create New
            </Button>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedChoice === "existing"
              ? "border-primary ring-2 ring-primary"
              : ""
          }`}
          onClick={() => onSelect("existing")}
        >
          <CardHeader>
            <CardTitle>Select Existing Debtor</CardTitle>
            <CardDescription>
              Choose from debtors already in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant={selectedChoice === "existing" ? "default" : "outline"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("existing");
              }}
            >
              Select Existing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
