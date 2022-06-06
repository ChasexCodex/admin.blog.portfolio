import Joi from 'joi'
import {toKebabCase} from '@/utils'
import {CreatePostValidationResult} from '@/types'

const PostSchema = Joi.object<CreatePostValidationResult>({
	title: Joi.string().disallow('page').min(3).required(),
	slug: Joi.string().empty(['', null]).default(parent => toKebabCase(parent.title)),
	content: Joi.string(),
	description: Joi.string().optional(),
	author: Joi.string().empty(['', null]).default(process.env.NEXT_PUBLIC_DEFAULT_AUTHOR),

	// Accept either with id (existing) or name (new)
	category: Joi.alternatives(
		Joi.object({id: Joi.number().required()}),
		Joi.object({name: Joi.string().required()}),
	),

	// Accept either with id (existing) or name (new)
	tags: Joi.array().items(Joi.alternatives(
		Joi.object({id: Joi.number().required()}),
		Joi.object({name: Joi.string().required()}),
	)).min(0),
	published: Joi.boolean().default(false),

	thumbnail: Joi.any().optional()
})

export default PostSchema
