import {useEffect, useState} from 'react'
import type {FormEvent} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import type {Post} from '../../../types'

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

  const changeTitle = (e: any) => setTitle(e.target.value)
  const changeSlug = (e: any) => setSlug(e.target.value)
  const changeAuthor = (e: any) => setAuthor(e.target.value)
  const changeContent = (e: any) => setContent(e.target.value)

  useEffect(() => {
    (async () => {
      if (type === 'edit' && id !== 'new') {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/view?id=${id}`)
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
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${type === 'edit' ? 'update' : 'store'}`, input)
    } catch (err) {
      console.log(err)
      // TODO: display errors
    }

    await router.push('/dashboard/posts')
  }

  return (
      <div>
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
      </div>
  )
}

export default FormPost
