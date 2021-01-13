import axios from '@/libs/api.request'

import qs from 'qs'

// 获取帖子列表
const getList = (options) => {
  return axios.post('/post/post-list', options)
}

// 删除帖子
const deletePost = (id) => {
  return axios.get('/post/delete?' + qs.stringify(id))
}

// 更新帖子
const updatePost = (options) => {
  return axios.post('/post/update-admin', options)
}

export {
  getList,
  deletePost,
  updatePost
}
