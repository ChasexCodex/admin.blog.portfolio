import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {Tag} from '@/types'
import {Link} from '@/components'
import {http} from '@/utils'

export const getServerSideProps: GetServerSideProps = async () => {
	const tags = await prisma.tag.findMany()

	return {
		props: {
			tags,
		},
	}
}

const deleteTag = (id: number) => () => {
	http.delete('/api/tags/delete?id=' + id)
		.then(() => {
			window.location.reload()
		})
		.catch(err => {
			console.log(err)
			// TODO: display errors
		})
}

type Props = {
	tags: Tag[]
}

const IndexTag = ({tags}: Props) => (
	<div className="mx-4">
		<div className="flex space-x-0.5 my-2">
			<Link href="/dashboard" className="btn bg-black text-white">Back</Link>
			<Link href="/dashboard/tags/create" className="btn bg-green-500">Create</Link>
		</div>
		<div className="shadow overflow-hidden">
			<table className="table-auto w-full text-center
			 									dark:text-white
			 									">
				<thead>
				<tr className="h-10 bg-gray-400
											 dark:bg-gray-800
											 ">
					<th>#</th>
					<th>Name</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{tags.map(({id, name}) => (
					<tr key={id} className="border-t even:bg-gray-200 h-14
																	dark:bg-neutral-500 dark:even:bg-neutral-600 dark:border-gray-500
																	">
						<td>{id}</td>
						<td>{name}</td>
						<td>
							<div className="flex center space-x-0.5 text-black">
								<Link href={`/dashboard/tags/${id}/edit`} className="btn bg-yellow-400">Edit</Link>
								<button onClick={deleteTag(id)} className="btn bg-red-600">Delete</button>
							</div>
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	</div>
)

export default IndexTag
