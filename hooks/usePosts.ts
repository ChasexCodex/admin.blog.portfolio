import {useFetch} from './'
import type {Post, ApiResult} from '@/types'

const usePosts = (offset: number, limit: number) => {
	const {data, error} = useFetch('/api/posts')
	return {
		result: data as ApiResult<Post[]>,
		isLoading: !error && !data,
		isError: error,
	}
}
export default usePosts
