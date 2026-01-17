import request from '@/utils/request'
// 下载文件
export function downloadFile(fileUrl, name) {
  request({
    url: 'api/download-file?fileUrl=' + fileUrl,
    method: 'get',
    responseType: 'blob',
  }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })

}
