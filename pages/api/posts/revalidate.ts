import {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'
import {prisma} from '@/prisma'

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
    body: {
      token: process.env.ADMIN_TOKEN,
      slug: post.slug,
    },
  } as unknown as BodyInit

  try {
    const response = await fetch(`${process.env.BLOG_URL}/revalidate`, {method: 'POST', body: input})
    const data = await response.json()

    res.status(200).json(data)
  }
  catch (e) {
    res.status(400).json({message: 'Error: blog response failed', error: e, success: false})
  }
}
