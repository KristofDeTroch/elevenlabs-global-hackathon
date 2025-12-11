'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Users, ArrowRight } from 'lucide-react'

interface DebtorChoiceStepProps {
	onSelect: (choice: 'new' | 'existing') => void
	selectedChoice: 'new' | 'existing' | null
}

export function DebtorChoiceStep({
	onSelect,
	selectedChoice,
}: DebtorChoiceStepProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Debtor</h2>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Select whether you want to create a new debtor or use an existing one
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card
					className={`group cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
						selectedChoice === 'new'
							? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20'
							: 'border-2 hover:border-blue-300'
					}`}
					onClick={() => onSelect('new')}
				>
					<CardHeader>
						<div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
							selectedChoice === 'new'
								? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
								: 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600'
						}`}>
							<UserPlus className={`h-7 w-7 transition-all ${
								selectedChoice === 'new'
									? 'text-white'
									: 'text-blue-600 dark:text-blue-400 group-hover:text-white'
							}`} />
						</div>
						<CardTitle className="text-slate-900 dark:text-white">Create New Debtor</CardTitle>
						<CardDescription>
							Add a new individual or company debtor to the system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant={selectedChoice === 'new' ? 'default' : 'outline'}
							className={`w-full group/btn ${
								selectedChoice === 'new'
									? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
									: ''
							}`}
							onClick={(e) => {
								e.stopPropagation()
								onSelect('new')
							}}
						>
							Create New
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</Button>
					</CardContent>
				</Card>

				<Card
					className={`group cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
						selectedChoice === 'existing'
							? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
							: 'border-2 hover:border-purple-300'
					}`}
					onClick={() => onSelect('existing')}
				>
					<CardHeader>
						<div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
							selectedChoice === 'existing'
								? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
								: 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600'
						}`}>
							<Users className={`h-7 w-7 transition-all ${
								selectedChoice === 'existing'
									? 'text-white'
									: 'text-purple-600 dark:text-purple-400 group-hover:text-white'
							}`} />
						</div>
						<CardTitle className="text-slate-900 dark:text-white">Select Existing Debtor</CardTitle>
						<CardDescription>
							Choose from debtors already in the system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant={selectedChoice === 'existing' ? 'default' : 'outline'}
							className={`w-full group/btn ${
								selectedChoice === 'existing'
									? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
									: ''
							}`}
							onClick={(e) => {
								e.stopPropagation()
								onSelect('existing')
							}}
						>
							Select Existing
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
