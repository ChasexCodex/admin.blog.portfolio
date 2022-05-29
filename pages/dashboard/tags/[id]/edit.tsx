import {TagForm} from '@/components/forms'
import {Tag} from '@/types'
import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'

type Props = {
	tag: Tag
}

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
	if (!params) {
		return {notFound: true}
	}

	const tag = await prisma.tag.findFirst({
		where: {
			id: parseInt(params.id),
		},
	})

	return {
		props: {
			tag,
		},
	}
}

const EditTag = ({tag}: Props) => <TagForm tag={tag}/>

export default EditTag
