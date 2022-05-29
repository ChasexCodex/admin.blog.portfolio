import {GetServerSideProps} from 'next'
import {PostRow, Link} from '@/components'
import {prisma} from '@/prisma'
import {Post, PostModelWithRelations} from '@/types'

const perPage = 10

export const getServerSideProps: GetServerSideProps = async ({query}) => {
	const page = query.page ? parseInt(query.page as string) : 1

	const posts = (await prisma.post.findMany({
		skip: (page - 1) * perPage,
		take: perPage,
		include: {category: true, tags: true},
	}))
		// @ts-ignore
		.map((post: PostModelWithRelations) => ({
			...post,
			created_at: JSON.stringify(post.created_at),
			updated_at: JSON.stringify(post.created_at),
		}))

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
				<table className="table-auto w-full text-center">
					<thead>
					<tr className="h-10 bg-gray-400">
						<th className="w-8">#</th>
						<th>Title</th>
						<th>Slug</th>
						<th>Author</th>
						<th>Created At</th>
						<th>Updated At</th>
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
