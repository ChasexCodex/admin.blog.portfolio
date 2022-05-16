import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import PostForm from '@/components/forms/post-form'
import {Category, PostModelWithRelations, Tag} from '@/types'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {

  if (!params) {
    throw null
  }

  const id = parseInt(params.id)

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()

  const post = await prisma.post.findFirst({
    where: {id},
    include: {tags: true, category: true},
  })

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
