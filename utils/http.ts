import axios from 'axios'

const http = axios.create({
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
	withCredentials: true,
})

export {http, api, axios}
