'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	LayoutDashboard,
	FileText,
	Users,
} from 'lucide-react'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
} from '@/components/ui/sidebar'

const navigationItems = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Cases',
		href: '/cases',
		icon: FileText,
	},
	{
		title: 'Debtors',
		href: '/debtors',
		icon: Users,
	},
]

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar>
			<SidebarHeader className="border-b border-sidebar-border px-4 py-4">
				<Link href="/dashboard" className="flex items-center gap-3 group">
					<div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
						<span className="text-white font-bold text-lg">DC</span>
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-sidebar-foreground text-base">Debt Collection</span>
						<span className="text-xs text-sidebar-foreground/60">Management System</span>
					</div>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map((item) => {
								const isActive = pathname === item.href
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
										>
											<Link href={item.href}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

