import Link from 'next/link'

const Dashboard =  () => {
  return (
      <div>
        <p>Dashboard</p>
        <Link href="/dashboard/posts"><a>Posts</a></Link>
      </div>
  )
}

export default Dashboard
