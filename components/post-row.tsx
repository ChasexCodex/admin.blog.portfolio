import {Post} from '@/types'
import {http} from '@/utils'
import {Link} from './'

type Props = {
	post: Post
}

const PostRow = ({post}: Props) => {

	const deletePost = () => {
		http.delete('/api/posts/delete?id=' + post.id)
			.then(() => {
				window.location.reload()
			})
			.catch(err => {
				console.log(err)
				// TODO: display errors
			})
	}


	const revalidate = () => {
		http.post(`/api/posts/revalidate`, {
			id: post.id,
		})
			.then(() => {
			})
			.catch(err => {
				console.log(err)
				// TODO: display errors
			})
	}

	return (
		<tr key={post.id} className="border-t even:bg-gray-200 h-14
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
					<button onClick={deletePost} className="btn w-full bg-red-600">Delete</button>
					<button onClick={revalidate} className="btn w-full bg-white">Revalidate</button>
				</div>
			</td>
		</tr>
	)
}

export default PostRow
