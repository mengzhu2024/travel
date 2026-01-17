import request from '@/utils/request'

export function query(param) {
  return request({
    url: 'api/scenic-order/page',
    method: 'post',
    data: JSON.stringify(param)
  })
}

export function del(id) {
  return request({
    url: 'api/scenic-order/delete?id=' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/scenic-order/operate',
    method: 'post',
    data
  })
}

export function count() {
  return request({
    url: 'api/scenic-order/count',
    method: 'get',
  })
}

export function totalPrice() {
  return request({
    url: 'api/scenic-order/totalPrice',
    method: 'get',
  })
}

export function dayAmount() {
  return request({
    url: 'api/scenic-order/dayAmount',
    method: 'get',
  })
}

export default { query, edit, del, count, totalPrice, dayAmount }
