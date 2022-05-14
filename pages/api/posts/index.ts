import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../utils/prisma'

export default async function LoadPosts(req: NextApiRequest, res: NextApiResponse) {
  const limit = parseInt((req.query['limit'] as string) ?? '10')
  const offset = parseInt((req.query['offset'] as string) ?? '0')

  try {
    const result = await prisma.post.findMany({
      skip: offset,
      take: limit,
    })
    res.status(200).json({result, success: true})
  }
  catch (e) {
    res.status(500).json({error: e, success: false})
  }
}
