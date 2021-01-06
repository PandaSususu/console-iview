import axios from '@/libs/api.request'

const getInfo = async () => axios.get('/user/info')

export {
  getInfo
}
