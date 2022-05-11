import {useState} from 'react'
import {login} from '../utils/logging'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
      <div>
        <form method="POST" onSubmit={() => login(username, password)}>
          <label htmlFor="username">User Name:</label>
          <label htmlFor="password">Password:</label>
          <input type="email" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
          <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </form>
      </div>
  )
}

export default Login
