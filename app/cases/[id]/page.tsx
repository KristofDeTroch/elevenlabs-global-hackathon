import { getCaseById } from '@/lib/server/cases-service'
import { notFound } from 'next/navigation'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ElevenLabsWidget } from '@/app/components/elevenlabs-widget'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CaseDetailPageProps {
	params: Promise<{ id: string }>
}

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
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(Number(amount))
}

function formatDate(date: Date | null) {
	if (!date) return '-'
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(new Date(date))
}

function getDebtorName(debtor: {
	firstName: string | null
	lastName: string | null
	companyName: string | null
	type: string
}) {
	if (debtor.type === 'COMPANY') {
		return debtor.companyName || 'Unknown Company'
	}
	return (
		`${debtor.firstName || ''} ${debtor.lastName || ''}`.trim() || 'Unknown'
	)
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
	const { id } = await params
	const caseData = await getCaseById(id)

	if (!caseData) {
		notFound()
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/cases">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Case Details</h1>
					<p className="text-muted-foreground">
						Case ID: {caseData.id}
					</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Case Information</CardTitle>
						<CardDescription>Overview of this debt collection case</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Status</p>
								<Badge variant={getStatusColor(caseData.status)}>
									{caseData.status.replace('_', ' ')}
								</Badge>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">External Reference</p>
								<p className="font-medium">{caseData.externalReference || '-'}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Original Amount</p>
								<p className="font-medium">
									{formatCurrency(caseData.originalAmount.toNumber())}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Current Balance</p>
								<p className="font-medium">
									{formatCurrency(caseData.currentBalance.toNumber())}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Interest Rate</p>
								<p className="font-medium">
									{caseData.interestRate?.toNumber() || 0}%
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Due Date</p>
								<p className="font-medium">{formatDate(caseData.dueDate)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Last Contact</p>
								<p className="font-medium">{formatDate(caseData.lastContactDate)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Next Action</p>
								<p className="font-medium">{formatDate(caseData.nextActionDate)}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Debtor Information</CardTitle>
						<CardDescription>Details about the debtor</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Name</p>
								<p className="font-medium">{getDebtorName(caseData.debtor)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Type</p>
								<p className="font-medium">{caseData.debtor.type}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Email</p>
								<p className="font-medium">{caseData.debtor.email || '-'}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Phone</p>
								<p className="font-medium">{caseData.debtor.phone || '-'}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>AI Assistant</CardTitle>
					<CardDescription>
						Use the AI assistant to help manage this case
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ElevenLabsWidget />
				</CardContent>
			</Card>
		</div>
	)
}
