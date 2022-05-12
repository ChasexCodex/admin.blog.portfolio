import {useState} from 'react'


const FormPost = () => {

  const [title, setTitle] = useState('The Second Post')
  const [slug, setSlug] = useState('the-second-post')
  const [author, setAuthor] = useState('Elyas A. Al-Amri')
  const [content, setContent] = useState('This post was made using my editor.')

  const changeTitle = (e: any) => setTitle(e.target.value)
  const changeSlug = (e: any) => setSlug(e.target.value)
  const changeAuthor = (e: any) => setAuthor(e.target.value)
  const changeContent = (e: any) => setContent(e.target.value)

  return (
      <div>
        <form>
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
