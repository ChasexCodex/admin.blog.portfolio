import Joi from 'joi'
import {toKebabCase} from '@/utils'
import {UpdatePostValidationResult} from '@/types'

const UpdatePostSchema = Joi.object<UpdatePostValidationResult>({
  id: Joi.number().required(),
  title: Joi.string().min(3).max(50).required(),
  slug: Joi.string().empty(['', null]).default(parent => toKebabCase(parent.title)),
  content: Joi.string(),
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
})

export default UpdatePostSchema
