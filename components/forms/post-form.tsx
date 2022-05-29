import {ChangeEvent, FormEvent, useState} from 'react'
import {useRouter} from 'next/router'
import {PostModelWithRelations, Category, Tag} from '@/types'
import {MDXViewer, Link} from '@/components'
import Select from 'react-select/creatable'
import {FormatNew, FormatOld, http} from '@/utils'

type Props = {
	post?: PostModelWithRelations
	categories: Category[]
	tags: Tag[]
	id?: string
}

type ChangeInput = ChangeEvent<HTMLInputElement>
type ChangeTextarea = ChangeEvent<HTMLTextAreaElement>
type Tab = 'info' | 'content'

const FormPost = ({post, categories: allCategories, tags: allTags, id}: Props) => {
	const isEdit = !!id

	const router = useRouter()

	const [title, setTitle] = useState(post?.title ?? '')
	const [slug, setSlug] = useState(post?.slug ?? '')
	const [description, setDescription] = useState(post?.description ?? '')
	const [author, setAuthor] = useState(post?.author ?? '')
	const [content, setContent] = useState(post?.content ?? '')
	const [published, setPublished] = useState(post?.published ?? false)
	const [category, setCategory] = useState(post?.category ? FormatOld(post.category) : null)
	const [tags, setTags] = useState(post?.tags?.map(t => ({value: t.id, label: t.name})) ?? [])

	const [tab, setTab] = useState<Tab>('info')

	const changeTitle = (e: ChangeInput) => setTitle(e.target.value)
	const changeSlug = (e: ChangeInput) => setSlug(e.target.value)
	const changeDescription = (e: ChangeTextarea) => setDescription(e.target.value)
	const changeAuthor = (e: ChangeInput) => setAuthor(e.target.value)
	const changeContent = (e: ChangeTextarea) => setContent(e.target.value)
	const changePublished = () => setPublished(p => !p)

	const changeTab = (tab: Tab) => () => setTab(tab)

	const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const input = {
			id,
			title,
			slug,
			description,
			author,
			content,
			published,
			category: category ? FormatNew({name: category.label, id: category.value}) : undefined,
			tags: tags.map(t => FormatNew({name: t.label, id: t.value})),
		}

		try {
			await http.post(`/api/posts/${isEdit ? 'update' : 'store'}`, input)
			await router.push('/dashboard/posts')
		} catch (err) {
			// TODO: display errors
		}
	}

	return (
		<div className="py-2 px-4 flex-1 flex flex-col">
			<div className="py-2 flex">
				<Link href="/dashboard/posts" className="btn bg-black text-white">Back</Link>
			</div>

			<div className="flex space-x-2">
				<button onClick={changeTab('info')} className="btn bg-orange-300">
					Info
				</button>
				<button onClick={changeTab('content')} className="btn bg-orange-300">
					Content
				</button>
			</div>

			<form onSubmit={onsubmit} className="flex-pass-col">
				{/*Info*/}
				<div className={`space-y-2 mx-auto w-full xl:max-w-6xl ${tab !== 'info' ? 'hidden' : ''}`}>
					<div>
						<label htmlFor="title">Title</label>
						<input value={title} onChange={changeTitle} id="title" type="text" name="title" required
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</div>

					<div>
						<label htmlFor="slug">Slug</label>
						<input value={slug} onChange={changeSlug} id="slug" type="text" name="slug"
									 placeholder="Auto-Generated"
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</div>

					<div>
						<label htmlFor="description">Description</label>
						<textarea value={description} onChange={changeDescription} id="description" name="description"
											className="rounded-sm shadow-md px-2 py-1 w-full"
						/>
					</div>

					<div>
						<label htmlFor="author">Author</label>
						<input value={author} onChange={changeAuthor} id="author" type="text" name="author"
									 placeholder={process.env.NEXT_PUBLIC_DEFAULT_AUTHOR}
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</div>

					<div>
						<label htmlFor="published" className="inline mr-4">Published</label>
						<input checked={published} onChange={changePublished} id="published" type="checkbox" name="published"/>
					</div>

					<div>
						<label htmlFor="category" className="inline mr-4">Category</label>
						<Select value={category} isClearable id="category" name="category"
										options={allCategories.map(c => ({label: c.name, value: c.id}))}
										onChange={(v: any) => setCategory(v)}
										placeholder="Select Category..."
						/>
					</div>

					<div>
						<label htmlFor="tags">Tags</label>
						<Select value={tags} isMulti isClearable id="tags" name="tags[]"
										onChange={v => setTags([...v])}
										options={allTags.map(t => ({value: t.id, label: t.name}))}
										placeholder="Select Tag..."
						/>
					</div>

					<input type="submit" value={isEdit ? 'Update' : 'Create'}
								 className="btn bg-blue-500 max-w-max mx-auto my-2"/>
				</div>

				{/*Content*/}
				<div className={`flex-row flex-1 px-0 py-2 ${tab === 'content' ? 'flex' : 'hidden'}`}>
					<div className="flex-pass-col">
              <textarea value={content} onChange={changeContent} id="content" name="content" required
												className=" w-full flex-1 p-1 rounded-sm shadow-lg"
							/>
					</div>
					<div className="flex-1 ml-4">
						<MDXViewer content={content}/>
					</div>
				</div>

			</form>

		</div>
	)
}

export default FormPost
