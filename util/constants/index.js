export const CHECK_STATUS = {
  WAIT_COMMIT: {
    value: 'WAIT_COMMIT',
    desc: '待提交'
  },
  WAIT_CHECK: {
    value: 'WAIT_CHECK',
    desc: '待审核'
  },
  CHECK_ING: {
    value: 'CHECK_ING',
    desc: '审核中'
  },
  REJECT: {
    value: 'REJECT',
    desc: '已驳回'
  },
  FINISH: {
    value: 'FINISH',
    desc: '已完成'
  },
}
export const PROJECT_TYPE = {
  TO_START: {
    value: 'TO_START',
    desc: '待开工'
  },
  START: {
    value: 'START',
    desc: '开工申请'
  },
  PAUSE: {
    value: 'PAUSE',
    desc: '间断申请'
  },
  STOP: {
    value: 'STOP',
    desc: '终结申请'
  },
  START_REJECT: {
    value: 'START_REJECT',
    desc: '开工驳回'
  }
}
export const STATUS_TYPE_SHOW = {
  TO_START: {
    value: 'TO_START',
    desc: '待开工'
  },
  START: {
    value: 'START',
    desc: '开工'
  },
  PAUSE: {
    value: 'PAUSE',
    desc: '间断'
  },
  START_REJECT: {
    value: 'START_REJECT',
    desc: '开工驳回'
  },
  PAUSE_REJECT: {
    value: 'PAUSE_REJECT',
    desc: '间断驳回'
  },
  STOP_REJECT: {
    value: 'STOP_REJECT',
    desc: '终结驳回'
  },
  SUSPEND: {
    value: 'SUSPEND',
    desc: '暂停'
  }
}
export const RECTIFY_STATUS = {
  WAIT_SOLVE: {
    value: 'WAIT_SOLVE',
    desc: '待整改'
  },
  WAIT_CONFIRM: {
    value: 'WAIT_CONFIRM',
    desc: '待审核'
  },
  REJECT: {
    value: 'REJECT',
    desc: '驳回待整改'
  },
  FINISH: {
    value: 'FINISH',
    desc: '审核通过'
  }
}
export default {
  CHECK_STATUS,
  PROJECT_TYPE,
  STATUS_TYPE_SHOW,
  RECTIFY_STATUS
}