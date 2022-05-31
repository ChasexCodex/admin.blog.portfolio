import {useEffect, useState} from 'react'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'
import 'github-markdown-css/github-markdown.css'

type Props = {
	content: string
}

const ViewMDX = ({content}: Props) => {
	const [source, setSource] = useState<MDXRemoteSerializeResult | null | 'error'>(null)

	useEffect(() => {
		(async () => {
			const render = matter(content).content

			return await serialize(render)
		})()
			.catch(err => serialize(err.toString()))
			.then(setSource)
			.catch(_ => setSource('error'))
	}, [content])

	if (!content) {
		return (
			<p className="w-full text-center text-4xl dark:text-white">
				Write something...
			</p>
		)
	}

	if (source === 'error') {
		return (
			<p className="w-full text-center text-4xl dark:text-white">
				An error occurred
			</p>
		)
	}

	return (
		<div className="flex-pass-col">
			<article className="flex-1 p-4 markdown-body rounded-md">
				{source && <MDXRemote {...source}/>}
			</article>
		</div>
	)
}

export default ViewMDX
