import useFetch from './useFetch'
import type {Post} from '../types'

const usePosts = (offset: number, limit: number) => {
  const {data, error} = useFetch('/api/posts')
  return {
    posts: data as Post[],
    isLoading: !error && !data,
    isError: error
  }
}
export default usePosts
