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
}
