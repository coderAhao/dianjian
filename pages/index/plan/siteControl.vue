<template>
  <view class="contain">
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <!-- <view slot='navigatreText'>现场管控{{ projectData.isMajor ? '(重点工程)' : '(非重点工程)'}}</view> -->
        <view slot='navigatreText'>现场管控{{ isMajor ? '(重点工程)' : '(非重点工程)'}}</view>
      </NavigateBar>
    </u-sticky>
    <view class="head">
      <view @click="switchToQuality">
        <image class="title-bg" src="/static/images/img/control_quality.png"></image>
        <view class="text">质量缺陷</view>
        <view v-if="showQualityVal" class="show-text">(待提交)</view>
      </view>
      <view @click="switchToSafe">
        <image class="title-bg" src="/static/images/img/control_safe_check.png"></image>
        <view class="text">安全督查</view>
        <view v-if="showSafeVal" class="show-text">(待提交)</view>
      </view>
      <view>
        <image class="title-bg" src="/static/images/img/control_base_mes.png"></image>
        <view class="text">基本信息</view>
      </view>
    </view>
    <view class="situation" v-if="!isNewApply">
      <view class="title">
        <view class="title-text">
          <image class="icon" src="/static/images/icon/process_icon.png"></image>
          <view>流程进展情况</view>
        </view>
        <view class="more">更多</view>
      </view>
      <!-- 分割线 -->
      <view>
        <u-divider class="divider"></u-divider>
      </view>
      <!-- 修改开工资料 -->
      <view class="edit-information">
        <view class="content">
          <view class="status" :class="projectData.status">{{projectData.status | enumValueByKey($const.CHECK_STATUS)}}
          </view>
          <view class="type">{{projectData.type | enumValueByKey($const.PROJECT_TYPE)}}</view>
          <view class="line">|</view>
          <view class="time">{{$u.timeFormat(projectData.createTime, 'yyyy-mm-dd hh:MM:ss')}}</view>
        </view>
        <view class="edit-btn">
          <!-- 开工 -->
          <u-button class="btn-text" color="#0ab8a2" @click="clickEditApply"
            v-if="projectData.type == 'START' && (projectData.status == 'REJECT' || projectData.status == 'WAIT_COMMIT')">
            修改开工资料</u-button>
          <u-button class="btn-text" color="#0ab8a2" @click="resetClickCall"
            v-if="(projectData.type == 'START' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && isLoading">
            视频连线
          </u-button>
          <u-button class="btn-text loading-btn-text"
            v-if="(projectData.type == 'START' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && !isLoading">
            视频连线
          </u-button>
          <view class="pause-or-finish" v-if="projectData.type == 'START' && projectData.status == 'FINISH'">
            <u-button class="pause btn-text" color="#FD9414" @click="clickEditPause">间断申请</u-button>
            <u-button class="finish btn-text" color="#0ab8a2" @click="clickEditFinish">终结</u-button>
          </view>
          <!-- 间断 -->
          <u-button class="btn-text" color="#0ab8a2" @click="clickEditPause"
            v-if="projectData.type == 'PAUSE' && (projectData.status == 'REJECT' || projectData.status == 'WAIT_COMMIT')">
            修改间断资料</u-button>
          <u-button class="btn-text" color="#0ab8a2" @click="resetClickCall"
            v-if="(projectData.type == 'PAUSE' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && isLoading">
            视频连线
          </u-button>
          <u-button class="btn-text loading-btn-text"
            v-if="(projectData.type == 'PAUSE' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && !isLoading">
            视频连线
          </u-button>
          <u-button class="btn-text" v-if="projectData.type == 'PAUSE' && projectData.status == 'FINISH'"
            color="#0ab8a2" @click="clickEditApplyPuase">开工申请</u-button>
          <!-- 终结 -->
          <u-button class="btn-text" color="#0ab8a2" @click="clickEditFinish"
            v-if="projectData.type == 'STOP' && (projectData.status == 'REJECT' || projectData.status == 'WAIT_COMMIT')">
            修改终结资料</u-button>
          <u-button class="btn-text" color="#0ab8a2" @click="resetClickCall"
            v-if="(projectData.type == 'STOP' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && isLoading">
            视频连线
          </u-button>
          <u-button class="btn-text loading-btn-text"
            v-if="(projectData.type == 'STOP' && isMajor && (projectData.status == 'CHECK_ING' || projectData.status == 'WAIT_CHECK')) && !isLoading">
            视频连线
          </u-button>
        </view>
      </view>
    </view>
    <view class="apply-btn" v-else>
      <view class="no-data">
        <image class="no-data-img" src="/static/images/img/no_data_bg.png"></image>
        <view class="no-data-text">当前没有开工资料记录</view>
      </view>
      <u-button class="btn-text" color="#0ab8a2" @click="clickNewApply">开工申请</u-button>
    </view>
    <!-- 视频组件 -->
    <CallComponents ref="callRef" />
    <!-- 审核结果弹窗 -->
    <u-modal :show="showModal" :showConfirmButton="false" width="620rpx" height="556rpx">
      <view class="slot-content">
        <view class="call-check">
          <view v-if="this.callCheckVal">
            <image class="call-check-img" src="/static/images/img/call_pass.png"></image>
          </view>
          <view v-else>
            <image class="call-check-img" src="/static/images/img/call_reject.png"></image>
          </view>
          <view class="call-check-result">
            {{ projectData.type == 'START' ? '开工申请' : (projectData.type == 'PAUSE' ? '间断申请' : '终结申请') }}{{this.callCheckVal ? '通过！' : '驳回！'}}
          </view>
          <view class="call-check-name">{{ this.projectName || '无' }}</view>
          <view class="call-check-projectname">{{ this.planName || '无' }}</view>
          <u-button width="500rpx" color="#0ab8a2" @click="clickClose">关闭</u-button>
        </view>
      </view>
    </u-modal>
    <!-- 打电话异常提示 -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
  import {
    getPhoneList,
    getProjectData,
    getCallCheckResult
  } from '../../../api/index.js'
  import {
    getProjectDetail,
    queryHasSafe
  } from '../../../api/safe.js'
  import {
    // getProjectDetail,
    queryHasQuality
  } from '../../../api/quality.js'
  import CallComponents from 'components/call/callComponents.vue'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        phoneList: [],
        projectData: {
          status: 'REJECT'
        },
        projectId: null,
        projectDetailId: null, // 拉取项目详情的主键id 
        isNewApply: false,
        currentVal: 0,
        showModal: false,
        callCheckVal: false,
        projectName: null,
        planName: null,
        propStoreProjectData: {},
        intervalCall: null,
        intervalReject: null,
        intervalUnline: null,
        intervalNone: null,
        isMajor: false,
        showSafeVal: false,
        showQualityVal: false,
        isLoading: true
      }
    },
    components: {
      CallComponents,
      NavigateBar
    },
    onBackPress(options) {
      console.log(options, 'options')
      if (options && options.from === 'backbutton') {
        this.$u.route({
          type: 'tab',
          url: '/pages/index/index'
        })
      }
      return true
    },
    onShow() {
      const projectId = this.$store.state.currentProject.id
      if (projectId) {
        this.projectId = projectId
        this.getProjectData()
      }
      this.handleRecordVideo()
      this.getProjectDetail()
      
      this.$store.commit('saveSyncIData', {}) // 在此页面置空保存的I国网同步数据
    },
    methods: {
      // 重置loading
      resetLoading() {
        this.isLoading = true
      },
      // 通过constructionPlanId拉取详情
      getProjectDetail() {
        const constructionPlanId = this.$store.state.currentProject.id
        getProjectDetail(constructionPlanId).then(res => {
          console.log(res, '获取的详情')
          if (res.code === 200) {
            const data = res.data
            const {
              charger,
              projectId
            } = {
              ...data
            }
            const unitId = data.unit
            const queryObj = {
              charger,
              projectId,
              unitId
            }
            this.queryHasSafe({
              ...queryObj
            })
            this.queryHasQuality({
              ...queryObj
            })
          }
        }).catch(() => {})
      },
      // 查询是否已有安全督查 若有存其id拉详情时用 若无则不拉详情
      queryHasSafe(obj) {
        queryHasSafe(obj).then(res => {
          if (res.code === 200) {
            const data = res.data
            if (data.id) {
              this.showSafeVal = true
              this.$store.commit('saveSafeDetailId', data.id)
            } else {
              this.$store.commit('saveSafeDetailId', '')
            }
          }
        }).catch(() => {})
      },
      // 查询是否已有质量缺陷 若有存其id拉详情时用 若无则不拉详情
      queryHasQuality(obj) {
        queryHasQuality(obj).then(res => {
          if (res.code === 200) {
            const data = res.data
            if (data.id) {
              this.showQualityVal = true
              this.$store.commit('saveQualityDetailId', data.id)
            } else {
              this.$store.commit('saveQualityDetailId', '')
            }
          }
        }).catch(() => {})
      },
      // 跳转到安全督查
      switchToSafe() {
        uni.$u.route('/pages/index/safe/addSafe')
      },
      // 跳转到质量缺陷
      switchToQuality() {
        uni.$u.route('/pages/index/quality/addQuality')
      },
      // 通过项目id拉取项目详情
      getProjectData() {
        getProjectData(this.projectId).then(res => {
          console.log(res, 'resres获取的项目详情 这里有type这里有type这里有type这里有type这里有type');
          if (res.code === 200) {
            if (res.data) {
              this.projectData = res.data
              if (this.projectData) {
                this.isMajor = this.projectData.isMajor
              }
              this.projectDetailId = res.data.id
              const type = res.data.type
              this.$store.commit('saveSiteProjectType', type)
              this.getPhoneList()
            } else {
              this.isNewApply = true
            }
          }
        }).catch(() => {})
      },
      // 新建申请
      clickNewApply() {
        // type: 1新建
        uni.$u.route('/pages/index/plan/workApply')
      },
      // 修改开工申请
      clickEditApply() {
        uni.$u.route('/pages/index/plan/workApply')
      },
      // 间断转开工
      clickEditApplyPuase() {
        let projectData = {
          ...this.$store.state.currentProject,
          "type": 'START',
          "status": 'WAIT_COMMIT'
        }
        this.$store.commit('saveSiteControlItem', projectData)
        uni.$u.route('/pages/index/plan/workApply')
      },
      // 间断申请
      clickEditPause() {
        let projectData = {
          ...this.$store.state.currentProject,
          "type": this.projectData.type,
          "status": this.projectData.status
        }
        this.$store.commit('saveSiteControlItem', projectData)
        uni.$u.route('/pages/index/plan/pauseWorkApply')
      },
      // 终结
      clickEditFinish() {
        let projectData = {
          ...this.$store.state.currentProject,
          "type": 'STOP',
          "status": 'WAIT_COMMIT'
        }
        this.$store.commit('saveSiteControlItem', projectData)
        uni.$u.route('/pages/index/plan/finishWorkApply')
        // uni.$u.route('/pages/index/plan/workApply')
      },
      // 拉取电话列表
      getPhoneList() {
        const phoneV = this.$store.state.uid
        const processId = this.projectDetailId
        const params = {
          phoneV,
          processId
        }
        getPhoneList(params).then(res => {
          console.log(res, '电话列表');
          if (res.code === 200) {
            this.phoneList = res.data.sysUserList
            // this.phoneList = [
            //   {
            //     "id": 15,
            //     "username": "李学",
            //     "phone": 13861324209,
            //     "phoneV": 165171133211
            //   }, {
            //     "id": 36,
            //     "username": "朱勇",
            //     "phone": 13606136243,
            //     "phoneV": 165250892111
            //   },
            //   // {
            //   //   "id": 46,
            //   //   "username": "沈树康",
            //   //   "phone": 15716255228,
            //   //   "phoneV": 1157162552281
            //   // }
            // ]
            this.projectName = res.data.projectName
            this.planName = res.data.planName
            this.propStoreProjectData = res.data
          }
        }).catch(e => {
          console.log(e);
        })
      },
      // 每次打电话时都从第一个开始
      resetClickCall() {
        this.isLoading = false
        this.currentVal = 0
        this.clickCall()
      },
      // 拨打电话
      clickCall() {
        if (!this.phoneList.length) {
          this.$refs.uToast.show({
            type: 'default',
            icon: true,
            duration: 2000,
            message: "系统无指挥人员，不可拨打电话",
          })
          return
        }
        if (this.phoneList[this.currentVal] && this.phoneList[this.currentVal].phoneV) {
          const phone = this.phoneList[this.currentVal].phoneV
          console.log(phone, 'phonephonephone');
          this.$refs.callRef.call(phone)
          this.propStoreProjectData.toCallPhoneNum = phone
          // 直接把data传给vuex 电话界面按需展示
          this.$store.commit('showCallPageData', this.propStoreProjectData)
          this.$store.commit('changeAcceptCode', 1)
          this.handleRecordVideo(phone)
        }
      },
      // 处理录制视频需要的参数
      handleRecordVideo(phone) {
        const constructionPlanId = this.projectData.constructionPlanId
        const constructionProcessId = this.projectData.id
        const workPlanId = this.projectData.workPlanId
        const logType = 0 // 1音频 0视频
        const target = this.phoneList.find(item => item.phoneV == phone)
        const user = this.$userlogin.getUser()
        let answerUserId = null
        let answerUserPhone = null
        let cname = null
        let callUserId = user.id
        let callUserPhone = user.phoneV
        if (target) {
          answerUserId = target.id
          answerUserPhone = target.phoneV
          cname = target.phoneV
        }
        const obj = {
          constructionPlanId,
          constructionProcessId,
          workPlanId,
          logType,
          answerUserId,
          callUserId,
          cname,
          callUserPhone,
          answerUserPhone
        }
        // 把数据传给vuex进行视频录制
        this.$store.commit('startRecordVideo', obj)

      },
      // 呼叫失败时的回调 继续换下一个打
      failBack(obj) {
        this.currentVal += 1
        if (this.currentVal < this.phoneList.length) {
          this.clickCall()
        } else {
          /**
           * code 1 通话中 2 已拒绝 3 不在线 4无人接听
           * */
          // if (obj.code == 1 && this.currentVal >= this.phoneList.length) {
          //   if (!this.intervalCall) {
          //     this.intervalCall = setTimeout(() => {
          //       this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
          //       clearTimeout(this.intervalCall)
          //       this.intervalCall = null
          //       this.isLoading = true
          //     }, 10000)
          //     this.$refs.uToast.show({
          //       type: 'default',
          //       icon: true,
          //       duration: 2000,
          //       message: "用户正在通话中，请10s后再试",
          //     })
          //   }
          // }
          // if (obj.code == 2 && this.currentVal >= this.phoneList.length) {
          //   if (!this.intervalReject) {
          //     this.intervalReject = setTimeout(() => {
          //       this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
          //       clearTimeout(this.intervalReject)
          //       this.intervalReject = null
          //       this.isLoading = true
          //     }, 10000)
          //     this.$refs.uToast.show({
          //       type: 'default',
          //       icon: true,
          //       duration: 2000,
          //       message: "用户均已拒绝呼叫，请10s后再试",
          //     })
          //   }
          // }
          // if (obj.code == 3 && this.currentVal >= this.phoneList.length) {
          //   if (!this.intervalUnline) {
          //     this.intervalUnline = setTimeout(() => {
          //       this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
          //       clearTimeout(this.intervalUnline)
          //       this.intervalUnline = null
          //       this.isLoading = true
          //     }, 10000)
          //     this.$refs.uToast.show({
          //       type: 'default',
          //       icon: true,
          //       duration: 2000,
          //       message: "用户均不在线，请10s后再试",
          //     })
          //   }
          // }
          // if (obj.code == 4 && this.currentVal >= this.phoneList.length) {
          //   if (!this.intervalNone) {
          //     this.intervalNone = setTimeout(() => {
          //       clearTimeout(this.intervalNone)
          //       this.intervalNone = null
          //       this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
          //       this.isLoading = true
          //     }, 10000)
          //     this.$refs.uToast.show({
          //       type: 'default',
          //       icon: true,
          //       duration: 2000,
          //       message: "用户无人接听",
          //     })
          //   }
          // }
          this.$refs.uToast.show({
            type: 'default',
            icon: true,
            duration: 2000,
            message: "用户忙线中",
          })
          this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
          this.isLoading = true
        }
      },
      // 获取电话打完之后的结果
      getCallCheckResult() {
        const code = this.$store.state.uniAcceptCode
        if (code) {
          const processId = this.projectDetailId
          getCallCheckResult(processId).then(res => {
            if (res.code === 200) {
              const data = res.data
              if (data == 'FINISH') {
                this.callCheckVal = true
                this.showModal = true
              } else if (data == 'REJECT') {
                this.callCheckVal = false
                this.showModal = true
              }
              // this.callCheckVal = res.data === 'FINISH' ? true : false
            }
          }).catch(e => {
            console.log(e, 'eeeeeeeeeeeeeeeeeeeee');
          }).finally(() => {
            this.$store.commit('changeAcceptCode', 0)
            console.log('code', this.$store.state.uniAcceptCode);
          })
        }
      },
      // 关闭弹窗
      clickClose() {
        this.showModal = false
        this.currentVal = 0 // 重置 再次呼叫时再从第一个号码开始拨打
      },
      // 返回上一页
      toGoBack() {
        // uni.$u.route('/pages/index/index')
        this.$u.route({
          type: 'tab',
          url: '/pages/index/index'
        })
      }
    },
    onLoad(options) {
      this.isMajor = (options.riskLevel == '2' || options.riskLevel == '3') ? true : false
      uni.$on('callFailBack', this.failBack)
      uni.$on('callCheckResult', this.getCallCheckResult)
      uni.$on('manuallyHangUp', this.resetLoading)
    },
    onUnload() {
      uni.$off('callFailBack')
      uni.$off('callCheckResult')
      uni.$off('manuallyHangUp')
    }
  }
</script>
<style scoped lang="scss">
  page {
    // background-color: #f0f5f6;
    background-color: #68d7a0;
  }

  .btn-text {
    margin-top: 40rpx;
    font-size: 32rpx !important;
    font-family: PingFangSC-Regular, PingFang SC !important;
    font-weight: 400;
  }

  .loading-btn-text {
    background-color: #E7E7E7 !important;
    color: #999999 !important;
  }

  .contain {
    background-color: #f0f5f6;
    height: 100vh;
  }

  .head {
    display: flex;
    justify-content: space-between;
    padding: 28rpx 68rpx 41rpx;
    background-color: #FFFFFF;

    .text {
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      text-align: center;
    }

    .show-text {
      font-size: 26rpx;
      font-family: PingFangSC-Regular-, PingFangSC-Regular;
      font-weight: 400;
      color: #FF3260;
      text-align: center;
    }

    .title-bg {
      width: 144rpx;
      height: 144rpx;
    }
  }

  .detail {
    padding-top: 30rpx;
    text-align: center;
  }

  .situation {
    margin: 16rpx auto;
    padding-bottom: 40rpx;
    box-sizing: border-box;
    width: 720rpx;
    border-radius: 5rpx;
    background-color: #FFFFFF;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 34rpx 25rpx 21rpx 25rpx;

      .title-text {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 11rpx;
          width: 34rpx;
          height: 36rpx;
          transform: translateY(4rpx);
        }
      }

      .more {
        border: 1rpx solid #E1E1E1;
        padding: 2rpx 12rpx;
        height: 40rpx;
        line-height: 30rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }

    .divider {
      padding: 0;
      padding: 0 29rpx;
      margin: 0;
      margin-bottom: 40rpx;
    }

    .content {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      padding-left: 50rpx;
      // margin-bottom: 35rpx;

      .status {
        color: #FFFFFF;
        // background-color: #f53362;
        padding: 4rpx 18rpx;
        // padding-top: 2rpx;
        vertical-align: middle;
        // transform: translateX(5rpx);
        // box-sizing: border-box;
        border-radius: 5rpx;
        // height: 40px;
        // line-height: 40px;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        // letter-spacing: 1rpx;
      }

      .type {
        margin: 0 24rpx;
        font-weight: 500;
      }

      .time {
        color: #999999;
        font-size: 30rpx;
      }

      .line {
        color: #DCE5E6
      }

      .line {
        margin-right: 15rpx;
      }

      .WAIT_CHECK,
      .CHECK_ING {
        background-color: #347ff5;
      }

      .WAIT_COMMIT {
        background-color: #f9ac00
      }

      .REJECT {
        background-color: #f53362
      }

      .FINISH {
        background-color: #00c2a7
      }
    }

    .edit-btn {
      // margin-top: 35rpx;
      padding: 0 50rpx;

      .pause-or-finish {
        display: flex;
      }

      .pause {
        margin-right: 20rpx;
      }
    }
  }

  .apply-btn {
    padding: 0 50rpx;

    .no-data {
      padding-top: 297rpx;
      text-align: center;

      .no-data-img {
        width: 232rpx;
        height: 170rpx;
        margin-bottom: 30rpx;
      }

      .no-data-text {
        margin-bottom: 42rpx;
        height: 66rpx;
        line-height: 66rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .slot-content {
    padding: 0;
  }

  .call-check {
    width: 620rpx;
    // height: 556rpx;
    padding: 75rpx 30rpx 30rpx 40rpx;
    box-sizing: border-box;
    text-align: center;

    // background-color: #0ab8a2;
    .call-check-img {
      width: 125rpx;
      height: 123rpx;
      // margin-bottom: 23rpx;
    }

    .call-check-result {

      margin: 23rpx 0 35rpx 0;
      height: 48rpx;
      line-height: 48rpx;
      font-size: 34rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }

    .call-check-name,
    .call-check-projectname {
      // height: 40rpx;
      // line-height: 40rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    .call-check-projectname {
      margin-bottom: 52rpx;
    }
  }
</style>
