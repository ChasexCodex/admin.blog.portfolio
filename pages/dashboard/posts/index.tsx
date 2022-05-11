import Link from 'next/link'

const IndexPost = () => {
  return (
      <div>
        Posts Index
        <Link href="/dashboard/posts/form"><a>Create</a></Link>
        <Link href="/dashboard/posts/view"><a>View</a></Link>

      </div>
  )
}

export default IndexPost
