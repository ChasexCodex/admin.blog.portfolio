import type {Post} from '@/types'
import {http} from '@/utils'
import {Link} from './'

type Props = {
  post: Post
}

const PostRow = ({post}: Props) => {

  const deletePost = () => {
    http.delete('/api/posts/delete?id=' + post.id)
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
          // TODO: display errors
        })
  }


  const revalidate = () => {
    http.post(`/api/posts/revalidate`, {
      id: post.id,
    })
        .then(() => {})
        .catch(err => {
          console.log(err)
          // TODO: display errors
        })
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
            <Link href={`/dashboard/posts/${post.id}/edit`} className="btn bg-yellow-400">Edit</Link>
            <Link href={`/dashboard/posts/${post.id}/view`} className="btn bg-blue-500">View</Link>
            <button onClick={deletePost} className="btn bg-red-600">Delete</button>
            <button onClick={revalidate} className="btn bg-white">Revalidate</button>
          </div>
        </td>
      </tr>
  )
}

export default PostRow
