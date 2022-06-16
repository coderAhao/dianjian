import Vue from 'vue'
// 常量转换
Vue.filter('enumValueByKey', function (value, enumObj, key = 'desc') {
  if (value == null) {
    return ''
  }
  var target = ''
  Object.keys(enumObj).forEach(item => {
    const obj = enumObj[item]
    // if (obj.value === parseInt(value)) {
    if (obj.value == value) {
      target = obj[key]
    }
  })
  return target
})