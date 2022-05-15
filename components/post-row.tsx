import type {Post} from '../types'
import {http} from '../utils/http'
import Link from '../components/Link'

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
      <tr className="even:bg-gray-300 h-14">
        <td>{post.id}</td>
        <td>{post.title}</td>
        <td>{post.slug}</td>
        <td>{post.author}</td>
        <td>{post.created_at}</td>
        <td>{post.updated_at}</td>
        <td>
          <div className="flex center space-x-2">
            <Link href={'/dashboard/posts/form?type=edit&id=' + post.id} className="btn bg-yellow-400">Edit</Link>
            <Link href={'/dashboard/posts/view/' + post.id} className="btn bg-blue-500">View</Link>
            <button onClick={deletePost} className="btn bg-red-600">Delete</button>
          </div>
        </td>
      </tr>
  )
}

export default PostRow
