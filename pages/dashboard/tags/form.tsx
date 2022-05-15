import type {ChangeEvent, FormEvent} from 'react'
import React, {useState} from 'react'
import {http} from '../../../utils/http'
import {useRouter} from 'next/router'
import Link from 'next/link'

const Form = () => {

  const router = useRouter()
  const [name, setName] = useState('')

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await http.post('/api/tags/store', {name})
      await router.push('/dashboard/tags')
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
        <Link href="/dashboard/tags"><a>Back</a></Link>
        <form onSubmit={onsubmit} encType="multipart/form-data">
          <input type="text" value={name} onChange={changeName} required/>
          <input type="submit" value="Create"/>
        </form>
      </div>
  )
}

export default Form
