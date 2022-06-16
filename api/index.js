import request from '../request/request'

// 轮询
export function getPolling(options) {
  return request({
    url: '/api/v2/safety/supervision/app/query/wait/solve/count',
    method: 'GET',
  })
}
// 登录
export function getLogin(options) {
  return request({
    url: '/api/v2/login',
    method: 'POST',
    data: options
  })
}
// 拉取详情列表
export function getDetailList(options) {
  return request({
    url: '/api/v2/construction/plan/phone/list',
    method: 'GET',
    data: options
  })
}
// 通过id拉取当前项目详情
export function getProjectData(options) {
  return request({
    // url: '/api/v2/construction/plan/phone/' + options,
    url: '/api/v2/construction/plan/phone/process/' + options,
    method: 'POST'
  })
}
// 获取被呼叫联系人电话列表
export function getPhoneList(options) {
  return request({
    url: '/api/v2/process/call',
    method: 'POST',
    data: options
  })
}
// 上传文件
export function getUpload(options) {
  return request({
    url: '/api/v2/file/upload',
    method: 'POST',
    data: options
  })
}
// 保存文件数据
export function saveFileData(options) {
  return request({
    url: '/api/v2/process/save',
    method: 'POST',
    data: options
  })
}
// 提交文件数据
export function commitFileData(options) {
  return request({
    url: '/api/v2/process/submit',
    method: 'POST',
    data: options
  })
}
// 拉取文件数据进行回显
export function getFileDataDetail(options) {
  return request({
    // url: '/api/v2/process/{type}/info/{constructionPlanId}',
    url: `/api/v2/process/${options.type}/info/${options.constructionPlanId}`,
    method: 'GET',
    // data: options
  })
}
// 打完电话之后的审核结果
export function getCallCheckResult(options) {
  return request({
    url: '/api/v2/process/audit/result/' + options,
    method: 'GET',
  })
}
// 视频录制开始
export function startRecordVideo(options) {
  return request({
    url: '/api/v2/video/record/start',
    method: 'POST',
    data: options
  })
}
// 视频录制结束
export function stopRecordVideo(options) {
  return request({
    url: '/api/v2/video/record/stop',
    method: 'POST',
    data: options
  })
}
// 拉取来电人信息
export function getCallerInformation(options) {
  return request({
    url: '/api/v2/process/phone/info/' + options,
    method: 'POST',
  })
}
// 拉取APP版本号
export function getVersion() {
  return request({
    url: '/api/v2/app/version',
    method: 'GET',
  })
}
// 拉取APP下载链接
export function getAppDownload() {
  return request({
    url: '/api/v2/app/upgrade/url',
    method: 'GET',
  })
}
// 判断能否同步
export function judgeSyncIOperate() {
  return request({
    url: '/api/v2/gird/judge/sync',
    method: 'GET',
  })
}
// 拉取同步I国网计划列表
export function getSyncIList(options) {
  return request({
    url: '/api/v2/gird/list',
    method: 'POST',
    data: options
  })
}
// 获取爬虫数据详情
export function getSyncIDetail(options) {
  return request({
    url: `/api/v2/gird/detail/${options}`,
    method: 'GET',
  })
}
// 同步爬虫数据详情
export function syncIOperate(options) {
  return request({
    url: `/api/v2/gird/sync/${options}`,
    method: 'GET',
  })
}