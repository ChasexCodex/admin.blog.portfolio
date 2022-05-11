import {Post} from '../types'

type Props = {
  post: Post
}

const PostRow = ({post}: Props) => {
  return (
      <div>
        <p>{post.id}</p>
        <p>{post.title}</p>
        <p>{post.slug}</p>
        <p>{post.created_at}</p>
        <p>{post.updated_at}</p>
        <p>{post.author}</p>
      </div>
  )
}

export default PostRow
