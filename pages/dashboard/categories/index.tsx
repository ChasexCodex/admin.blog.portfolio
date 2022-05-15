import type {GetServerSideProps} from 'next'
import prisma from '../../../utils/prisma'
import {Category} from '../../../types'
import Link from '../../../components/Link'

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
  return (
      <div className="mx-4">
        <div className="flex space-x-2 my-2">
          <Link href="/dashboard/categories/form" className="btn bg-green-400">Create</Link>
          <Link href="/dashboard" className="btn bg-black text-white">Back</Link>
        </div>
        <div className="border border-gray-500 rounded">
          <table className="table-auto w-full text-center">
            <thead>
            <tr className="h-10 bg-gray-400 ">
              <th>#</th>
              <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {categories.map(({id, name}) => (
                <tr key={id} className="border-t even:bg-gray-200">
                  <td>{id}</td>
                  <td>{name}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default IndexCategory
