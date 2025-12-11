import { getCases } from '@/lib/server/cases-service'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FolderOpen, Calendar, DollarSign, User } from 'lucide-react'

function getStatusColor(status: string) {
	switch (status) {
		case 'NEW':
			return 'default'
		case 'ACTIVE':
			return 'default'
		case 'PENDING_APPROVAL':
			return 'secondary'
		case 'BROKEN_PROMISE':
			return 'destructive'
		case 'PAID_IN_FULL':
			return 'default'
		case 'UNCOLLECTIBLE':
			return 'secondary'
		case 'CLOSED':
			return 'outline'
		default:
			return 'default'
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
	const cases = await getCases()

	return (
		<div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 min-h-screen">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
						Cases
					</h1>
					<p className="text-slate-600 dark:text-slate-400 mt-1">
						Manage and track all debt collection cases
					</p>
				</div>
				<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
					<Link href="/cases/new" className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Add Case
					</Link>
				</Button>
			</div>

			{/* Stats */}
			{cases.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-3">
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">{cases.length}</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Total Cases</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
									<DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{formatCurrency(cases.reduce((sum, c) => sum + c.currentBalance.toNumber(), 0))}
									</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Total Balance</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
									<Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										{cases.filter(c => c.status === 'ACTIVE').length}
									</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Active Cases</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Table Card */}
			<Card className="border-2 shadow-xl">
				<CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						All Cases
					</CardTitle>
					<CardDescription>
						A comprehensive list of all cases in the system
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					{cases.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 px-4">
							<div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
								<FolderOpen className="h-10 w-10 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
								No cases yet
							</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
								Get started by creating your first debt collection case
							</p>
							<Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
								<Link href="/cases/new" className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									Create First Case
								</Link>
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50 dark:bg-slate-900/50">
										<TableHead className="font-semibold">Case ID</TableHead>
										<TableHead className="font-semibold">Debtor</TableHead>
										<TableHead className="font-semibold">Status</TableHead>
										<TableHead className="font-semibold">Current Balance</TableHead>
										<TableHead className="font-semibold">Due Date</TableHead>
										<TableHead className="font-semibold">External Reference</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{cases.map((caseItem) => (
										<TableRow key={caseItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
											<TableCell className="font-mono text-sm text-blue-600 dark:text-blue-400">
												{caseItem.id.slice(0, 8)}...
											</TableCell>
											<TableCell className="flex items-center gap-2">
												<User className="h-4 w-4 text-slate-400" />
												<span className="font-medium">{getDebtorName(caseItem.debtor)}</span>
											</TableCell>
											<TableCell>
												<Badge variant={getStatusColor(caseItem.status)} className="font-medium">
													{caseItem.status.replace('_', ' ')}
												</Badge>
											</TableCell>
											<TableCell className="font-semibold text-slate-900 dark:text-white">
												{formatCurrency(caseItem.currentBalance.toNumber())}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
													<Calendar className="h-3 w-3" />
													{formatDate(caseItem.dueDate)}
												</div>
											</TableCell>
											<TableCell className="text-slate-600 dark:text-slate-400">
												{caseItem.externalReference || '-'}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
