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
      <div className="flex-pass-col my-2">
        <article className="flex-1 p-4 markdown-body rounded-md">
          {source && <MDXRemote {...source}/>}
        </article>
      </div>
  )
}

export default ViewMDX
