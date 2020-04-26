import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://192.168.56.1:5000/api/v1/',
  withCredentials: true,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

export default instance
