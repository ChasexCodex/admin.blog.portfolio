import {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import {prisma} from '@/prisma'

const UpdateCategorySchema = Joi
	.object({
		id: Joi.number().required(),
		name: Joi.string().required(),
	})

export default async function UpdateTag(req: NextApiRequest, res: NextApiResponse) {
	const {value: {id, ...value}, error} = UpdateCategorySchema.validate(req.body)

	if (error) {
		res.status(400).json({error, success: false})
		return
	}

	try {
		const result = prisma.tag.update({
			where: {id: parseInt(id)},
			data: value,
		})
		res.status(201).json({data: result, success: true})
	} catch (e) {
		res.status(400).json({error: e, success: false})
	}
}
