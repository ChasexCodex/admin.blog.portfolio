import {FormEvent} from 'react'
import {Promiseable} from '@/types'

type Type = (callback: () => Promiseable<void>) => ((e: FormEvent<HTMLFormElement>) => void)

export const submission: Type = (callback) => (e) => {
  e.preventDefault()
	callback()
}