import {useEffect, useState} from 'react'
import type {FormEvent} from 'react'
import {useRouter} from 'next/router'
import {serialize} from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import {MDXRemote} from 'next-mdx-remote'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import type {Post} from '../../../types'
import {http} from '../../../utils/http'

type Input = {
  type: 'edit' | 'create',
  id: string | 'new',
}

const FormPost = () => {

  const router = useRouter()
  const {type, id} = router.query as Input

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const [tab, setTab] = useState<'edit' | 'view'>('edit')

  const changeTitle = (e: any) => setTitle(e.target.value)
  const changeSlug = (e: any) => setSlug(e.target.value)
  const changeAuthor = (e: any) => setAuthor(e.target.value)
  const changeContent = (e: any) => setContent(e.target.value)

  useEffect(() => {
    (async () => {
      if (type === 'edit' && id !== 'new') {
        const res = await http.get(`/api/posts/view?id=${id}`)
        const post = res.data.result.data[0] as Post
        setTitle(post.title)
        setSlug(post.slug)
        setAuthor(post.author)
        setContent(post.content)
      }
    })()
  }, [type, id])

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = {
      title,
      slug,
      author,
      content,
      id: type === 'edit' ? id : undefined,
    }

    try {
      await http.post(`/api/posts/${type === 'edit' ? 'update' : 'store'}`, input)
    } catch (err) {
      console.log(err)
      // TODO: display errors
    }

    await router.push('/dashboard/posts')
  }

  return (
      <div>
        <button onClick={() => setTab(t => t == 'view' ? 'edit' : 'view')}>
          {tab == 'view' ? 'Edit' : 'View'}
        </button>
        {tab == 'edit' &&
          <form onSubmit={onsubmit} encType="multipart/form-data">
            <label htmlFor="title">Title</label>
            <input value={title} onChange={changeTitle} type="text" name="title" required/>

            <label htmlFor="slug">Slug</label>
            <input value={slug} onChange={changeSlug} type="text" name="slug" placeholder="Auto-Generated"/>

            <label htmlFor="content">Content</label>
            <textarea value={content} onChange={changeContent} name="content" required/>

            <label htmlFor="author">Author</label>
            <input value={author} onChange={changeAuthor} type="text" name="author" required/>

            <input type="submit" value="Submit"/>
          </form>
        }
        {tab === 'view' && <ViewMDX content={content}/>}
      </div>
  )
}

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

export default FormPost
