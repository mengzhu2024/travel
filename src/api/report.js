import request from '@/utils/request'

export function query(param) {
  return request({
    url: 'api/report/page',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function del(id) {
  return request({
    url: 'api/report/delete?id=' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/report/operate',
    method: 'post',
    data
  })
}
export default { query, edit, del }