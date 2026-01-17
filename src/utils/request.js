import axios from 'axios'
import router from '../router'
import { Notification } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: '/',
  timeout: 30000
})

// request拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.headers["content-type"].indexOf('OCTET-STREAM') > 0) {
      return response.data
    } else if (!response.data.code || response.data.code === 0) {
      return response.data.data
    } else {
      Notification.error({
        title: response.data.msg,
        duration: 1000
      })
      return Promise.reject()
    }
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(error)
  }
)
export default service
