import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {Category} from '@/types'
import {Link} from '@/components'
import {http} from '@/utils'
import {toast} from 'react-toastify'

export const getServerSideProps: GetServerSideProps = async () => {
	const categories = await prisma.category.findMany()

	return {
		props: {
			categories,
		},
	}
}

const deleteCategory = (id: number) => () => {
	const req = http.post('/api/categories/delete', {id})
		.then(() => {
			window.location.reload()
		})
	toast.promise(req, {
		pending: 'Deleting category',
		error: 'Error: couldn\'t delete category',
		success: 'Category deleted successfully',
	})
}

type Props = {
	categories: Category[]
}

const IndexCategory = ({categories}: Props) => (
	<div className="mx-4">
		<div className="flex space-x-0.5 my-2">
			<Link href="/dashboard" className="btn bg-black text-white">Back</Link>
			<Link href="/dashboard/categories/create" className="btn bg-green-500">Create</Link>
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
				{categories.map(({id, name}) => (
					<tr key={id} className="border-t even:bg-gray-200 h-14
																	dark:bg-neutral-500 dark:even:bg-neutral-600 dark:border-gray-500
																	">
						<td>{id}</td>
						<td>{name}</td>
						<td>
							<div className="flex center space-x-0.5 text-black">
								<Link href={`/dashboard/categories/${id}/edit`} className="btn bg-yellow-400">Edit</Link>
								<button onClick={deleteCategory(id)} className="btn bg-red-600">Delete</button>
							</div>
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	</div>
)

export default IndexCategory
