import {GetServerSideProps} from 'next'
import {Link} from '@/components'
import {prisma} from '@/prisma'
import {Post} from '@/types'
import {convertTimestampToMoment, http} from '@/utils'

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

const deletePost = (id: number) => () => {
	http.post('/api/posts/delete', {id})
		.then(() => {
			window.location.reload()
		})
		.catch(err => {
			console.log(err)
			// TODO: display errors
		})
}

const revalidate = (id: number) => () => {
	http.post(`/api/posts/revalidate`, {id})
		.then(() => {
			// TODO: display success
		})
		.catch(err => {
			console.log(err)
			// TODO: display errors
		})
}

type RowProps = {
	post: Post
}

const PostRow = ({post}: RowProps) => (
	<tr key={post.id}
			className="border-t even:bg-gray-200 h-14
								 dark:bg-neutral-500 dark:even:bg-neutral-600 dark:border-gray-500
								 ">
		<td className="hidden xl:table-cell">{post.id}</td>
		<td>{post.title}</td>
		<td className="hidden xl:table-cell">{post.slug}</td>
		<td className="hidden xl:table-cell">{post.author}</td>
		<td className="hidden xl:table-cell">{post.created_at}</td>
		<td className="hidden xl:table-cell">{post.updated_at}</td>
		<td>
			<div className="flex flex-col center space-y-0.5 text-black
											xl:flex-row xl:space-x-0.5 xl:space-y-0
											">
				<Link href={`/dashboard/posts/${post.id}/edit`} className="btn w-full bg-yellow-400">Edit</Link>
				<Link href={`/dashboard/posts/${post.id}/view`} className="btn w-full bg-blue-500">View</Link>
				<button onClick={deletePost(post.id)} className="btn w-full bg-red-600">Delete</button>
				<button onClick={revalidate(post.id)} className="btn w-full bg-white">Revalidate</button>
			</div>
		</td>
	</tr>
)

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
