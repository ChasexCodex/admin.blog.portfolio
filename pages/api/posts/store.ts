import type {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@/prisma'
import {StorePostSchema} from '@/schemas'
import type {CanBeCreatedTag} from '@/types'


export default async function StorePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = StorePostSchema.validate(req.body)

  if (error) {
    res.status(400).json({error, success: false})
    return
  }

  const {tags, category, ...input} = value

  const newTags = tags.filter((tag: CanBeCreatedTag) => 'name' in tag) as {name: string}[]
  const oldTags = tags.filter((tag: CanBeCreatedTag) => 'id' in tag) as {id: number}[]

  try {
    const result = await prisma.post.create({
      data: {
        ...input,
        tags: {
          create: newTags,
          connect: oldTags,
        },
        category: {['name' in category ? 'create' : 'connect']: category},
      },
    })
    res.status(201).json({data: result, success: true})
  } catch (e) {
    console.log(e)
    res.status(400).json({error: e, success: false})
  }
}
