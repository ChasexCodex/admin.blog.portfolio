import {GetServerSideProps} from 'next'
import {PostRow, Link} from '@/components'
import {prisma} from '@/prisma'
import {Post} from '@/types'
import {convertTimestampToMoment} from '@/utils'

const perPage = 10

export const getServerSideProps: GetServerSideProps = async ({query}) => {
	const page = query.page ? parseInt(query.page as string) : 1

	const posts = (await prisma.post.findMany({
		skip: (page - 1) * perPage,
		take: perPage,
		include: {category: true, tags: true},
	}))
		.map(p => convertTimestampToMoment(p))

	return {
		props: {
			posts,
		},
	}
}

type Props = {
	posts: Post[]
}

const IndexPost = ({posts}: Props) => (
	<div className="mx-4 my-2">
		<div className="mb-2 flex space-x-0.5">
			<Link href="/dashboard" className="btn bg-black text-white">Back</Link>
			<Link href="/dashboard/posts/create" className="btn bg-green-500">Create</Link>
		</div>
		{!!posts.length &&
			<div className="shadow overflow-hidden">
				<table className="table-auto w-full text-center
			 									dark:text-white
			 									">
					<thead>
					<tr className="h-10 bg-gray-400
											 dark:bg-gray-800
											 ">
						<th className="w-8 hidden xl:table-cell">#</th>
						<th>Title</th>
						<th className="hidden xl:table-cell">Slug</th>
						<th className="hidden xl:table-cell">Author</th>
						<th className="hidden xl:table-cell">Created At</th>
						<th className="hidden xl:table-cell">Updated At</th>
						<th>Actions</th>
					</tr>
					</thead>
					<tbody>
					{posts.map(post => <PostRow key={post.id} post={post}/>)}
					</tbody>
				</table>
			</div>
		}
		{!posts.length &&
			<p className="text-center text-3xl">
				No Posts have been created
			</p>
		}
	</div>
)

export default IndexPost
