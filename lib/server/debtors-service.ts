import { prisma } from '@/lib/prisma'

/**
 * Fetch all debtors with related organization data and case count.
 */
export async function getDebtors() {
	try {
		const debtors = await prisma.debtor.findMany({
			include: {
				organization: true,
				_count: {
					select: {
						cases: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return debtors
	} catch (error) {
		console.error('Error fetching debtors:', error)
		throw error
	}
}

/**
 * Fetch a single debtor by ID with related data.
 */
export async function getDebtorById(id: string) {
	try {
		const debtor = await prisma.debtor.findUnique({
			where: { id },
			include: {
				organization: true,
				cases: {
					include: {
						payments: true,
						events: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		})

		return debtor
	} catch (error) {
		console.error('Error fetching debtor:', error)
		throw error
	}
}

