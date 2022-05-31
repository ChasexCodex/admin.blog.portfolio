import {ChangeEvent, FormEvent} from 'react'
import {useState} from 'react'
import {http} from '@/utils'
import {useRouter} from 'next/router'
import {InputLabel, Link} from '@/components'
import {Category} from '@/types'

type Props = {
	category?: Category
}

const CategoryForm = ({category}: Props) => {

	const router = useRouter()
	const [name, setName] = useState(category?.name ?? '')

	const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			await http.post('/api/categories/store', {name})
			await router.push('/dashboard/categories')
		} catch (e) {
			console.log(e)
			// TODO: display errors
		}
	}

	const changeName = (e: ChangeEvent<HTMLInputElement>) => {
		return setName(e.target.value)
	}

	return (
		<div className="mx-4">
			<div className="flex my-2">
				<Link href="/dashboard/categories" className="btn bg-black text-white">Back</Link>
			</div>
			<form onSubmit={onsubmit}>
				<InputLabel htmlFor="name" className="block mr-4 mb-1 ml-2 dark:text-white" text="Name">
					<input value={name} onChange={changeName} type="text" name="name" required
								 placeholder="Name..."
								 className="rounded-sm shadow block px-2 py-1"
					/>
				</InputLabel>
				<input type="submit" value="Create" className="btn bg-green-500 mt-2"/>
			</form>
		</div>
	)
}

export default CategoryForm
