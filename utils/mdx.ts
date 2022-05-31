import rehypeHighlight from 'rehype-highlight'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import {serialize as mdxSerialize} from 'next-mdx-remote/serialize'


export const serialize = (content: string) => {
	return mdxSerialize(content, {
		mdxOptions: {
			remarkPlugins: [
				remarkGfm
			],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						properties: {className: ['anchor']},
					},
					{behaviour: 'wrap'},
				],
				rehypeHighlight,
				rehypeCodeTitles,
			],
		},
	})
}