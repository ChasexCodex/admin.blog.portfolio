import type {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {Category} from '@/types'
import {Link} from '@/components'
import {http} from '@/utils'

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await prisma.category.findMany()

  return {
    props: {
      categories,
    },
  }
}

type Props = {
  categories: Category[]
}

const IndexCategory = ({categories}: Props) => {

  const deleteCategory = (id: number) => () => {
    http.delete('/api/categories/delete?id=' + id)
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
          // TODO: display errors
        })
  }

  return (
      <div className="mx-4">
        <div className="flex space-x-2 my-2">
          <Link href="/dashboard/categories/form" className="btn bg-green-400">Create</Link>
          <Link href="/dashboard" className="btn bg-black text-white">Back</Link>
        </div>
        <div className="rounded shadow overflow-hidden">
          <table className="table-auto w-full text-center">
            <thead>
            <tr className="h-10 bg-gray-400">
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {categories.map(({id, name}) => (
                <tr key={id} className="border-t even:bg-gray-200 h-14">
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>
                    <div className="flex center space-x-2">
                      <Link href={`/dashboard/categories/${id}/edit`} className="btn bg-yellow-400">Edit</Link>
                      <Link href={`/dashboard/categories/${id}/view`} className="btn bg-blue-500">View</Link>
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
}

export default IndexCategory
