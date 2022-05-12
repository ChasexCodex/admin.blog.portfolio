import {GetServerSideProps} from 'next'
import {supabase} from '../../../../utils/supabase'
import {Post} from '../../../../types'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
  if (!params) {
    return {
      notFound: true,
    }
  }

  const res = await supabase.from('posts').select().eq('id', params.id)
  const post = res.data?.[0] as Post

  return {
    props: {
      post,
    },
  }
}

type Props = {
  post: Post
}

const ViewPost = ({post}: Props) => {
  return (
      <div>
        <p>{post.id}</p>
        <p>{post.title}</p>
        <p>{post.slug}</p>
        <p>{post.content}</p>
        <p>{post.created_at}</p>
        <p>{post.updated_at}</p>
        <p>{post.author}</p>
      </div>
  )
}

export default ViewPost
