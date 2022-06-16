<!-- rtm 呼叫邀请页面 -->
<template>
  <view class="content">
    <!-- 拨打电话 -->
    <view class="invitate-call">
      <!-- 项目名称 -->
      <view class="project" v-if="this.type !== '被叫'">
        <view class="info">
          <view class="title">{{ projectData.planName }}</view>
          <!-- <view class="type" :class="projectData.type + '_BG'">{{ projectData.type | enumValueByKey($const.PROJECT_STATUS) }}</view> -->
          <view class="detail">{{ projectData.projectName }}</view>
          <view class="type">{{ projectData.type | enumValueByKey($const.PROJECT_TYPE) }}</view>
        </view>
      </view>
      <!-- 头像 -->
      <view class="">
        <image class="avatar" src="/static/images/img/call_avatar.png" mode=""></image>
      </view>
      <!-- 用户 uid 标识 -->
      <view class="identification">
        <view class="leader">{{ this.type !== '被叫' ? this.toCallPerson.username : this.callerData.username }}</view>
        <view class="phone">{{this.type !== '被叫' ? this.toCallPerson.phone : this.callerData.phone}}</view>
      </view>
      <!-- 等待邀请 -->
      <view class="tips" v-if="type !== '被叫'">等待对方接受邀请… </view>
      <view class="tips" v-else>待接听… </view>
      <!-- 挂断 -->
      <view class="hang-up">
        <image @click="cancelFn('手动挂断')" class="call-icon" :class="type === '被叫' ? 'hang-up-icon' : ''"
          src="/static/rtc/icon_hangup.png"></image>
        <image @click="acceptFn" v-if="type === '被叫'" class="call-icon" src="/static/rtc/icon_accept.png"></image>
      </view>
    </view>
    <!-- 挂断提示弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>您确定要挂断视频通话吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="handleCancelModal">取消</u-button>
          <u-button class="confirm" v-if="isCommiting" @click="handleConfirmModal" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
    
  </view>

</template>

<script>
  import {
    getCallerInformation
  } from '../../api/index.js'
  export default {
    onLoad(option) {
      if (option.info) {
        // 默认弹窗
        this.$store.dispatch('upDataPopubId', 'poPup-rtm');
        const oInfo = JSON.parse(option.info);
        this.mode = oInfo.mode;
        this.type = oInfo.type;
        this.uid = oInfo.uid;
      }
      let _this = this;
      uni.getSystemInfo({
        success: function(res) {
          _this.windowWidth = res.windowWidth;
          _this.windowHeight = res.windowHeight;
        }
      })
      uni.$on('cancelClearTimer', this.clearSettimeout)
    },
    onShow() {
      if (this.type !== '被叫') {
        this.projectData = this.$store.state.callPageData
        console.log(this.projectData, 'this.projectDatathis.projectData');
        if (this.projectData.sysUserList && this.projectData.sysUserList.length) {
          const target = this.projectData.sysUserList.find(item => item.phoneV == this.projectData.toCallPhoneNum)
          if (target) {
            this.toCallPerson = target
          }
        }
        this.test()
      } else {
        // 在这里处理 主叫的信息
        const id = this.$store.state.pcCallerNumber
        // this.clearSettimeout()
        this.getCallerInformation(id)
      }
    },
    data() {
      return {
        uid: '', // 用户 uid
        mode: '', // 呼叫方式：语音/视频
        type: '', // 呼叫类别：主叫/被叫
        windowHeight: 400,
        windowWidth: 200,

        current: 'rtm',
        network: false,

        networkEnd: null,
        projectData: {
          planName: '土建改造',
          type: '开工申请',
          projectName: '这里是具体的开工信息',
          sysUser: {
            username: '指挥员王石',
          }
        },
        toCallPerson: {},
        callerData: {},
        intervalCall: null,
        showModal: false,
        isCommiting: true,
      }
    },
    created() {
      // 断网后处理
      uni.onNetworkStatusChange((res) => {
        if (res.isConnected) {
          clearTimeout(this.networkEnd);
          let oTime = setInterval(() => {
            // RTM 重连后发送
            const od = this.$RTM.getLoginStatu();
            if (od.state == 3 && od.reason == 2) {
              clearInterval(oTime);
              // 断网重连发送状态信息
              console.log("断网重连发送状态信息");
              this.$RTM.networkReconnection();
            }
          }, 500)
        } else {
          this.networkEnd = setTimeout(() => {
            // 30s 无网络连接结束当前通话
            this.$RTM.networkEndCall();
          }, 30000);
        }
      });
    },
    onHide() {
      this.clearSettimeout()
    },
    onUnload() {
      this.clearSettimeout()
      uni.$off('cancelClearTimer')
      // uni.$off('receiverPcCall')
    },
    destroyed() {
      this.clearSettimeout()
    },
    onBackPress(options) {
      console.log(options, 'options****************************************')
      if (options && options.from === 'backbutton') {
        this.showModal = true
        return true
      }
    },
    methods: {
      // 网络异常弹窗弹窗
      showNetworkModal() {
        console.log('进来了');
        this.networkShowModal = true
      },
      // 关闭网络异常弹窗
      closeNetworkModal() {
        this.networkShowModal = false
        this.cancelFn('手动挂断')
      },
      // 点击弹窗隐藏
      handleCancelModal() {
        this.showModal = false
      },
      // 点击弹窗 挂断
      handleConfirmModal() {
        console.log("点击弹窗 挂断**************************")
        this.cancelFn('手动挂断')
      },
      // 清空定时器
      clearSettimeout() {
        console.log('页面隐藏了');
        if (this.intervalCall) {
          clearTimeout(this.intervalCall)
          this.intervalCall = null
        }
      },
      // 测试用set
      test() {
        const that = this
        if (!this.intervalCall) {
          this.intervalCall = setTimeout(() => {
            console.log("走到了定时器挂断***********************************")
            that.cancelFn()
            clearTimeout(that.intervalCall)
            that.intervalCall = null
            uni.$emit('callFailBack', {
              code: 4,
              mes: '被叫无人接听'
            })
          }, 20000)
        }
      },
      // 拉取来电人信息
      getCallerInformation(phoneV) {
        console.log(phoneV, '11111111111111');
        // const user = this.$userlogin.getUser()
        // const phoneV = user.phoneV
        getCallerInformation(phoneV).then(res => {
          console.log(res, 'res来电人信息');
          if (res.code === 200) {
            this.callerData = res.data.sysUser
          }
        }).catch(e => {
          console.log('拉取失败');
        })
      },
      // 挂断
      async cancelFn(options) {
        this.showModal = false
        if (options && options == '手动挂断' ) {
          uni.$emit('manuallyHangUp', {
            code: 4,
            mes: '被叫无人接听'
          })
        }
        console.log('点击了挂断');
        // 结束正在通话
        this.$Utils.restoreAll();
        if (this.type === "主叫") {
          // 主叫挂断(取消呼叫邀请)
          await this.$RTM.cancelLocalInvitation(this.uid);
          console.log(123456);
        } else {
          // 被叫挂断(拒绝对方的呼叫邀请)  
          console.log("被叫挂断(拒绝对方的呼叫邀请)", this.uid);
          await this.$RTM.refuseRemoteInvitation(this.uid);
        }
        // 发送挂断信息
        uni.$emit("sendMessageToPeer", {
          Cmd: 'EndCall',
          peerid: this.uid
        });
      },
      // 接听
      acceptFn() {
        this.current = 'rtc'
        this.clearSettimeout()
        this.$RTM.acceptRemoteInvitation(this.uid, {
          Mode: this.mode === '视频' ? 0 : 1, // 
          Conference: false, // p2p 呼叫
          UserData: "",
          SipData: "",
        });
      },
      // 转语音
      switchFn() {
        this.current = 'rtc'
        // 转语音并接受呼叫
        this.$RTM.acceptRemoteInvitation(this.uid, {
          Mode: 1, // 语音
          Conference: false, // p2p 呼叫
          UserData: "",
          SipData: "",
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    background: url(/static/images/img/calling_bg.png) no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    width: 100vw;
    height: 100vh;

    .invitate-call {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      // text-align: center;
      // justify-content: center;
      align-items: center;
      padding: 105rpx 30rpx 30rpx 40rpx;
      box-sizing: border-box;

      .info {
        // display: flex;
        // align-items: center;
        // justify-content: center;
        margin-bottom: 13rpx;
        // padding: 0 25rpx;

        .title {
          // width: 600rpx;
          // padding-left: 30rpx;
          box-sizing: border-box;
          margin-right: 18rpx;
          font-size: 34rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }

        .type {
          max-width: 150rpx;
          text-align: center;
          height: 44rpx;
          line-height: 44rpx;
          // padding: 2rpx 13rpx;
          // padding: 0 13rpx;
          border-radius: 10rpx;
          box-sizing: border-box;
          background-color: #01C1A9;

          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }

        .TO_START_BG {
          background-color: #0065FF;
        }

        .STOP_BG,
        .START_BG {
          background-color: #e07c9a;
        }

        .PAUSE_BG {
          background-color: #FD9414;
        }

        .START_REJECT_BG {
          background-color: #FF3260;
        }
      }

      .detail {
        width: 520rpx;
        margin: 20rpx 0;
        // box-sizing: border-box;
        // padding-left: 30rpx;
        // padding: 0 30rpx;
        // height: 40rpx;
        // line-height: 40rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* 头像 */
      .avatar {
        width: 272rpx;
        height: 272rpx;
        margin: 244rpx 0 38rpx 0;
      }

      // 用户 uid 标识
      .identification {
        color: #FFFFFF;

        .leader {
          height: 50rpx;
          line-height: 50rpx;
          font-size: 36rpx;
          text-align: center;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }

        .phone {
          margin-top: 20rpx;
          text-align: center;
          height: 38rpx;
          line-height: 38rpx;
          font-size: 30rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
        }
      }

      .tips {
        margin-top: 119rpx;
        height: 38rpx;
        font-size: 30rpx;
        line-height: 38rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #00A792;
      }

      .hang-up {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        // justify-content: space-around;

        .call-icon {
          // position: absolute;
          // left: 50%;
          // bottom: 174rpx;
          // transform: translateX(-65rpx);
          margin-top: 120rpx;
          width: 130rpx;
          height: 130rpx;
        }

        .hang-up-icon {
          margin-right: 120rpx;
        }
      }
    }
  }
  // 弹窗
  .modal-title {
    text-align: center;
    margin-bottom: 30rpx;
    color: #666666;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  
  .commit-modal-btn {
    display: flex;
    margin-top: 57rpx;
  
    .cancel {
      margin-right: 20rpx;
      // font-size: 32rpx;
      color: #0ab8a2;
      border: 1rpx solid #0ab8a2;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
</style>
