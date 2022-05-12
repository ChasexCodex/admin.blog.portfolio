import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from '../../../utils/supabase'

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.body

  if (!id) {
    return res.status(400).json({message: 'id is required'})
  }

  const result = await supabase.from('posts').delete().match({id})

  if (result.error) {
    return res.status(400).json({result, deleted: false})
  }

  return res.status(201).json({result, deleted: true})
}
