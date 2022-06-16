import request from '../request/request'
// 质量缺陷


// 查询是否已有安全督查
export function queryHasQuality(options) {
  return request({
    url: '/api/v2/quality/defect/query/wait/commit',
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
// 缺陷类型
export function getDefectType() {
  return request({
    url: '/api/v2/dict/query/quality.defect.type',
    method: 'GET'
  })
}
// 违章专业
export function getViolationSubject() {
  return request({
    url: '/api/v2/dict/query/defect.violation.subject',
    method: 'GET'
  })
}

// 质量缺陷新增或编辑
export function addOrEditQuality(options) {
  return request({
    url: '/api/v2/quality/defect/addOrEdit',
    method: 'POST',
    data: options
  })
}
// 质量缺陷提交
export function commitQuality(options) {
  return request({
    url: '/api/v2/quality/defect/app/submit',
    method: 'POST',
    data: options
  })
}
// 质量缺陷删除
export function deleteQuality(options) {
  return request({
    url: '/api/v2/quality/defect/delete',
    method: 'POST',
    data: options
  })
}
// 质量缺陷详情
export function getQualityDetail(options) {
  return request({
    // url: `/api/v2/safety/supervision/detail/${options}`,
    url: `/api/v2/quality/defect/detail/${options}`,
    method: 'GET',
  })
}
// 质量缺陷列表
export function getQualityList(options) {
  return request({
    url: '/api/v2/quality/defect/app/query/',
    method: 'POST',
    data: options
  })
}
// 质量缺陷列表历史
export function getQualityHistoryList(options) {
  return request({
    url: '/api/v2/quality/defect/app/query/history',
    method: 'POST',
    data: options
  })
}

// 整改详情
export function getRectifyDetail(options) {
  return request({
    url: `/api/v2/quality/defect/detail/${options}`,
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
    url: '/api/v2/quality/defect/solve',
    method: 'POST',
    data: options
  })
}
