import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../utils/prisma'

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({message: 'id is required'})
  }

  try {
    const result = await prisma.post.findFirst({where: {id: parseInt(id)}})
    return res.status(201).json({result, found: true})
  } catch (e) {
    return res.status(400).json({error: e, found: false})
  }
}
