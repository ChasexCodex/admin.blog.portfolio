import React, {useState} from 'react'
import type {ChangeEvent, FormEvent} from 'react'
import {useRouter} from 'next/router'
import type {PostModelWithRelations, Category, Tag} from '../../../types'
import {http} from '../../../utils/http'
import type {GetServerSideProps} from 'next'
import MDXViewer from '../../../components/MDXViewer'
import prisma from '../../../utils/prisma'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const {id} = query

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()

  try {
    const post = id && typeof id === 'string' ? await prisma.post.findFirst({
      where: {id: parseInt(id)},
      include: {tags: true, category: true},
    }) : {}

    return {
      props: {
        post,
        categories,
        tags,
      },
    }
  } catch (e) {
    return {notFound: true}
  }
}

type Props = {
  post: PostModelWithRelations
  categories: Category[]
  tags: Tag[]
  type: 'edit' | 'create'
  id: string | 'new'
}

const FormPost = ({post, categories: allCategories, tags: allTags, type, id}: Props) => {

  const router = useRouter()

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [author, setAuthor] = useState(post.author)
  const [content, setContent] = useState(post.content)
  const [published, setPublished] = useState(post.published)
  const [categoryId, setCategoryId] = useState(post.categoryId ?? allCategories[0].id)
  const [tags, setTags] = useState(post.tags ? post.tags.map(t => t.name) : [])

  const [tab, setTab] = useState<'edit' | 'view'>('edit')

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const changeSlug = (e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)
  const changeAuthor = (e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)
  const changeContent = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
  const changePublished = () => setPublished(p => !p)
  const changeCategoryId = (e: ChangeEvent<HTMLSelectElement>) => setCategoryId(parseInt(e.target.value))
  const changeTags = (e: ChangeEvent<HTMLSelectElement>) => {
    const {selectedOptions} = e.target

    const selected = Array.from(selectedOptions, e => e.value)
    setTags(selected)
  }

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = {
      title,
      slug,
      author,
      content,
      published,
      categoryId,
      tags: tags.map(t => parseInt(t)),
      id: type === 'edit' ? id : undefined,
    }

    console.log(input)

    try {
      await http.post(`/api/posts/${type === 'edit' ? 'update' : 'store'}`, input)
      await router.push('/dashboard/posts')
    } catch (err) {
      console.log(err)
      // TODO: display errors
    }
  }

  return (
      <div>
        <Link href="/dashboard/posts"><a>Back</a></Link>
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
            <input checked={published} onChange={changePublished} type="checkbox" name="published"/>

            <select value={categoryId} onChange={changeCategoryId} name="categoryId">
              {allCategories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>

            <select value={tags} onChange={changeTags} name="tags[]" multiple>
              {allTags.map(t => <option value={t.id} key={t.id}>{t.name}</option>)}
            </select>

            <input type="submit" value="Submit"/>
          </form>
        }
        {tab === 'view' && <MDXViewer content={content}/>}
      </div>
  )
}

export default FormPost
