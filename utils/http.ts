import axios from 'axios'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export {http, axios}
