'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Search, User, Building2, Mail, Phone, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

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
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select Existing Debtor</h2>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Choose a debtor from the list below
				</p>
			</div>

			<Card className="border-2">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-5 w-5 text-blue-600" />
						Search Debtors
					</CardTitle>
					<CardDescription>
						Search by name, email, or phone number
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
						<Input
							placeholder="Search debtors..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="border-2">
				<CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
					<CardTitle className="text-slate-900 dark:text-white">Available Debtors</CardTitle>
					<CardDescription>
						{filteredDebtors.length} debtor
						{filteredDebtors.length !== 1 ? 's' : ''} found
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					{filteredDebtors.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 px-4">
							<div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
								<Search className="h-8 w-8 text-slate-400" />
							</div>
							<p className="text-slate-600 dark:text-slate-400">
								No debtors found. Try adjusting your search.
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
										<TableHead className="font-semibold">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredDebtors.map((debtor) => (
										<TableRow
											key={debtor.id}
											className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
												selectedDebtorId === debtor.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
											}`}
										>
											<TableCell className="flex items-center gap-2 font-medium">
												{debtor.type === 'COMPANY' ? (
													<Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
												) : (
													<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
												)}
												<span className="text-slate-900 dark:text-white">{getDebtorName(debtor)}</span>
											</TableCell>
											<TableCell>
												<Badge
													variant={debtor.type === 'COMPANY' ? 'secondary' : 'default'}
													className="font-medium"
												>
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
												<Button
													variant={selectedDebtorId === debtor.id ? 'default' : 'outline'}
													size="sm"
													onClick={() => onSelect(debtor.id)}
													className={
														selectedDebtorId === debtor.id
															? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
															: ''
													}
												>
													{selectedDebtorId === debtor.id ? (
														<>
															<CheckCircle2 className="h-4 w-4 mr-1" />
															Selected
														</>
													) : (
														'Select'
													)}
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<div className="flex gap-4 justify-end">
				<Button variant="outline" onClick={onBack}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<Button
					disabled={!selectedDebtorId}
					onClick={() => {
						if (selectedDebtorId) {
							onSelect(selectedDebtorId)
						}
					}}
					className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
				>
					Continue
					<ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
		</div>
	)
}
