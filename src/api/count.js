import axios from '@/libs/api.request'

// 首页数据统计
const homeCount = () => axios.get('/admin/home-count')

export {
  homeCount
}
