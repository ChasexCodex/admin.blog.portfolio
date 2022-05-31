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

			{process.env.NODE_ENV === 'development' &&
				<div className="fixed bottom-2 left-2 bg-white px-1 ring">
					<p className="sm:hidden">{'<'}sm</p>
					<p className="hidden sm:block md:hidden">sm</p>
					<p className="hidden md:block lg:hidden">md</p>
					<p className="hidden lg:block xl:hidden">lg</p>
					<p className="hidden xl:block">xl</p>
				</div>
			}
		</div>
	)
}

export default MainLayout
