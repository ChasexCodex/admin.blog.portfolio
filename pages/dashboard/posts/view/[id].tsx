import {MDXRemote} from 'next-mdx-remote'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'
import type {GetServerSideProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import type {PostWithRelations} from '../../../../types'

import rehypeHighlight from 'rehype-highlight'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import prisma from '../../../../utils/prisma'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
  if (!params) {
    return {notFound: true}
  }

  const post = await prisma.post.findFirst({
    where: {id: parseInt(params.id)},
    include: {tags: true, category: true},
  })

  if (!post) {
    return {notFound: true}
  }

  post.created_at = JSON.stringify(post.created_at) as any
  post.updated_at = JSON.stringify(post.updated_at) as any

  const {content} = matter(post.content)
  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {className: ['anchor']},
          },
          {behaviour: 'wrap'},
        ],
        rehypeHighlight,
        rehypeCodeTitles,
      ],
    },
  })
  return {
    props: {
      post,
      source,
    },
  }
}

type Props = {
  post: PostWithRelations,
  source: MDXRemoteSerializeResult
}

const ViewPost = ({post, source}: Props) => {

  const components = {}

  return (
      <div>
        <p>{post.id}</p>
        <p>{post.title}</p>
        <p>{post.slug}</p>
        <MDXRemote {...source} components={components}/>
        <p>{post.created_at}</p>
        <p>{post.updated_at}</p>
        <p>{post.author}</p>
        <p>{post.category.name}</p>
        <p>{post.tags.map(t => <span key={t.id}>{t.name},</span>)}</p>
      </div>
  )
}

export default ViewPost
