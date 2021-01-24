import qs from 'qs'

import axios from '@/libs/api.request'

// 首页数据统计
const homeCount = () => axios.get('/admin/home-count')

// 获取错误消息列表
const getErrors = (options) => axios.get('/admin/errors?' + qs.stringify(options))

// 删除错误消息
const delError = (ids) => axios.post('/admin/del-error', ids)

export {
  homeCount,
  getErrors,
  delError
}
