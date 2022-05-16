import Joi from 'joi'
import {toKebabCase} from '../utils/string'
import {CreatePostValidationResult} from '../types'

const StorePostSchema = Joi.object<CreatePostValidationResult>({
  title: Joi.string().min(3).max(50).required(),
  slug: Joi.string().allow('', null).empty(['', null]).default(parent => toKebabCase(parent.title)),
  content: Joi.string().required(),
  author: Joi.string().allow('', null).empty(['', null]).default(process.env.NEXT_PUBLIC_DEFAULT_AUTHOR),

  // Accept either with id (existing) or name (new)
  category: Joi.alternatives(
      Joi.object({id: Joi.number().required()}),
      Joi.object({name: Joi.string().required()}),
  ),

  // Accept either with id (existing) or name (new)
  tags: Joi.array().items(Joi.alternatives(
      Joi.object({id: Joi.number().required()}),
      Joi.object({name: Joi.string().required()}),
  )),
  published: Joi.boolean().default(false),
})

export default StorePostSchema
