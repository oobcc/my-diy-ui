import request from '@/utils/request'

// 查询wx 端用户信息列表
export function listWxuser(query) {
  return request({
    url: '/wx/wxuser/list',
    method: 'get',
    params: query
  })
}

// 查询wx 端用户信息详细
export function getWxuser(userId) {
  return request({
    url: '/wx/wxuser/' + userId,
    method: 'get'
  })
}

// 新增wx 端用户信息
export function addWxuser(data) {
  return request({
    url: '/wx/wxuser',
    method: 'post',
    data: data
  })
}

// 修改wx 端用户信息
export function updateWxuser(data) {
  return request({
    url: '/wx/wxuser',
    method: 'put',
    data: data
  })
}

// 删除wx 端用户信息
export function delWxuser(userId) {
  return request({
    url: '/wx/wxuser/' + userId,
    method: 'delete'
  })
}
