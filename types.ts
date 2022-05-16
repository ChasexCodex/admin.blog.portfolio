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

export type CanBeCreated<T> = {id: number} | T

export type CreatePostValidationResult = {
  title: string
  slug: string
  content: string
  author: string
  category: CanBeCreated<{name: string}>
  tags: CanBeCreated<{name: string}>[]
  published: boolean
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
