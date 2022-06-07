import {NextPage} from 'next'
import {InputLabel} from '@/components'
import {submission} from '@/utils'
import {useState} from 'react'

const Login: NextPage = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const onsubmit = async () => {

	}

	return (
		<form onSubmit={submission(onsubmit)}
					className="flex flex-col max-w-md w-full m-auto px-8 py-16 rounded shadow
										 dark:shadow-gray-600 dark:bg-black dark:text-white space-y-2">
			<InputLabel htmlFor="username" text="User Name">
				<input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)}
									className="dark:bg-gray-700 px-1 py-0.5"/>
			</InputLabel>
			<InputLabel htmlFor="password" text="Password">
				<input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}
									className="dark:bg-gray-700 px-1 py-0.5"/>
			</InputLabel>
			<input type="submit" value="Login"
						 className="btn outline outline-2 outline-green-500 hover:bg-green-500 duration-100"/>
		</form>
	)
}

export default Login