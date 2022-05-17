import type {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {Tag} from '@/types'
import {Link} from '@/components'

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await prisma.tag.findMany()

  return {
    props: {
      tags,
    },
  }
}

type Props = {
  tags: Tag[]
}

const IndexTag = ({tags}: Props) => {
  return (
      <div className="mx-4">
        <div className="flex space-x-2 my-2">
          <Link href="/dashboard/tags/form" className="btn bg-green-400">Create</Link>
          <Link href="/dashboard" className="btn bg-black text-white">Back</Link>
        </div>
        <div className="rounded shadow overflow-hidden">
          <table className="table-auto w-full text-center">
            <thead>
            <tr className="h-10 bg-gray-400">
              <th>#</th>
              <th>Name</th>
            </tr>
            </thead>
            <tbody>
            {tags.map(({id, name}) => (
                <tr key={id} className="border-t even:bg-gray-200 h-14">
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

export default IndexTag
