import {CategoryForm} from '@/components/forms'
import {Category} from '@/types'
import {GetServerSideProps} from 'next'
import {prisma} from '@/prisma'

export const getServerSideProps: GetServerSideProps<any, {id: string}> = async ({params}) => {
	if (!params) {
		return {notFound: true}
	}

	const category = await prisma.category.findUnique({
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

type Props = {
	category: Category
}

const EditCategory = ({category}: Props) => <CategoryForm category={category}/>

export default EditCategory
