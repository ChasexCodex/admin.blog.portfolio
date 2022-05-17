import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {Category, Tag} from '@/types'
import {PostForm} from '@/components/forms'

export const getServerSideProps: GetServerSideProps = async () => {

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()

  return {
    props: {
      categories,
      tags,
    },
  }
}

type Props = {
  categories: Category[]
  tags: Tag[]
}

const CreatePost = (props: Props) => {
  return <PostForm {...props}/>
}

export default CreatePost
