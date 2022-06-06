import {ChangeEvent} from 'react'
import {useState} from 'react'
import {convertBoolean, http, submission} from '@/utils'
import {useRouter} from 'next/router'
import {InputLabel, Link} from '@/components'
import {Category, Errors} from '@/types'
import ErrorLine from '@/components/ErrorLine'
import {toast} from 'react-toastify'

type Props = {
	category?: Category
}

const CategoryForm = ({category}: Props) => {

	const router = useRouter()
	const [name, setName] = useState(category?.name ?? '')
	const [errors, setErrors] = useState<Errors>({})

	const onsubmit = () => {
		const isEdit = !!category?.id

		const req = http.post(`/api/categories/${isEdit ? 'update' : 'store'}`, {name})

		toast.promise(req, {
			pending: convertBoolean(isEdit, 'Updating', 'Creating'),
			success: `${convertBoolean(isEdit, 'Updated', 'Created')} successfully`,
			error: `Error: failed to ${convertBoolean(isEdit, 'update', 'create')}`,
		})
			.then(() => router.push('/dashboard/categories'))
			.catch(e => setErrors(e.response.data.errors))
	}


	const changeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)

	return (
		<div className="mx-4">
			<div className="flex my-2">
				<Link href="/dashboard/categories" className="btn bg-black text-white">Back</Link>
			</div>
			<form onSubmit={submission(onsubmit)} className="max-w-md">
				<InputLabel htmlFor="name" className="block mb-1 dark:text-white" text="Name">
					<input value={name} onChange={changeName} type="text" name="name" required
								 placeholder="Name..."
								 className="rounded-sm shadow block px-2 py-1"
					/>
					<ErrorLine error={errors.name}/>
				</InputLabel>
				<input type="submit" value="Create" className="btn bg-green-500 mt-2"/>
			</form>
		</div>
	)
}

export default CategoryForm
