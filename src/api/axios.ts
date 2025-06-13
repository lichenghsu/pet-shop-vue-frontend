import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://locahost:8080/api',
  timeout: 5000,
})

instance.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // (token) config.headers.Authorization = `Bearer ${token}`
  return config
},
  (error) => Promise.reject(error)
)

export default instance

