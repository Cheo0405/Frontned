import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://back-ingsoft-nzbv.onrender.com/api',
    withCredentials: true
})

export default instance