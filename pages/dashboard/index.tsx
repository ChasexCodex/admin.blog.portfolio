import Link from 'next/link'

const Dashboard =  () => {
  return (
      <div>
        <p>Dashboard</p>
        <Link href="/dashboard/posts"><a>Posts</a></Link>
        <Link href="/dashboard/categories"><a>Categories</a></Link>
        <Link href="/dashboard/tags"><a>Tags</a></Link>
      </div>
  )
}

export default Dashboard
