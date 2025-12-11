import { prisma } from '@/lib/prisma'

/**
 * Fetch all cases with related debtor and organization data.
 */
export async function getCases() {
	try {
		const cases = await prisma.case.findMany({
			include: {
				debtor: true,
				organization: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return cases
	} catch (error) {
		console.error('Error fetching cases:', error)
		throw error
	}
}

/**
 * Fetch a single case by ID with related data.
 */
export async function getCaseById(id: string) {
	try {
		const caseData = await prisma.case.findUnique({
			where: { id },
			include: {
				debtor: true,
				organization: true,
				payments: true,
				events: {
					include: {
						role: {
							include: {
								user: true,
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		})

		return caseData
	} catch (error) {
		console.error('Error fetching case:', error)
		throw error
	}
}

