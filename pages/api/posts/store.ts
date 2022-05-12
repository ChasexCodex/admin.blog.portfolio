import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from '../../../utils/supabase'
import Joi from 'joi'

const StorePostSchema = Joi
    .object({
      title: Joi.string().min(3).max(50).required(),
      slug: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().required(),
    })

export default async function StorePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = StorePostSchema.validate(req.body)

  if (error) {
    return res.status(400).json({error})
  }

  const result = await supabase.from('posts').insert({...value})

  if (result.error) {
    return res.status(400).json({result, stored: false})
  }

  return res.status(201).json({result, stored: true})
}
