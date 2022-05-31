import {MDXRemote} from 'next-mdx-remote'
import matter from 'gray-matter'
import {GetServerSideProps} from 'next'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {PostWithRelations} from '@/types'
import {prisma} from '@/prisma'
import {Link} from '@/components'
import {ReactNode, useState} from 'react'
import {convertBoolean, convertTimestampToMoment, serialize} from '@/utils'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
	if (!params) {
		return {notFound: true}
	}

	const res = await prisma.post.findFirst({
		where: {id: parseInt(params.id)},
		include: {tags: true, category: true},
	})

	if (!res) {
		return {notFound: true}
	}

	const post = convertTimestampToMoment(res)

	const {content} = matter(post.content)
	const source = await serialize(content)

	return {
		props: {
			post,
			source,
		},
	}
}

const Row = ({name, value}: {name: string, value: ReactNode}) => (
	<tr className="odd:bg-gray-200 h-14">
		<td>{name}</td>
		<td>{value}</td>
	</tr>
)

type Props = {
	post: PostWithRelations,
	source: MDXRemoteSerializeResult
}

type Tab = 'info' | 'view'

const ViewPost = ({post, source}: Props) => {

	const [tab, setTab] = useState<Tab>('info')
	const changeTab = (tab: Tab) => () => setTab(tab)
	const components = {}

	return (
		<div className="p-4">
			<Link href="/dashboard/posts" className="btn bg-black text-white max-w-max">Back</Link>

			<div className="flex flex-row space-x-0.5 mt-8">
				<button onClick={changeTab('info')} className="btn bg-orange-500">Info</button>
				<button onClick={changeTab('view')} className="btn bg-orange-500">View</button>
			</div>

			{tab === 'info' &&
				<table className="table-auto w-full text-center shadow my-4">
					<tbody>
					<Row name="ID" value={post.id}/>
					<Row name="Title" value={post.title}/>
					<Row name="Slug" value={post.slug}/>
					<Row name="Author" value={post.author}/>
					<Row name="Published" value={convertBoolean(post.published)}/>
					<Row name="Category" value={
						<span className="pill bg-orange-400 text-sm">
							{post.category.name}
						</span>
					}/>
					<Row name="Tags" value={
						<div className="space-x-1">
							{post.tags.map(t => (
								<span key={t.id} className="tag">
									{t.name}
								</span>
							))}
						</div>
					}/>
					<Row name="Published" value={post.created_at}/>
					<Row name="Last edited" value={post.updated_at}/>
					</tbody>
				</table>
			}

			{tab === 'view' &&
				<div className="flex-pass-col my-4">
					<article className="flex-1 p-4 markdown-body">
						{source && <MDXRemote {...source} components={components}/>}
					</article>
				</div>
			}
		</div>
	)
}

export default ViewPost
