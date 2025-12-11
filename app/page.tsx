import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ElevenLabsWidget } from './components/elevenlabs-widget'
import { ArrowRight, Shield, BarChart3, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function Home() {
	const { userId } = await auth()

	if (userId) {
		redirect('/dashboard')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
			{/* Hero Section */}
			<div className="relative">
				<div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] dark:bg-grid-slate-400/[0.05]" />
				<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
							<Shield className="h-4 w-4" />
							Professional Debt Collection Platform
						</div>
						<h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
							Streamline Your
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Debt Collection </span>
							Operations
						</h1>
						<p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
							Manage cases, track debtors, and optimize your collection workflow with our comprehensive platform. Professional tools for modern debt collection teams.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button size="lg" className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
								Get Started
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
						Everything you need to succeed
					</h2>
					<p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
						Powerful features designed for professional debt collection teams
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle>Advanced Analytics</CardTitle>
							<CardDescription>
								Track performance metrics and gain insights into your collection operations
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="border-2 hover:border-indigo-500 transition-all hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
								<Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
							</div>
							<CardTitle>Debtor Management</CardTitle>
							<CardDescription>
								Centralized database for all debtor information and communication history
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
								<Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<CardTitle>Automated Workflows</CardTitle>
							<CardDescription>
								Streamline processes with automated reminders and status updates
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>

			{/* CTA Section */}
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
					<CardContent className="p-12 text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
							Ready to transform your debt collection?
						</h2>
						<p className="text-xl text-blue-100 mb-8">
							Join thousands of professionals using our platform
						</p>
						<Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
							Start Your Free Trial
						</Button>
					</CardContent>
				</Card>
			</div>

			<ElevenLabsWidget />
		</div>
	)
}
