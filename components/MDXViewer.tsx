import {useEffect, useState} from 'react'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'
import 'github-markdown-css/github-markdown.css'

type Props = {
  content: string
}

const ViewMDX = ({content}: Props) => {
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    const {content: render} = matter(content)
    serialize(render)
        .then(setSource)
        .catch(err => {
          serialize(err.toString())
              .then(setSource)
        })
  }, [content])

  return (
      <article className="bg-red-500 flex-1 my-2 p-4 markdown-body">
        {source && <MDXRemote {...source}/>}
      </article>
  )
}

export default ViewMDX
