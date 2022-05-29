import {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'
import {UpdatePostSchema} from '@/schemas'
import {CanBeCreatedTag} from '@/types'

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
	const {value, error} = UpdatePostSchema.validate(req.body)

	if (error) {
		res.status(400).json({error, success: false})
		return
	}

	const updated_at = new Date()
	const {id, category, tags, ...data} = value

	const newTags = tags.filter((tag: CanBeCreatedTag) => 'name' in tag) as {name: string}[]
	const oldTags = tags.filter((tag: CanBeCreatedTag) => 'id' in tag) as {id: number}[]

	try {
		const result = await prisma.post.update({
			where: {id},
			data: {
				...data,
				category: {
					update: category,
				},
				tags: {
					updateMany: oldTags.map(t => ({data: t, where: {id: t.id}})),
					create: newTags,
				},
				updated_at,
			},
		})
		res.status(201).json({data: result, success: true})
	} catch (e) {
		res.status(400).json({error: e, success: false})
	}
}
