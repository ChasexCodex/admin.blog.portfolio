import {useState} from 'react'
import type {FormEvent} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'


const FormPost = () => {

  const router = useRouter()

  const [title, setTitle] = useState('The Third Post')
  const [slug, setSlug] = useState('the-third-post')
  const [author, setAuthor] = useState('Elyas A. Al-Amri')
  const [content, setContent] = useState('This post was made using my editor.')

  const changeTitle = (e: any) => setTitle(e.target.value)
  const changeSlug = (e: any) => setSlug(e.target.value)
  const changeAuthor = (e: any) => setAuthor(e.target.value)
  const changeContent = (e: any) => setContent(e.target.value)

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = {
      title,
      slug,
      author,
      content,
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/store`, input)
    } catch (err) {
      console.log(err)
      // TODO: display errors
    }

    await router.push('/dashboard/posts')
  }

  return (
      <div>
        <form onSubmit={onsubmit} encType="multipart/form-data" >
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
