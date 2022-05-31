import {ChangeEvent, FormEvent} from 'react'
import {useState} from 'react'
import {http} from '@/utils'
import {useRouter} from 'next/router'
import {InputLabel, Link} from '@/components'
import {Errors, Tag} from '@/types'
import {AxiosResponse} from 'axios'

type Props = {
	tag?: Tag
}

const TagForm = ({tag}: Props) => {

	const router = useRouter()
	const [name, setName] = useState(tag?.name ?? '')
	const [errors, setErrors] = useState<Errors>({})

	const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			await http.post('/api/tags/store', {name})
			await router.push('/dashboard/tags')
		} catch (e) {
			setErrors((e as AxiosResponse).data.errors)
		}
	}

	const changeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)

	return (
		<div className="mx-4">
			<div className="flex my-2">
				<Link href="/dashboard/tags" className="btn bg-black text-white">Back</Link>
			</div>
			<form onSubmit={onsubmit}>
				<InputLabel htmlFor="name" className="block mr-4 mb-1 ml-2 dark:text-white" text="Name">
					<input value={name} onChange={changeName} type="text" name="name" required
								 placeholder="Name..."
								 className="rounded-sm shadow block px-2 py-1 mb-1"
					/>
					{errors.name &&
						<p className="bg-red-500 max-w-max px-2 border border-gray-300">{errors.name}</p>
					}
				</InputLabel>
				<input type="submit" value="Create" className="btn bg-green-500 mt-2"/>
			</form>
		</div>
	)
}

export default TagForm
