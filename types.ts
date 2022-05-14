type ID = string
type TimeStamp = string

export type Post = {
  id: ID
  title: string
  slug: string
  content: string
  created_at: TimeStamp
  updated_at: TimeStamp
  author: string
  published: boolean
}

export type Category = {
  id: ID
  name: string
}

export type Tag = {
  id: ID
  name: string
}


interface SuccessResult<T> {
  data: T
  success: true
}

interface ErrorResult {
  error: any
  success: false
}

export type ApiResult<T> = SuccessResult<T> | ErrorResult
