import type {GetServerSideProps} from 'next'
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
			<Link href="/dashboard/tags/form" className="btn bg-green-400">Create</Link>
			<Link href="/dashboard" className="btn bg-black text-white">Back</Link>
		</div>
		<div className="shadow overflow-hidden">
			<table className="table-auto w-full text-center">
				<thead>
				<tr className="h-10 bg-gray-400">
					<th>#</th>
					<th>Name</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{tags.map(({id, name}) => (
					<tr key={id} className="border-t even:bg-gray-200 h-14">
						<td>{id}</td>
						<td>{name}</td>
						<td>
							<div className="flex center space-x-0.5">
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
