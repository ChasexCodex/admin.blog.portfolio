import type {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'

export default async function LoadCategories(req: NextApiRequest, res: NextApiResponse) {

	const {offset = 0, limit = 10} = req.body

	try {
		const result = await prisma.category.findMany({
			skip: offset,
			take: limit,
		})
		res.status(200).json({data: result, success: true})
	} catch (e) {
		res.status(500).json({error: e, success: false})
	}
}
