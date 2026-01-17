import request from '@/utils/request'

export function query(param) {
  return request({
    url: 'api/user/page',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function del(id) {
  return request({
    url: 'api/user/delete?id=' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/user/operate',
    method: 'post',
    data
  })
}

export function login(param) {
  return request({
    url: 'api/login',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function currentUser() {
  return request({
    url: 'api/current-user',
    method: 'get',
  })
}

export function count() {
  return request({
    url: 'api/user/count',
    method: 'get',
  })
}

export default { query, edit, del, login, currentUser, count }
