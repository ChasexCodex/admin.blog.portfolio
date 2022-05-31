import {ReactElement} from 'react'
import {Link} from '@/components'

const SizeIndicator = () => (
	<div className="fixed bottom-2 left-2 bg-white px-1 ring">
		<p className="sm:hidden">{'<'}sm</p>
		<p className="hidden sm:block md:hidden">sm</p>
		<p className="hidden md:block lg:hidden">md</p>
		<p className="hidden lg:block xl:hidden">lg</p>
		<p className="hidden xl:block">xl</p>
	</div>
)

const NavBar = () => (
	<div className="flex pt-4 pb-2 bg-gray-300 shadow-lg
									dark:bg-neutral-700 dark:text-white
									">
		<p className="text-3xl font-extrabold mr-auto pl-4 pr-8
									xl:text-5xl
									">
			Admin
		</p>
		<div className="flex items-center mr-6 text-lg
										xl:text-xl
										">
			<Link href="/dashboard/posts" className="px-4 font-semibold">Posts</Link>
			<Link href="/dashboard/categories" className="px-4 font-semibold">Categories</Link>
			<Link href="/dashboard/tags" className="px-4 font-semibold">Tags</Link>
		</div>
	</div>
)

const MainLayout = (page: ReactElement) => (
	<div className="flex flex-col min-h-screen w-screen bg-gray-100
		 								dark:bg-neutral-900
		 								">
		<NavBar/>
		<main className="flex flex-col flex-1 w-screen">
			{page}
		</main>

		{process.env.NODE_ENV === 'development' &&
			<SizeIndicator/>
		}
	</div>
)

export default MainLayout
