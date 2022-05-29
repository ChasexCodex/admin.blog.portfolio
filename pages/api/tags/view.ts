import type {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'

export default async function UpdateTag(req: NextApiRequest, res: NextApiResponse) {
	const {id} = req.body

	if (!id) {
		return res.status(400).json({message: 'id is required', success: false})
	}

	try {
		const result = await prisma.tag.findFirst({where: {id: parseInt(id)}})
		res.status(201).json({data: result, success: true})
	} catch (e) {
		res.status(400).json({error: e, success: false})
	}
}
