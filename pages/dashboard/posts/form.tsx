import {useState} from 'react'
import type {ChangeEvent, FormEvent} from 'react'
import {useRouter} from 'next/router'
import type {Post} from '../../../types'
import {http} from '../../../utils/http'
import type {GetServerSideProps} from 'next'
import MDXViewer from '../../../components/MDXViewer'
import prisma from '../../../utils/prisma'

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const {id} = query

  if (!id || typeof id !== 'string') {
    return {
      props: {
        post: {},
      },
    }
  }

  try {
    const post = await prisma.post.findFirst({where: {id: parseInt(id)}})
    return {
      props: {
        post,
      },
    }
  } catch (e) {
    return {notFound: true}
  }
}

type Props = {
  post: Post
  type: 'edit' | 'create'
  id: string | 'new'
}

const FormPost = ({post, type, id}: Props) => {

  const router = useRouter()

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [author, setAuthor] = useState(post.author)
  const [content, setContent] = useState(post.content)
  const [published, setPublished] = useState(post.published)

  const [tab, setTab] = useState<'edit' | 'view'>('edit')

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const changeSlug = (e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)
  const changeAuthor = (e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)
  const changeContent = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
  const changePublished = () => setPublished(p => !p)

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = {
      title,
      slug,
      author,
      content,
      published,
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

            <label htmlFor="published">Published</label>
            <input type="checkbox" name="published" checked={published} onClick={changePublished}/>

            {/*TODO: add category select*/}
            {/*TODO: add tags select*/}

            <input type="submit" value="Submit"/>
          </form>
        }
        {tab === 'view' && <MDXViewer content={content}/>}
      </div>
  )
}

export default FormPost
