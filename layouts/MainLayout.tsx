import {ReactElement} from 'react'
import {Link} from '@/components'

const NavBar = () => {
  return (
      <div className="flex pt-4 pb-2 bg-gray-300 shadow-lg">
        <p className="text-5xl font-bold mr-auto px-4">Admin</p>
        <div className="flex items-center mr-6">
          <Link href="/dashboard/posts" className="px-4 text-xl font-semibold">Posts</Link>
          <Link href="/dashboard/categories" className="px-4 text-xl font-semibold">Categories</Link>
          <Link href="/dashboard/tags" className="px-4 text-xl font-semibold">Tags</Link>
        </div>
      </div>
  )
}

const MainLayout = (page: ReactElement) => {
  return (
      <div className="flex flex-col min-h-screen w-screen bg-gray-100">
        <NavBar/>
        <main className="flex flex-col flex-1 w-screen">
          {page}
        </main>
      </div>
  )
}

export default MainLayout
