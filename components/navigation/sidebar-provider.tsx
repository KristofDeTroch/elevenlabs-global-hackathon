'use client'

import { SidebarProvider as ShadcnSidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './sidebar'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SignedIn>
				<ShadcnSidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
							<SidebarTrigger />
							<div className="ml-auto flex items-center gap-4">
								<UserButton />
							</div>
						</header>
						<div className="flex flex-1 flex-col gap-4 overflow-auto">
							{children}
						</div>
					</SidebarInset>
				</ShadcnSidebarProvider>
			</SignedIn>
			<SignedOut>
				{children}
			</SignedOut>
		</>
	)
}

