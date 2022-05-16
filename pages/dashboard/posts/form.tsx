import React, {useState} from 'react'
import type {ChangeEvent, FormEvent} from 'react'
import {useRouter} from 'next/router'
import type {PostModelWithRelations, Category, Tag} from '../../../types'
import {http} from '../../../utils/http'
import type {GetServerSideProps} from 'next'
import MDXViewer from '../../../components/MDXViewer'
import prisma from '../../../utils/prisma'
import Link from '../../../components/Link'
import Select from 'react-select/creatable'
import {FormatNew} from '../../../utils'

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
type Tab = 'info' | 'content' | 'view'

const FormPost = ({post, categories: allCategories, tags: allTags, type, id}: Props) => {

  const router = useRouter()

  const [title, setTitle] = useState(post.title ?? '')
  const [slug, setSlug] = useState(post.slug ?? '')
  const [author, setAuthor] = useState(post.author ?? '')
  const [content, setContent] = useState(post.content ?? '')
  const [published, setPublished] = useState(post.published ?? false)
  const [category, setCategory] = useState(() => {
    const v = post.category ?? allCategories[0]
    return {value: v.id, label: v.name}
  })
  const [tags, setTags] = useState(post.tags?.map(t => ({value: t.id, label: t.name})) ?? [])

  const [tab, setTab] = useState<Tab>('info')

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const changeSlug = (e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)
  const changeAuthor = (e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)
  const changeContent = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
  const changePublished = () => setPublished(p => !p)

  const changeTab = (tab: Tab) => () => setTab(tab)

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = {
      title,
      slug,
      author,
      content,
      published,
      category: FormatNew({name: category.label, id: category.value}),
      tags: tags.map(t => FormatNew({name: t.label, id: t.value})),
      id: type === 'edit' ? id : undefined,
    }

    try {
      console.log(input)
      await http.post(`/api/posts/${type === 'edit' ? 'update' : 'store'}`, input)
      await router.push('/dashboard/posts')
    } catch (err) {
      console.log(err)
      // TODO: display errors
    }
  }

  return (
      <div className="my-2 mx-4 flex-1 flex flex-col">
        <div className="my-2 flex">
          <Link href="/dashboard/posts" className="btn bg-black text-white">Back</Link>
        </div>
        {tab === 'info' &&
          <form onSubmit={onsubmit} encType="multipart/form-data"
                className="flex flex-col space-y-2 mx-auto w-full xl:max-w-6xl">

            <div>
              <label htmlFor="title">Title</label>
              <input value={title} onChange={changeTitle} id="title" type="text" name="title" required
                     className="rounded-md shadow-md px-2 py-1"
              />
            </div>

            <div>
              <label htmlFor="slug">Slug</label>
              <input value={slug} onChange={changeSlug} id="slug" type="text" name="slug"
                     placeholder="Auto-Generated"
                     className="rounded-md shadow-md px-2 py-1"
              />
            </div>

            <div>
              <label htmlFor="author">Author</label>
              <input value={author} onChange={changeAuthor} id="author" type="text" name="author"
                     placeholder={process.env.NEXT_PUBLIC_DEFAULT_AUTHOR}
                     className="rounded-md shadow-md px-2 py-1"
              />
            </div>

            <div>
              <label htmlFor="published" className="inline mr-4">Published</label>
              <input checked={published} onChange={changePublished} id="published" type="checkbox" name="published"/>
            </div>

            <div>
              <label htmlFor="categoryId" className="inline mr-4">Category</label>
              <Select value={category} isClearable id="categoryId" name="categoryId"
                      options={allCategories.map(c => ({label: c.name, value: c.id}))}
                      onChange={(v: any) => setCategory(v)}
              />
            </div>

            <div>
              <label htmlFor="tags">Tags</label>
              <Select value={tags} isMulti isClearable id="tags" name="tags[]"
                      onChange={v => setTags([...v])}
                      options={allTags.map(t => ({value: t.id, label: t.name}))}
              />
            </div>

            <input type="submit" value={type === 'edit' ? 'Update' : 'Create'}
                   className="btn bg-blue-500 max-w-max mx-auto my-2"/>
          </form>
        }
        {tab === 'content' &&
          <div className="flex-pass-col">
            <label htmlFor="content">Content</label>
            <textarea value={content} onChange={changeContent} id="content" name="content" required
                      className=" w-full flex-1 my-4 p-1 rounded-md shadow-lg"
            />
          </div>
        }
        {tab === 'view' && <MDXViewer content={content}/>}
        <div className="flex space-x-2">
          <button onClick={changeTab('info')} className="btn bg-orange-300">
            Info
          </button>
          <button onClick={changeTab('content')} className="btn bg-orange-300">
            Content
          </button>
          <button onClick={changeTab('view')} className="btn bg-orange-300">
            View
          </button>
        </div>
      </div>
  )
}

export default FormPost
