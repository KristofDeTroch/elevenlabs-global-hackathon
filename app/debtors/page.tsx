import { getDebtors } from '@/lib/server/debtors-service'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, User, Mail, Phone, FolderOpen } from 'lucide-react'

function getDebtorName(debtor: {
	firstName: string | null
	lastName: string | null
	companyName: string | null
	type: string
}) {
	if (debtor.type === 'COMPANY') {
		return debtor.companyName || 'Unknown Company'
	}
	return `${debtor.firstName || ''} ${debtor.lastName || ''}`.trim() || 'Unknown'
}

function getTypeColor(type: string) {
	return type === 'COMPANY' ? 'secondary' : 'default'
}

export default async function DebtorsPage() {
	const debtors = await getDebtors()
	const individualCount = debtors.filter(d => d.type === 'INDIVIDUAL').length
	const companyCount = debtors.filter(d => d.type === 'COMPANY').length

	return (
		<div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-slate-900 min-h-screen">
			{/* Header */}
			<div>
				<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
					Debtors
				</h1>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Manage all debtors in the system
				</p>
			</div>

			{/* Stats */}
			{debtors.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-3">
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
									<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">{debtors.length}</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Total Debtors</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">{individualCount}</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Individuals</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
									<Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">{companyCount}</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">Companies</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Table Card */}
			<Card className="border-2 shadow-xl">
				<CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
					<CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
						<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
						All Debtors
					</CardTitle>
					<CardDescription>
						A comprehensive list of all debtors in the system
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					{debtors.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 px-4">
							<div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
								<Users className="h-10 w-10 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
								No debtors yet
							</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm">
								Debtors will appear here as you create new cases
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50 dark:bg-slate-900/50">
										<TableHead className="font-semibold">Name / Company</TableHead>
										<TableHead className="font-semibold">Type</TableHead>
										<TableHead className="font-semibold">Email</TableHead>
										<TableHead className="font-semibold">Phone</TableHead>
										<TableHead className="font-semibold">Total Cases</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{debtors.map((debtor) => (
										<TableRow key={debtor.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
											<TableCell className="flex items-center gap-2 font-medium">
												{debtor.type === 'COMPANY' ? (
													<Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
												) : (
													<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
												)}
												<span className="text-slate-900 dark:text-white">{getDebtorName(debtor)}</span>
											</TableCell>
											<TableCell>
												<Badge variant={getTypeColor(debtor.type)} className="font-medium">
													{debtor.type}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
													{debtor.email ? (
														<>
															<Mail className="h-3 w-3" />
															{debtor.email}
														</>
													) : (
														'-'
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
													{debtor.phone ? (
														<>
															<Phone className="h-3 w-3" />
															{debtor.phone}
														</>
													) : (
														'-'
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<FolderOpen className="h-3 w-3 text-slate-400" />
													<span className="font-semibold text-slate-900 dark:text-white">{debtor._count.cases}</span>
												</div>
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

