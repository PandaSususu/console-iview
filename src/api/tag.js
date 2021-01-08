import qs from 'qs'

import axios from '@/libs/api.request'

// 添加标签
const addTag = (options) => axios.post('/tag/add', options)

// 获取标签
const getTags = (options) => axios.get('/tag/get?' + qs.stringify(options))

// 删除标签
const deteleTag = (id) => axios.get('/tag/detele?' + qs.stringify(id))

// 更新标签
const updateTag = (options) => axios.post('/tag/update', options)

export {
  addTag,
  getTags,
  deteleTag,
  updateTag
}
