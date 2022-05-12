import Link from 'next/link'
import type {Post} from '../types'
import axios from 'axios'

type Props = {
  post: Post
}

const PostRow = ({post}: Props) => {

  const deletePost = () => {
    try {
      axios.delete('/api/posts/delete?id=' + post.id)
    } catch (err) {
      console.log(err)
    }
  }

  return (
      <div>
        <p>{post.id}</p>
        <p>{post.title}</p>
        <p>{post.slug}</p>
        <p>{post.created_at}</p>
        <p>{post.updated_at}</p>
        <p>{post.author}</p>
        <Link href={'/dashboard/posts/form?type=edit&id=' + post.id}>Edit</Link>
        <button onClick={deletePost}>Delete</button>
      </div>
  )
}

export default PostRow
