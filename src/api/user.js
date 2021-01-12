import qs from 'qs'

import axios from '@/libs/api.request'

// 获取用户信息
const getInfo = async () => axios.get('/user/info')

// 获取用户列表
const getUsers = async (options) => axios.get('/user/list?' + qs.stringify(options))

// 删除用户
const deleteUser = async (ids) => axios.post('/user/delete', ids)

// 更新用户
const updateUser = async (options) => axios.post('/user/admin-update', options)

// 校验用户名是否存在
const checkName = async (name) => axios.get('/user/check-name?' + qs.stringify({ name }))

// 校验邮箱是否存在
const checkEmail = async (email) => axios.get('/user/check-email?' + qs.stringify({ email }))

// 新增用户
const addUser = async (options) => axios.post('/user/add', options)

export {
  getInfo,
  getUsers,
  deleteUser,
  updateUser,
  checkName,
  checkEmail,
  addUser
}
