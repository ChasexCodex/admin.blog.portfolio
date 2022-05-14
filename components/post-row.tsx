import Link from 'next/link'
import type {Post} from '../types'
import {http} from '../utils/http'

type Props = {
  post: Post
}

const PostRow = ({post}: Props) => {

  const deletePost = async () => {
    try {
      await http.delete('/api/posts/delete?id=' + post.id)
      window.location.reload()
    } catch (err) {
      console.log(err)
      // TODO: display any errors
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
        <Link href={'/dashboard/posts/view/' + post.id}>View</Link>
        <button onClick={deletePost}>Delete</button>
      </div>
  )
}

export default PostRow
