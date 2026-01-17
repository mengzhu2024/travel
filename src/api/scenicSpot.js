import request from '@/utils/request'

export function query(param) {
  return request({
    url: 'api/scenic-spot/page',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function del(id) {
  return request({
    url: 'api/scenic-spot/delete?id=' + id,
    method: 'delete'
  })
}

export function tui() {
  return request({
    url: 'api/scenic-spot/tui',
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: 'api/scenic-spot/operate',
    method: 'post',
    data
  })
}

export function count() {
  return request({
    url: 'api/scenic-spot/count',
    method: 'get',
  })
}
export default { query, edit, del, tui, count }
