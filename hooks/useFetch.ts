import useSWR from 'swr'

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
    fetch(input, init).then(res => res.json())

const useFetch = (url: string) => {
  return useSWR(url, fetcher)
}

export default useFetch
