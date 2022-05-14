import {useEffect, useState} from 'react'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'

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
      <div>
        {source && <MDXRemote {...source}/>}
      </div>
  )
}

export default ViewMDX
