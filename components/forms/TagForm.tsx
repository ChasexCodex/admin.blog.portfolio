import {ChangeEvent} from 'react'
import {useState} from 'react'
import {convertBoolean, http, submission} from '@/utils'
import {useRouter} from 'next/router'
import {InputLabel, Link} from '@/components'
import {Errors, Tag} from '@/types'
import ErrorLine from '@/components/ErrorLine'
import {toast} from 'react-toastify'

type Props = {
	tag?: Tag
}

const TagForm = ({tag}: Props) => {

	const router = useRouter()
	const [name, setName] = useState(tag?.name ?? '')
	const [errors, setErrors] = useState<Errors>({})

	const onsubmit = () => {
		const isEdit = !!tag?.id

		const req = http.post(`/api/tags/${isEdit ? 'update' : 'store'}`, {name})

		toast.promise(req, {
			pending: convertBoolean(isEdit, 'Updating', 'Creating'),
			success: `${convertBoolean(isEdit, 'Updated', 'Created')} successfully`,
			error: `Error: failed to ${convertBoolean(isEdit, 'update', 'create')}`
		})
			.then(() => router.push('/dashboard/tags'))
			.catch(e => setErrors(e.response.data.errors))
	}

	const changeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)

	return (
		<div className="mx-4">
			<div className="flex my-2">
				<Link href="/dashboard/tags" className="btn bg-black text-white">Back</Link>
			</div>
			<form onSubmit={submission(onsubmit)} className="max-w-md">
				<InputLabel htmlFor="name" className="block mb-1 dark:text-white" text="Name">
					<input value={name} onChange={changeName} type="text" name="name" required
								 placeholder="Name..."
								 className="rounded-sm shadow block px-2 py-1 mb-1"
					/>
					<ErrorLine error={errors.name}/>
				</InputLabel>
				<input type="submit" value="Create" className="btn bg-green-500 mt-2"/>
			</form>
		</div>
	)
}

export default TagForm
