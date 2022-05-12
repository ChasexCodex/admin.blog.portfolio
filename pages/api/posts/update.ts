import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from '../../../utils/supabase'
import Joi from 'joi'

const UpdatePostSchema = Joi
    .object({
      id: Joi.string().required(),
      title: Joi.string().min(3).max(50),
      slug: Joi.string(),
      content: Joi.string(),
      author: Joi.string(),
    })

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = UpdatePostSchema.validate(req.body)

  if (error) {
    return res.status(400).json({error})
  }

  const updated_at = new Date().toString()

  const result = await supabase.from('posts').insert({...value, updated_at})

  if (result.error) {
    return res.status(400).json({result, updated: false})
  }

  return res.status(201).json({result, updated: true})
}
