import type {ChangeEvent, FormEvent} from 'react'
import {useState} from 'react'
import {http} from '../../../utils/http'
import {useRouter} from 'next/router'

const Form = () => {

  const router = useRouter()
  const [name, setName] = useState('')

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await http.post('/api/tags/store', {name})
    } catch (e) {
      console.log(e)
      // TODO: display errors
    }

    await router.push('/dashboard/tags')
  }

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    return setName(e.target.value)
  }

  return (
      <div>
        <form onSubmit={onsubmit}>
          <input type="text" value={name} onChange={changeName} required/>
          <input type="submit" value="Create"/>
        </form>
      </div>
  )
}

export default Form
