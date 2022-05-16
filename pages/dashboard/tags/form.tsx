import type {ChangeEvent, FormEvent} from 'react'
import {useState} from 'react'
import {http} from '@/utils'
import {useRouter} from 'next/router'
import {Link} from '@/components'

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
      <div className="mx-4">
        <div className="flex my-2">
          <Link href="/dashboard/tags" className="btn bg-black text-white">Back</Link>
        </div>
        <form onSubmit={onsubmit} encType="multipart/form-data">
          <div className="my-4">
            <label htmlFor="name" className="block mr-4 mb-1 ml-2">Name</label>
            <input value={name} onChange={changeName} type="text" name="name" required
                   placeholder="Name..."
                   className="rounded-lg shadow block px-2 py-1"
            />
          </div>
          <input type="submit" value="Create" className="btn bg-green-500"/>
        </form>
      </div>
  )
}

export default Form
