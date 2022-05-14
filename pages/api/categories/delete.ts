import {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../utils/prisma'

export default async function UpdateCategory(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.body

  if (!id) {
    res.status(400).json({error: 'id is required', success: false})
    return
  }

  try {
    const result = await prisma.category.delete({where: {id: parseInt(id)}})
    res.status(200).json({data: result, success: true})
  } catch (e) {
    res.status(400).json({error: e, success: false})
  }
}
