import {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'
import {StorePostSchema} from '@/schemas'
import {AnyObject, CanBeCreatedTag} from '@/types'
import {saveFile} from '@/utils/storage'


export default async function StorePost(req: NextApiRequest, res: NextApiResponse) {
	const {value, error} = StorePostSchema.validate(req.body)

	if (error) {
		res.status(400).json({error, success: false})
		return
	}

	const {tags, category, thumbnail, ...input} = value

	const newTags = tags.filter((tag: CanBeCreatedTag) => 'name' in tag) as {name: string}[]
	const oldTags = tags.filter((tag: CanBeCreatedTag) => 'id' in tag) as {id: number}[]

	try {
		const results = {} as AnyObject

		const dbResult = await prisma.post.create({
			data: {
				...input,
				tags: {
					create: newTags,
					connect: oldTags,
				},
				category: {['name' in category ? 'create' : 'connect']: category},
			},
		})

		results.dbResult = dbResult

		if (thumbnail) {
			const extension = (thumbnail as {path: string}).path.match(/\.[0-9a-z]+$/i)
			const storageResult = await saveFile(`posts/${dbResult.id}/thumbnail.${extension}`, thumbnail)
			results.storageResult = storageResult

			results.linkThumbnailResult = storageResult.path ? await prisma.post.update({
				where: {id: dbResult.id},
				data: {thumbnail: storageResult.path},
			}) : 'Failed to store thumbnail'
		}

		res.status(201).json({data: results, success: true})
	} catch (e) {
		console.log(e)
		res.status(400).json({error: e, success: false})
	}
}
