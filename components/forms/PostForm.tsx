import {ChangeEvent, useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {PostModelWithRelations, Category, Tag, AnyObject, Errors} from '@/types'
import {MDXViewer, Link, InputLabel, ReactiveImage} from '@/components'
import Select from 'react-select/creatable'
import {convertBoolean, FormatNew, FormatOld, api, submission} from '@/utils'
import {Store, localStoreSupported} from '@/utils/store'
import _ from 'lodash'
import {useEffectOnce} from '@/hooks'
import Dropzone from 'react-dropzone'
import ErrorLine from '@/components/ErrorLine'
import {toast} from 'react-toastify'

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
	const [errors, setErrors] = useState<Errors>({})

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

	const onsubmit = async () => {
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

		if (!isEdit) {
			data['id'] = undefined
			delete data['id']
		}

		const req = api.post(`/posts/${isEdit ? 'update' : 'store'}`, data)

		toast.promise(req, {
			pending: convertBoolean(isEdit, 'Updating', 'Creating'),
			success: `${convertBoolean(isEdit, 'Updated', 'Created')} successfully`,
			error: `Error: failed to ${convertBoolean(isEdit, 'update', 'create')}`,
		})
			.then(() => {
				PostStore.clearStore(id)
				router.push('/dashboard/posts')
			})
			.catch(e => setErrors(e.reponse.data.errors))
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

			<form onSubmit={submission(onsubmit)} className="flex-pass-col">
				{/*Info*/}
				<div className={`space-y-2 mt-2 w-full xl:max-w-2xl ${tab !== 'info' ? 'hidden' : ''}`}>
					<InputLabel htmlFor="title" text="Title" className="mb-1 dark:text-white">
						<input value={title} onChange={changeTitle}
									 id="title" type="text" name="title" required
									 className="rounded-sm shadow-md px-2 py-1"
						/>
						<ErrorLine error={errors.title}/>
					</InputLabel>

					<InputLabel htmlFor="slug" text="Slug" className="mb-1 dark:text-white">
						<input value={slug} onChange={changeSlug} id="slug" type="text" name="slug"
									 placeholder="Auto-Generated"
									 className="rounded-sm shadow-md px-2 py-1"
						/>
						<ErrorLine error={errors.slug}/>
					</InputLabel>

					<InputLabel htmlFor="description" text="Description" className="mb-1 dark:text-white">
						<textarea value={description} onChange={changeDescription} id="description" name="description"
											className="rounded-sm shadow-md px-2 py-1 w-full"
						/>
						<ErrorLine error={errors.description}/>
					</InputLabel>

					<InputLabel htmlFor="author" text="Author" className="mb-1 dark:text-white">
						<input value={author} onChange={changeAuthor} id="author" type="text" name="author"
									 placeholder={process.env.NEXT_PUBLIC_DEFAULT_AUTHOR}
									 className="rounded-sm shadow-md px-2 py-1"
						/>
						<ErrorLine error={errors.author}/>
					</InputLabel>

					<InputLabel htmlFor="published" text="Published" className="inline mr-4 mb-1 dark:text-white">
						<input checked={published} onChange={changePublished} id="published" type="checkbox" name="published"/>
						<ErrorLine error={errors.published}/>
					</InputLabel>

					<InputLabel htmlFor="category" text="Category" className="inline mr-4 mb-1 dark:text-white">
						<Select value={category} isClearable id="category" name="category" instanceId={1}
										options={allCategories.map(c => ({label: c.name, value: c.id}))}
										onChange={(v: any) => setCategory(v)}
										placeholder="Select Category..."
						/>
						<ErrorLine error={errors.category}/>
					</InputLabel>

					<InputLabel htmlFor="tags" text="Tags" className="mb-1 dark:text-white">
						<Select value={tags} isMulti isClearable id="tags" name="tags[]" instanceId={2}
										onChange={v => setTags([...v])}
										options={allTags.map(t => ({value: t.id, label: t.name}))}
										placeholder="Select Tag..."
						/>
						<ErrorLine error={errors.tags}/>
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
												<p className="opacity-50 font-extrabold dark:text-white">+</p>
											</div>
										}
										{typeof thumbnail === 'string' &&
											<img src={thumbnail} alt="Post Thumbnail"/>
										}
									</div>
								</section>
							)}
						</Dropzone>
						<ErrorLine error={errors.thumbnail}/>
					</InputLabel>

				</div>

				{/*Content*/}
				<div
					className={`grid-rows-2 gap-y-4 xl:grid-rows-none xl:grid-cols-2 xl:gap-x-4 flex-1 px-0 py-2 ${tab === 'content' ? 'grid' : 'hidden'}`}>
					<textarea value={content} onChange={changeContent} id="content" name="content" required
										className=" w-full flex-1 p-1 rounded-sm shadow-lg row-start-2 xl:row-start-auto dark:bg-stone-400"
					/>
					<MDXViewer content={content}/>
				</div>
				<ErrorLine error={errors.content}/>

				<input type="submit" value={isEdit ? 'Update' : 'Create'}
							 className="btn bg-blue-500 max-w-max mt-auto mb-2"/>
			</form>

		</div>
	)
}

export default FormPost
