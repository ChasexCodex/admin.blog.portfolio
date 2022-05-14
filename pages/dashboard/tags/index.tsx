import React from 'react'
import type {GetServerSideProps} from 'next'
import prisma from '../../../utils/prisma'
import {Tag} from '../../../types'
import Link from 'next/link'

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
      <div>
        <Link href="/dashboard/tags/form"><a>Create</a></Link>
        {tags.map(c => <p key={c.id}>{c.name}</p>)}
      </div>
  )
}

export default IndexTag
