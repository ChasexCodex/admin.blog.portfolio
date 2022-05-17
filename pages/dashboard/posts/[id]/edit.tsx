import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {PostForm} from '@/components/forms'
import {Category, PostModelWithRelations, Tag} from '@/types'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {

  if (!params) {
    return {notFound: true}
  }

  const id = parseInt(params.id)

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()

  const post = await prisma.post.findFirst({
    where: {id},
    include: {tags: true, category: true},
  })

  if (!post) {
    return {notFound: true}
  }

  post.created_at = JSON.stringify(post.created_at) as any
  post.updated_at = JSON.stringify(post.updated_at) as any

  return {
    props: {
      post,
      categories,
      tags,
      id,
    },
  }
}

type Props = {
  post: PostModelWithRelations
  categories: Category[]
  tags: Tag[]
  id: string
}

const EditPost = ({id, ...props}: Props) => {
  return <PostForm {...props} id={id}/>
}

export default EditPost
