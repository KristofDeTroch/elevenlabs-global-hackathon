import { getCases } from "@/lib/server/cases-service";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getStatusColor(status: string) {
  switch (status) {
    case "NEW":
      return "default";
    case "ACTIVE":
      return "default";
    case "PENDING_APPROVAL":
      return "secondary";
    case "BROKEN_PROMISE":
      return "destructive";
    case "PAID_IN_FULL":
      return "default";
    case "UNCOLLECTIBLE":
      return "secondary";
    case "CLOSED":
      return "outline";
    default:
      return "default";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getDebtorName(debtor: {
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  type: string;
}) {
  if (debtor.type === "COMPANY") {
    return debtor.companyName || "Unknown Company";
  }
  return (
    `${debtor.firstName || ""} ${debtor.lastName || ""}`.trim() || "Unknown"
  );
}

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage and track all debt collection cases
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">Add Case</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cases</CardTitle>
          <CardDescription>A list of all cases in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No cases found. Create your first case to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Debtor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>External Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        {caseItem.id.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        {getDebtorName(caseItem.debtor)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        <Badge variant={getStatusColor(caseItem.status)}>
                          {caseItem.status.replace("_", " ")}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        {formatCurrency(caseItem.currentBalance.toNumber())}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        {formatDate(caseItem.dueDate)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="block w-full"
                      >
                        {caseItem.externalReference || "-"}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
