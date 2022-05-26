import {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import {prisma} from '@/prisma'
import {axios} from '@/utils'

const RevalidatePostSchema = Joi.object({
  id: Joi.number().required(),
})

export default async function RevalidatePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = RevalidatePostSchema.validate(req.body)

  if (error) {
    res.status(400).json({message: 'Error: invalid input', error, success: false})
    return
  }

  const post = await prisma.post.findUnique({
    where: {id: value.id},
    select: {slug: true},
  })

	if(!post) {
		res.status(404).json({message: 'Error: no such input exists', success: false})
		return
	}

  const input = {
    token: process.env.REVALIDATE_TOKEN,
    path: `posts/${post.slug}`,
  }

  try {
    const response = await axios.post(`${process.env.BLOG_URL}/api/revalidate`, input)
    res.status(response.status).json(response.data)
  }
  catch (e) {
    res.status(500).json({message: 'Error: blog response failed', error: e, success: false})
  }
}
