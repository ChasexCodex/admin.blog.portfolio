import usePosts from '../../../hooks/usePosts'
import PostRow from '../../../components/post-row'
import Link from '../../../components/Link'


const IndexPost = () => {
  const {result, isLoading, isError} = usePosts(0, 10)

  if (isLoading) {
    return (
        <div>
          Loading...
        </div>
    )
  }

  if (isError || !result.success) {
    return (
        <div>
          Error
        </div>
    )
  }

  return (
      <div className="mx-4 my-2">
        <div className="mb-2 flex space-x-2">
          <Link href="/dashboard" className="btn bg-black text-white">Back</Link>
          <Link href="/dashboard/posts/form" className="btn bg-green-500">Create</Link>
        </div>
        <div className="border border-gray-500 rounded">
          <table className="table-auto w-full text-center">
            <thead>
            <tr className="h-10 bg-gray-400">
              <th>#</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Author</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {result.data.map(post => <PostRow key={post.id} post={post}/>)}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default IndexPost
