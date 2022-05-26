import {NextApiRequest, NextApiResponse} from 'next'
import Joi from 'joi'

const RevalidatePostSchema = Joi.object({
  id: Joi.number().required(),
})

export default async function RevalidatePost(req: NextApiRequest, res: NextApiResponse) {
  const {value, error} = RevalidatePostSchema.validate(req.body)

  if (error) {
    res.status(400).json({message: 'Error: invalid input', error, success: false})
    return
  }

  const input = {
    body: {
      token: process.env.ADMIN_TOKEN,
      id: value.id,
    },
  } as unknown as RequestInit

  return fetch(`${process.env.BLOG_URL}/revalidate`, input)
      .then(() => {
        res.status(200).json({success: true})
      })
      .catch(e => {
        res.status(400).json({message: 'Error: blog response failed', error: e, success: false})
      })
}
