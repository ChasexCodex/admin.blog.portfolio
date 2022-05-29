import {CategoryForm} from '@/components/forms'
import {Category} from '@/types'
import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'

type Props = {
	category: Category
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {

	if (!params || typeof params.id !== 'string') {
		return {notFound: true}
	}

	const category = await prisma.category.findFirst({
		where: {
			id: parseInt(params.id),
		},
	})

	return {
		props: {
			category,
		},
	}
}

const EditCategory = ({category}: Props) => {
	return <CategoryForm category={category}/>
}

export default EditCategory
