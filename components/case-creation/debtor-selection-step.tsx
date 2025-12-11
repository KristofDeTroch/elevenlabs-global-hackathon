"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Debtor {
  id: string;
  type: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
}

interface DebtorSelectionStepProps {
  debtors: Debtor[];
  onSelect: (debtorId: string) => void;
  onBack: () => void;
  selectedDebtorId: string | null;
}

function getDebtorName(debtor: Debtor) {
  if (debtor.type === "COMPANY") {
    return debtor.companyName || "Unknown Company";
  }
  return (
    `${debtor.firstName || ""} ${debtor.lastName || ""}`.trim() || "Unknown"
  );
}

export function DebtorSelectionStep({
  debtors,
  onSelect,
  onBack,
  selectedDebtorId,
}: DebtorSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDebtors = debtors.filter((debtor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = getDebtorName(debtor).toLowerCase();
    const email = (debtor.email || "").toLowerCase();
    const phone = (debtor.phone || "").toLowerCase();
    return (
      name.includes(query) || email.includes(query) || phone.includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Select Existing Debtor</h2>
        <p className="text-muted-foreground">
          Choose a debtor from the list below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Debtors</CardTitle>
          <CardDescription>
            Search by name, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search debtors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Debtors</CardTitle>
          <CardDescription>
            {filteredDebtors.length} debtor
            {filteredDebtors.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDebtors.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No debtors found. Try adjusting your search.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebtors.map((debtor) => (
                  <TableRow
                    key={debtor.id}
                    className={selectedDebtorId === debtor.id ? "bg-muted" : ""}
                  >
                    <TableCell className="font-medium">
                      {getDebtorName(debtor)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          debtor.type === "COMPANY" ? "secondary" : "default"
                        }
                      >
                        {debtor.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{debtor.email || "-"}</TableCell>
                    <TableCell>{debtor.phone || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant={
                          selectedDebtorId === debtor.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => onSelect(debtor.id)}
                      >
                        {selectedDebtorId === debtor.id ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={!selectedDebtorId}
          onClick={() => {
            if (selectedDebtorId) {
              onSelect(selectedDebtorId);
            }
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
