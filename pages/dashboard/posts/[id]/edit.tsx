import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'
import {PostForm} from '@/components/forms'
import {Category, PostModelWithRelations, Tag} from '@/types'
import {convertTimestampToMoment} from '@/utils'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
	if (!params) {
		return {notFound: true}
	}

	const id = parseInt(params.id)

	const categories = await prisma.category.findMany()
	const tags = await prisma.tag.findMany()

	const res = await prisma.post.findUnique({
		where: {id},
		include: {tags: true, category: true},
	})

	if (!res) {
		return {notFound: true}
	}

	const post = convertTimestampToMoment(res)

	return {
		props: {
			post,
			categories,
			tags,
			id,
		},
	}
}

type Props = {
	post: PostModelWithRelations
	categories: Category[]
	tags: Tag[]
	id: string
}

const EditPost = ({id, ...props}: Props) => <PostForm {...props} id={id}/>

export default EditPost
