import {ChangeEvent, FormEvent, useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {PostModelWithRelations, Category, Tag, AnyObject} from '@/types'
import {MDXViewer, Link, InputLabel, ReactiveImage} from '@/components'
import Select from 'react-select/creatable'
import {FormatNew, FormatOld, http} from '@/utils'
import {Store, localStoreSupported} from '@/utils/store'
import _ from 'lodash'
import {useEffectOnce} from '@/hooks'
import Dropzone from 'react-dropzone'

const PostStore = new Store('posts')

type Props = {
	post?: PostModelWithRelations
	categories: Category[]
	tags: Tag[]
	id: string
}

type ChangeInput = ChangeEvent<HTMLInputElement>
type ChangeTextarea = ChangeEvent<HTMLTextAreaElement>
type Tab = 'info' | 'content'

const FormPost = ({post, categories: allCategories, tags: allTags, id}: Props) => {
	const isEdit = id !== 'new'

	const router = useRouter()

	// Input
	const [title, setTitle] = useState(post?.title ?? '')
	const [slug, setSlug] = useState(post?.slug ?? '')
	const [description, setDescription] = useState(post?.description ?? '')
	const [author, setAuthor] = useState(post?.author ?? '')
	const [content, setContent] = useState(post?.content ?? '')
	const [published, setPublished] = useState(post?.published ?? false)
	const [category, setCategory] = useState(post?.category ? FormatOld(post.category) : null)
	const [tags, setTags] = useState(post?.tags?.map(t => ({value: t.id, label: t.name})) ?? [])
	const [thumbnail, setThumbnail] = useState<string | File | null>(post?.thumbnail ?? null)

	const changeTitle = (e: ChangeInput) => setTitle(e.target.value)
	const changeSlug = (e: ChangeInput) => setSlug(e.target.value)
	const changeDescription = (e: ChangeTextarea) => setDescription(e.target.value)
	const changeAuthor = (e: ChangeInput) => setAuthor(e.target.value)
	const changeContent = (e: ChangeTextarea) => setContent(e.target.value)
	const changePublished = () => setPublished(p => !p)

	// Controls
	const [tab, setTab] = useState<Tab>('info')

	const changeTab = (tab: Tab) => () => setTab(tab)

	const getInput = useCallback(() => ({
		id,
		title,
		slug,
		description,
		author,
		content,
		published,
		category,
		tags,
	}), [
		id,
		title,
		slug,
		description,
		author,
		content,
		published,
		category,
		tags,
	])

	useEffect(() => {
		if (!localStoreSupported()) return
		const saveDraft = (key: string) => () => {
			const payload = getInput()

			PostStore.saveToStore(key, payload)
		}

		const interval = setTimeout(saveDraft(id), 500)
		return () => clearTimeout(interval)
	}, [id, getInput])

	useEffectOnce(() => {
		const data = PostStore.loadFromStore(id)

		if (!data) return

		const input = getInput()

		if (_.isEqual(data, input)) return

		// TODO: diplay a pop up instead of browser dialog
		if (confirm('local draft has been found. Do you want to load it?')) {
			setTitle(data.title)
			setSlug(data.slug)
			setDescription(data.description)
			setAuthor(data.author)
			setContent(data.content)
			setPublished(data.published)
			setCategory(data.category)
			setTags(data.tags)
		}
	})

	const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const input = getInput()

		const data = {
			...input,
			category: input.category
				? FormatNew({name: input.category.label, id: input.category.value})
				: undefined,
			tags: input.tags.map(t => FormatNew({name: t.label, id: t.value})),
		} as AnyObject

		if (thumbnail instanceof File)
			data['thumbnail'] = thumbnail

		try {
			await http.post(`/api/posts/${isEdit ? 'update' : 'store'}`, data)
			PostStore.clearStore(id)
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
					<InputLabel htmlFor="title" text="Title">
						<input value={title} onChange={changeTitle}
									 id="title" type="text" name="title" required
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</InputLabel>

					<InputLabel htmlFor="slug" text="Slug">
						<input value={slug} onChange={changeSlug} id="slug" type="text" name="slug"
									 placeholder="Auto-Generated"
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</InputLabel>

					<InputLabel htmlFor="description" text="Description">
						<textarea value={description} onChange={changeDescription} id="description" name="description"
											className="rounded-sm shadow-md px-2 py-1 w-full"
						/>
					</InputLabel>

					<InputLabel htmlFor="author" text="Author">
						<input value={author} onChange={changeAuthor} id="author" type="text" name="author"
									 placeholder={process.env.NEXT_PUBLIC_DEFAULT_AUTHOR}
									 className="rounded-sm shadow-md px-2 py-1"
						/>
					</InputLabel>

					<InputLabel htmlFor="published" text="Published" className="inline mr-4">
						<input checked={published} onChange={changePublished} id="published" type="checkbox" name="published"/>
					</InputLabel>

					<InputLabel htmlFor="category" className="inline mr-4" text="Category">
						<Select value={category} isClearable id="category" name="category" instanceId={1}
										options={allCategories.map(c => ({label: c.name, value: c.id}))}
										onChange={(v: any) => setCategory(v)}
										placeholder="Select Category..."
						/>
					</InputLabel>

					<InputLabel htmlFor="tags" text="Tags">
						<Select value={tags} isMulti isClearable id="tags" name="tags[]" instanceId={2}
										onChange={v => setTags([...v])}
										options={allTags.map(t => ({value: t.id, label: t.name}))}
										placeholder="Select Tag..."
						/>
					</InputLabel>

					<InputLabel htmlFor="thumbnail" text="Thumbnail"
											className="max-w-max inline-block mr-2 mt-4 btn-style bg-green-400"
					>
						<Dropzone onDrop={file => setThumbnail(file[0])} maxFiles={1}
											multiple={false} accept={{'image/*': ['.jpeg', '.png']}}
						>
							{({getRootProps, getInputProps, acceptedFiles: files}) => (
								<section>
									<div {...getRootProps()} className="mt-2">
										<input id="thumbnail" name="thumbnail" {...getInputProps()}/>
										{files.length ?
											<ReactiveImage file={files[0]} alt="Thumbnail" className="w-full h-60 object-cover"/> :
											<div className="border-8 opacity-80 border-dashed w-full h-40 flex center text-4xl">
												<p className="opacity-50 font-extrabold">+</p>
											</div>
										}
									</div>
								</section>
							)}
						</Dropzone>
					</InputLabel>

				</div>

				{/*Content*/}
				<div className={`grid grid-cols-2 gap-x-4 flex-1 px-0 py-2 ${tab === 'content' ? 'flex' : 'hidden'}`}>
					<textarea value={content} onChange={changeContent} id="content" name="content" required
										className=" w-full flex-1 p-1 rounded-sm shadow-lg"
					/>
					<MDXViewer content={content}/>
				</div>

				<input type="submit" value={isEdit ? 'Update' : 'Create'}
							 className="btn bg-blue-500 max-w-max mx-auto my-2"/>
			</form>

		</div>
	)
}

export default FormPost
