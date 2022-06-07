import {NextPage} from 'next'
import {InputLabel} from '@/components'
import {submission} from '@/utils'
import {useState} from 'react'
import supabase from '@/utils/supabase'
import {AsyncReturnType} from '@/types'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import Cookie from 'js-cookie'

const Login: NextPage = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState<AsyncReturnType<typeof supabase.auth.signIn>['error'] | null>(null)

	const router = useRouter()

	const onsubmit = async () => {
		const res = await toast.promise(supabase.auth.signIn({email, password}), {
			pending: 'Signing in...',
			error: 'Error signing in',
		})

		if (res.error || !res.user) {
			return setError(res.error)
		}

		Cookie.set('Authorization', res.user.id)
		await router.push('/dashboard')
	}

	return (
		<form onSubmit={submission(onsubmit)}
					className="flex flex-col max-w-md w-full m-auto px-8 py-16 rounded shadow
										 dark:shadow-gray-600 dark:bg-black dark:text-white space-y-2">
			<InputLabel htmlFor="email" text="User Name">
				<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)}
							 className="dark:bg-gray-700 px-1 py-0.5"/>
			</InputLabel>
			<InputLabel htmlFor="password" text="Password">
				<input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}
							 className="dark:bg-gray-700 px-1 py-0.5"/>
			</InputLabel>
			<input type="submit" value="Login"
						 className="btn outline outline-2 outline-green-500 hover:bg-green-500 duration-100"/>
			{error &&
				<p className="outline outline-1 outline-red-400 rounded-sm p-1 bg-red-300">Error: {error.message}</p>
			}
		</form>
	)
}

export default Login