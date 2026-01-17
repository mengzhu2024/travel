import request from '@/utils/request'

export function query(param) {
  return request({
    url: 'api/hotel/page',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function del(id) {
  return request({
    url: 'api/hotel/delete?id=' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/hotel/operate',
    method: 'post',
    data
  })
}
export default { query, edit, del }