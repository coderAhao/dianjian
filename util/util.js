export default function checkPicStatus(arr) {
  const arrLength = arr.length
  let val = true
  for (let i = 0; i < arrLength; i++) {
    if (arr[i].length) {
      const target = arr[i].find(item => item.status && item.status !== 'success')
      if (target) {
        uni.showToast({
          title: '图片正在上传',
          icon: 'error',
          duration: 1500,
        })
        val = false
        break
      }
    }
  }
  return val
}
