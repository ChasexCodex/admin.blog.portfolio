import Link from 'next/link'
import usePosts from '../../../hooks/usePosts'
import PostRow from '../../../components/post-row'
import React from 'react'


const IndexPost = () => {
  const {result, isLoading, isError} = usePosts(0, 10)

  if(isLoading) {
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
      <div>
        Posts Index
        <Link href="/dashboard"><a>Back</a></Link>
        <Link href="/dashboard/posts/form"><a>Create</a></Link>
        <Link href="/dashboard/posts/view"><a>View</a></Link>
        <div>
          {result.data.map(post => <PostRow key={post.id} post={post}/>)}
        </div>
      </div>
  )
}

export default IndexPost
