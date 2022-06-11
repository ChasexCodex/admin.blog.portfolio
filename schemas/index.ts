import PostSchema from './PostSchema'
import Joi from 'joi'
import {UpdatePostValidationResult} from '@/types'

export {PostSchema}
export {default as FindSchema} from './FindSchema'

export const UpdatePostSchema = PostSchema.append<UpdatePostValidationResult>({id: Joi.number().required()})
