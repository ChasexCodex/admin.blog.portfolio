import CategoriesForm from '@/components/forms/categories-form'
import {Category} from '@/types'

type Props = {
  category: Category
}

const EditCategory = ({category}: Props) => {
  return <CategoriesForm category={category}/>
}

export default EditCategory
