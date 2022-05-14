import React from 'react'
import type {GetServerSideProps} from 'next'
import prisma from '../../../utils/prisma'
import {Category} from '../../../types'
import Link from 'next/link'

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
      <div>
        <Link href="/dashboard/categories/form"><a>Create</a></Link>
        {categories.map(c => <p key={c.id}>{c.name}</p>)}
      </div>
  )
}

export default IndexCategory
