import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from '../../../utils/supabase'

export default async function UpdatePost(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query

  if (!id) {
    return res.status(400).json({message: 'id is required'})
  }

  const result = await supabase.from('posts').select().eq('id', id)

  if (result.error) {
    return res.status(400).json({result, found: false})
  }

  return res.status(201).json({result, found: true})
}
