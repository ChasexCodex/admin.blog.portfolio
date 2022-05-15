type ID = number
type TimeStamp = {
  created_at: Date
  updated_at: Date
}
type StringTimeStamp = {
  created_at: string
  updated_at: string
}

export type Post = StringTimeStamp & {
  id: ID
  title: string
  slug: string
  content: string
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

export type PostRelations = {
  category: Category
  tags: Tag[]
}

export type PostWithRelations = Post & PostRelations

export type PostModel = Omit<Post, keyof StringTimeStamp> & TimeStamp & {categoryId: number}

export type PostModelWithRelations = PostModel & PostRelations

interface SuccessResult<T> {
  data: T
  success: true
}

interface ErrorResult {
  error: any
  success: false
}

export type ApiResult<T> = SuccessResult<T> | ErrorResult
