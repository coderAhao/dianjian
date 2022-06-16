import request from '../request/request'
// 安全督查


// 查询是否已有安全督查
export function queryHasSafe(options) {
  return request({
    url: '/api/v2/safety/supervision/query/wait/commit',
    method: 'POST',
    data: options
  })
}
// 拉取项目详情
export function getProjectDetail(options) {
  return request({
    url: `/api/v2/construction/plan/details/${options}`,
    method: 'GET'
  })
}
// 根据字典查询的数据
// 工作性质
export function getJobNature() {
  return request({
    url: '/api/v2/dict/query/supervise.job.nature',
    method: 'GET'
  })
}
// 违章类型
export function getViolationType() {
  return request({
    url: '/api/v2/dict/query/supervise.violation.type',
    method: 'GET'
  })
}
// 违章专业
export function getViolationSubject() {
  return request({
    url: '/api/v2/dict/query/violation.subject',
    method: 'GET'
  })
}
// 违章等级
export function getViolationLevel() {
  return request({
    url: '/api/v2/dict/query/supervise.violation.nature',
    method: 'GET'
  })
}
// 安全督查新增或编辑
export function addOrEditSafe(options) {
  return request({
    url: '/api/v2/safety/supervision/addOrEdit',
    method: 'POST',
    data: options
  })
}
// 安全督查提交
export function commitSafe(options) {
  return request({
    // url: `/api/v2/safety/supervision/submit/${options}`,
    url: '/api/v2/safety/supervision/app/submit',
    method: 'POST',
    data: options
  })
}
// 安全督查删除
export function deleteSafe(options) {
  return request({
    url: '/api/v2/safety/supervision/delete',
    method: 'POST',
    data: options
  })
}
// 安全督查详情
export function getSafeDetail(options) {
  return request({
    url: `/api/v2/safety/supervision/detail/${options}`,
    method: 'GET',
  })
}
// 安全督查列表
export function getSafeList(options) {
  return request({
    url: '/api/v2/safety/supervision/app/query/',
    method: 'POST',
    data: options
  })
}
// 安全督查列表历史
export function getSafeHistoryList(options) {
  return request({
    url: '/api/v2/safety/supervision/app/query/history',
    method: 'POST',
    data: options
  })
}

// 整改详情
export function getRectifyDetail(options) {
  return request({
    url: `/api/v2/safety/supervision/detail/${options}`,
    method: 'GET',
  })
}
// 流程详情
export function getProcessDetail(options) {
  return request({
    url: '/api/v2/process/log/query',
    method: 'POST',
    data: options
  })
}
// 提交整改
export function commitRectify(options) {
  return request({
    url: '/api/v2/safety/supervision/solve',
    method: 'POST',
    data: options
  })
}
