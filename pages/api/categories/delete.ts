import {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'
import {FindSchema} from '@/schemas'

export default async function UpdateCategory(req: NextApiRequest, res: NextApiResponse) {
	const {value, error} = FindSchema.validate(req.body)

	if (error) {
		res.status(400).json({error, success: false})
		return
	}

	try {
		const result = await prisma.category.delete({where: {id: value.id}})
		res.status(200).json({data: result, success: true})
	} catch (e) {
		res.status(400).json({error: e, success: false})
	}
}
