import type {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import prisma from '../../../utils/prisma'

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
    res.status(400).json({error, success: false})
    return
  }

  try {
    const result = await prisma.post.create({data: value})
    res.status(201).json({result, success: true})
  } catch (e) {
    res.status(400).json({error: e, success: false})
  }
}
