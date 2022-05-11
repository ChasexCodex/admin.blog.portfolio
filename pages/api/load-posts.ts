import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from '../../utils/supabase'

const postSelection = `
  id,
  title,
  slug,
  created_at,
  updated_at,
  author
`

export default async function LoadPosts(req: NextApiRequest, res: NextApiResponse) {
  const limit = parseInt((req.query['limit'] as string) ?? '10')
  const offset = parseInt((req.query['offset'] as string) ?? '0')
  const result = await supabase.from('posts').select().range(offset, offset + limit)
  return res.status(200).json(result)
}
