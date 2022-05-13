import {MDXRemote} from 'next-mdx-remote'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'
import {supabase} from '../../../../utils/supabase'
import type {GetServerSideProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import type {Post} from '../../../../types'

import rehypeHighlight from 'rehype-highlight'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
  if (!params) {
    return {
      notFound: true,
    }
  }

  const res = await supabase.from('posts').select().eq('id', params.id)
  const post = res.data?.[0] as Post

  const {content, data} = matter(post.content)
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
  post: Post,
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
      </div>
  )
}

export default ViewPost
