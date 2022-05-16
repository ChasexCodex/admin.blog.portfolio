import type {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import {prisma} from '@/prisma'

const StoreCategorySchema = Joi
    .object({
      name: Joi.string().required(),
    })

export default async function StoreTag(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = StoreCategorySchema.validate(req.body)

  if (error) {
    res.status(400).json({error, success: false})
    return
  }

  try {
    const result = await prisma.tag.create({data: value})
    res.status(201).json({data: result, success: true})
  } catch (e) {
    res.status(400).json({error: e, success: false})
  }
}
