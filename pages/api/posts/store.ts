import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../utils/prisma'
import StorePostSchema from '../../../schemas/store-post-schema'
import type {CanBeCreated} from '../../../types'


export default async function StorePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = StorePostSchema.validate(req.body)

  if (error) {
    res.status(400).json({error, success: false})
    return
  }

  const {tags, category, ...input} = value

  const newTags = tags.filter((tag: CanBeCreated<{name: string} | any>) => tag.name) as {name: string}[]
  const oldTags = tags.filter((tag: CanBeCreated<{name: string} | any>) => tag.id) as {id: number}[]

  // @ts-ignore
  const categoryQuery = category.name ? {create: category} : {connect: {where: category}}

  try {
    const result = await prisma.post.create({
      data: {
        ...input,
        tags: {
          create: newTags,
          connect: oldTags,
        },
        // @ts-ignore
        category: categoryQuery,
      },
    })
    res.status(201).json({data: result, success: true})
  } catch (e) {
    console.log(e)
    res.status(400).json({error: e, success: false})
  }
}
