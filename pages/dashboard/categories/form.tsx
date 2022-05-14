import type {ChangeEvent, FormEvent} from 'react'
import {useState} from 'react'
import {http} from '../../../utils/http'

const Form = () => {

  const [name, setName] = useState('')

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await http.post('/api/categories/store', {name})
    } catch (e) {
      console.log(e)
      // TODO: display errors
    }
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
