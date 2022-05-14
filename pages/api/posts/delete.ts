import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../utils/prisma'

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query

  if (!id || typeof id !== 'string') {
    res.status(400).json({message: 'id is required', success: false})
    return
  }

  try {
    const result = await prisma.post.delete({where: {id: parseInt(id)}})
    res.status(201).json({result, success: true})
  } catch (e) {
    res.status(400).json({error: e, success: false})
  }
}
