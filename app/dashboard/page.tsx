import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ElevenLabsWidget } from '../components/elevenlabs-widget'
import { Button } from '@/components/ui/button'
import { FolderOpen, AlertCircle, Users, DollarSign, Plus, FileText, UserPlus, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 min-h-screen">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
					Dashboard
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Welcome back! Here's an overview of your debt collection operations
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
							Total Cases
						</CardTitle>
						<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
							<FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-slate-900 dark:text-white">0</div>
						<p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
							<TrendingUp className="h-3 w-3 text-green-600" />
							Start tracking cases
						</p>
					</CardContent>
				</Card>
				
				<Card className="border-2 hover:border-amber-500 transition-all hover:shadow-lg bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
							Active Cases
						</CardTitle>
						<div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
							<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-slate-900 dark:text-white">0</div>
						<p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
							<Activity className="h-3 w-3" />
							Cases in progress
						</p>
					</CardContent>
				</Card>
				
				<Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
							Total Debtors
						</CardTitle>
						<div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
							<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-slate-900 dark:text-white">0</div>
						<p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
							Registered debtors
						</p>
					</CardContent>
				</Card>
				
				<Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
							Outstanding Balance
						</CardTitle>
						<div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							<DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-slate-900 dark:text-white">$0</div>
						<p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
							Total debt amount
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card className="border-2 hover:shadow-lg transition-all">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-blue-600" />
							Recent Activity
						</CardTitle>
						<CardDescription>
							Latest updates and events in your cases
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
								<Activity className="h-8 w-8 text-slate-400" />
							</div>
							<p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
								No recent activity yet
							</p>
							<p className="text-xs text-slate-500 dark:text-slate-500 max-w-sm">
								Activity will appear here as you create cases and interact with debtors
							</p>
						</div>
					</CardContent>
				</Card>
				
				<Card className="border-2 hover:shadow-lg transition-all bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-indigo-600" />
							Quick Actions
						</CardTitle>
						<CardDescription>
							Common tasks and shortcuts to get you started
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3">
							<Button asChild className="w-full justify-start h-auto py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
								<Link href="/cases/new" className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
										<Plus className="h-5 w-5" />
									</div>
									<div className="text-left">
										<div className="font-semibold">Create New Case</div>
										<div className="text-xs text-blue-100">Start a new debt collection case</div>
									</div>
								</Link>
							</Button>
							<Button asChild variant="outline" className="w-full justify-start h-auto py-4 hover:bg-slate-50 dark:hover:bg-slate-800">
								<Link href="/debtors" className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
										<UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
									</div>
									<div className="text-left">
										<div className="font-semibold text-slate-900 dark:text-white">Manage Debtors</div>
										<div className="text-xs text-slate-600 dark:text-slate-400">View and manage debtor information</div>
									</div>
								</Link>
							</Button>
							<Button asChild variant="outline" className="w-full justify-start h-auto py-4 hover:bg-slate-50 dark:hover:bg-slate-800">
								<Link href="/cases" className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
										<FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									</div>
									<div className="text-left">
										<div className="font-semibold text-slate-900 dark:text-white">View All Cases</div>
										<div className="text-xs text-slate-600 dark:text-slate-400">Browse your case collection</div>
									</div>
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
			
			<ElevenLabsWidget />
		</div>
	)
}

