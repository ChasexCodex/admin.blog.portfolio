import type {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import prisma from '../../../utils/prisma'

const UpdatePostSchema = Joi
    .object({
      id: Joi.string().required(),
      title: Joi.string().min(3).max(50),
      slug: Joi.string(),
      content: Joi.string(),
      author: Joi.string(),
    })

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {value: {id, ...value}, error} = UpdatePostSchema.validate(req.body)

  if (error) {
    res.status(400).json({error, success: false})
    return
  }

  const updated_at = new Date()

  try {
    const result = prisma.post.update({
      where: {id},
      data: {
        ...value,
        updated_at,
      },
    })
    res.status(201).json({data: result, success: true})
  } catch (e) {
    res.status(400).json({error: e, success: false})
  }
}
