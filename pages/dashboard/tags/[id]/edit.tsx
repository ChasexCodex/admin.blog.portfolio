import TagForm from '@/components/forms/tag-form'
import {Tag} from '@/types'
import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'

type Props = {
  tag: Tag
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {

  if (!params || typeof params.id !== 'string') {
    return {notFound: true}
  }

  const tag = await prisma.tag.findFirst({
    where: {
      id: parseInt(params.id),
    },
  })

  return {
    props: {
      tag,
    },
  }
}

const EditTag = ({tag}: Props) => {
  return <TagForm tag={tag}/>
}

export default EditTag
