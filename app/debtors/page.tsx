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

	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Debtors</h1>
				<p className="text-muted-foreground">
					Manage all debtors in the system
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Debtors</CardTitle>
					<CardDescription>
						A list of all debtors in the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					{debtors.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							No debtors found. Create your first debtor to get started.
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name / Company</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Total Cases</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{debtors.map((debtor) => (
									<TableRow key={debtor.id}>
										<TableCell className="font-medium">
											{getDebtorName(debtor)}
										</TableCell>
										<TableCell>
											<Badge variant={getTypeColor(debtor.type)}>
												{debtor.type}
											</Badge>
										</TableCell>
										<TableCell>
											{debtor.email || '-'}
										</TableCell>
										<TableCell>
											{debtor.phone || '-'}
										</TableCell>
										<TableCell>
											{debtor._count.cases}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

