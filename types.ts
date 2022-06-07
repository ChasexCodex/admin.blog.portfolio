type ID = number
export type TimeStamp = {
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
	description: string
	content: string
	author: string
	published: boolean
	thumbnail: string
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

export type CanBeCreatedTag = CanBeCreated<{name: string}>
export type CanBeCreatedCategory = CanBeCreated<{name: string}>

export type CreatePostValidationResult = {
	title: string
	slug: string
	description: string
	content: string
	author: string
	category: CanBeCreatedCategory
	tags: CanBeCreatedTag[]
	published: boolean
	thumbnail: object
}

export type UpdatePostValidationResult = CreatePostValidationResult & {id: ID}

interface SuccessResult<T> {
	data: T
	success: true
}

interface ErrorResult {
	error: any
	success: false
}

export type ApiResult<T> = SuccessResult<T> | ErrorResult

export type AnyObject = {[p: string]: any}

export type Errors = {[name: string]: string}

export type Promiseable<T> = T | Promise<T>

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
	ReturnType<T> extends Promise<infer U> ? U : never