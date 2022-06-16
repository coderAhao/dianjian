<template>
  <view class="body">
    <u-sticky>
      <view class="header">
        <view class="empty"></view>
        <view class="header-name">
          <image class="app-title" src="/static/images/img/app-title.png" alt="" />
        </view>
        <!-- <view class="message" @click="clickLogout"> -->
        <view class="message">
          <view class="img-container">
            <!-- <view class="message-number">99+</view> -->
          </view>
          <!-- <image class="message-img" src="/static/images/img/message.png" mode=""></image> -->
        </view>
      </view>
    </u-sticky>
    <!-- 登出弹窗 -->
    <u-modal :show="showLogoutModal" width="500rpx" :showCancelButton="true" :asyncClose="true" @confirm="confirmLogout"
      @cancel="cancelLogout">
      <view class="slot-content">登出系统</view>
    </u-modal>
    <view class="fixed">
      <view class="header-container">
        <!-- 搜索区域 -->
        <view class="search">
          <u-search placeholder="点击进行搜索" height="80rpx" shape="square" searchIcon="/static/images/icon/search_icon.png"
            searchIconSize="22" v-model="searchContent" clearabled :showAction="false" @clear="clearSearch">
          </u-search>
        </view>
      </view>
      <!-- 重要事项 -->
      <view class="matters">
        <view class="title">重要事项</view>
        <!-- 连接状态：{{ a }} <br>
        回调数据：{{ b }} <br>
        订阅状态：{{ safeC + safeD }} <br>
        <view>
          缺陷数据{{ JSON.stringify(defectData) }}
        </view>
        <view>
          安全数据{{ JSON.stringify(safeData) }}
        </view> -->
        <view class="total">
          <view class="quality" @click="switchQuality">
            <view class="desc">
              <text class="text">质量<i style="color: #F9810A;font-style:normal">缺陷</i>{{'(' + defectCount + ')'}}</text>
              <image class="more" src="/static/images/img/right_arrow.png" alt="" />
            </view>
            <view class="subtitle">控制存在缺陷</view>
          </view>
          <view class="safe" @click="switchSafe">
            <view class="desc">
              <text class="text">安全<i style="color: #0AAA96;font-style:normal">督查</i>{{'(' + safeCount + ')'}}</text>
              <image class="more" src="/static/images/img/right_arrow.png" alt="" />
            </view>
            <view class="subtitle">推进生产整治</view>
          </view>
        </view>
      </view>
      <view class="plan-title">施工计划（{{ this.projectCount }}）</view>
    </view>

    <!-- 施工计划 -->
    <view class="plan">
      <view v-for="item in planList" :key="item.id" @click="clickPlanItem(item)">
        <view class="detail">
          <!-- <view> -->
          <view class="info">
            <view class="info-title">
              <text class="time" v-if="getCurrentTime(item.planStartTime, item.planEndTime) == 2">当前</text>
              <text class="time abnormal" v-if="getCurrentTime(item.planStartTime, item.planEndTime) == 1">异常</text>
              <text class="info-name">{{item.name}}</text>
            </view>
          </view>
          <view class="project-name">{{item.projectName}}</view>
          <view class="project-time">
            <image class="icon" src="/static/images/icon/calendar.png" mode=""></image>
            <text
              class="text">{{$u.timeFormat(item.planStartTime, 'yyyy.mm.dd')}}-{{$u.timeFormat(item.planEndTime, 'yyyy.mm.dd')}}</text>
          </view>
          <u-divider class="divider" :dashed="true" v-if="item.processType != 'STOP'"></u-divider>
          <view class="apply" :class="item.processType" v-if="item.processType != 'STOP'">
            <view class="status-item" :class="item.processType + '_status_BG'">
              {{item.processType | enumValueByKey($const.STATUS_TYPE_SHOW)}}
            </view>
            <text class="text commited" v-if="item.processType == 'PAUSE'">请提交开工资料</text>
            <text class="text commited" v-if="item.processType == 'START_CHECK_ING' || item.processType == 'PAUSE_CHECK_ING' || item.processType == 'STOP_CHECK_ING'">资料审核中</text>
            <text class="text commited"
              v-if="item.processType == 'START_REJECT' || item.processType == 'PAUSE_REJECT' || item.processType == 'STOP_REJECT'">请修改提交资料</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 暂停提示弹窗 -->
    <u-modal class="modal" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="title">提示</view>
        <view class="text">
          {{ '此计划已暂停,请于规定时间内施工：' }}{{$u.timeFormat(showPauseStartTime, 'yyyy.mm.dd')}}-{{$u.timeFormat(showPauseEndTime, 'yyyy.mm.dd')}}
        </view>
        <view class="btn" @click="showModal = false">关闭</view>
      </view>
    </u-modal>

    <!-- 作为背景用 -->
    <view class="as-bg"></view>

  </view>
</template>
<script>
  import {
    getDetailList,
    getPolling
  } from '../../api/index.js'
  import WebSocket from '../../socket/websocket-uni.js'
  import UserLogin from '../../common/userlogin.js'

  export default {
    data() {
      return {
        searchContent: '',
        currentTime: null,
        planList: [],
        query: {
          page: 1,
          limit: 10
        },
        projectCount: 0,
        showLogoutModal: false,
        safeCount: 0,
        defectCount: 0,
        showModal: false,
        showPauseStartTime: null,
        showPauseEndTime: null,
        safeData: null,
        defectData: null,
        a: null,
        b: null,
        safeC: null,
        safeD: null,
        timer: null,
      }
    },
    onLoad() {
      // this.getDetailList()
      uni.$on('clearPollingTimer', this.clearPolling)
    },
    onShow() {
      // this.connectSocket()
      this.query.page = 1
      this.getDetailList(true)
      // 电话已存储 触发一次RTM
      if (!this.$store.state.startRtmVal) {
        // this.$RTM.init();
        this.changeTrigger()
        this.$store.commit('startRtm', 1);
      }
      this.getPolling()
      this.startPolling()

    },
    onHide() {
      // WebSocket.disconnect()
      this.safeC = null
      this.safeD = null
      // this.clearPolling()
    },
    onUnload() {
      this.clearPolling()
      uni.$off('clearPollingTimer')
    },
    destroyed() {
      this.clearPolling()
    },
    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新下拉刷新下拉刷新下拉刷新下拉刷新下拉刷新下拉刷新');
      this.query.page = 1
      this.getDetailList(1)
    },
    // 快触底时加载更多
    onReachBottom() {
      this.query.page += 1
      this.getDetailList()
      console.log('chudile触底了触底了触底了触底了触底了触底了');
    },
    methods: {
      // 请求轮询
      getPolling() {
        getPolling().then(res => {
          console.log(res, '轮询的数据')
          if (res.code === 200) {
            const data = res.data
            // "qualityDefectCount": 2,
            // "safetySupervisionCount": 0
            if (this.safeCount < data.safetySupervisionCount || this.defectCount < data.qualityDefectCount) {
              let music = null;
              music = uni.createInnerAudioContext();
              music.src = '/static/rtc/message.mp3'
              music.play()
              music = null
            }
            this.safeCount = data.safetySupervisionCount
            this.defectCount = data.qualityDefectCount
          }
        }).catch(() => {})
      },
      // 开始轮询
      startPolling() {
        this.timer = setInterval(() => {
          this.getPolling()
        }, 60 * 1000)
      },
      // 清除轮询
      clearPolling() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
          this.safeCount = 0
          this.defectCount = 0
        }
      },
      // 连接socket
      connectSocket() {
        const that = this
        const id = this.$userlogin.getUser().id
        const header = {
          Authorization: 'Bearer ' + UserLogin.getToken()
        }
        WebSocket.init().then(client => {
          that.a = WebSocket.outputMes().aState
          that.b = WebSocket.outputMes().bState
          client.subscribe('/user/' + id + '/todo_solve_safety_supervision', function(res) {
            console.log('返回安全数据', JSON.parse(res.body));
            that.safeC = '进到安全订阅内部'
            const data = JSON.parse(res.body)
            that.safeData = data
            if (data.topic == 'todo_solve_safety_supervision') {
              that.safeCount = data.count
            }
          }, header)
          client.subscribe('/user/' + id + '/todo_solve_quality_defect', function(res) {
            console.log('返回缺陷数据', JSON.parse(res.body));
            that.safeD = '进到缺陷订阅内部'
            const data = JSON.parse(res.body)
            that.defectData = data
            if (data.topic == 'todo_solve_quality_defect') {
              that.defectCount = data.count
            }
          })
        }).catch(e => {
          console.log('连接错误');
        })
      },
      // 点击显示退出弹窗
      clickLogout() {
        this.showLogoutModal = true
      },
      // 确认退出
      confirmLogout() {
        this.$userlogin.logout()
        console.log('退出了');
      },
      // 取消退出
      cancelLogout() {
        this.showLogoutModal = false
      },
      // 判断当前时间
      getCurrentTime(start, end) {
        const nowdate = new Date().getTime();
        if (nowdate < start) {
          return 3
        } else if (nowdate > end) {
          return 1
        } else {
          return 2
        }
        // if (nowdate > start && nowdate < end) {
        //   return true
        // } else {
        //   return false
        // }
        console.log(nowdate, 'nowdate');
      },
      // 拉取详情
      getDetailList(val) {
        getDetailList(this.query).then(res => {
          console.log(res, '1111111111111111111111');
          if (res.code === 200) {
            console.log(res, 'deetail');
            // this.planList = res.data
            // 下拉刷新时置空数组
            if (val) {
              this.planList = []
              setTimeout(() => {
                uni.stopPullDownRefresh()
              }, 200)
            }
            this.planList.push(...res.data)
            this.projectCount = res.count
          }
        })
      },
      // 清空搜索
      clearSearch() {
        this.searchContent = ''
      },
      // 跳转到质量缺陷
      switchQuality() {
        uni.$u.route('/pages/index/quality/qualityList')
      },
      // 跳转到安全督查
      switchSafe() {
        uni.$u.route('/pages/index/safe/safeList')
      },
      // 跳转到现场管控
      clickPlanItem(options) {
        console.log(options, 'options')
        const status = options.processType
        if (status === 'STATUS_TYPE_SHOW') {
          this.showPauseStartTime = options.suspendStartTime
          this.showPauseEndTime = options.suspendEndTime
          this.showModal = true
          return
        }
        const id = options
        // 保存当前项目到vuex中
        this.$store.commit('saveSiteControlItem', options)
        uni.$u.route('/pages/index/plan/siteControl', {
          ...options
        })
      },
      /**
       * 此方法中的代码原本是在RTC封装的App.vue中全局挂载触发一次
       * 但若在app.vue中会造成未登陆时this.$RTM.init()已触发,即已登陆RTM
       * 此时无法动态将登陆人的电话作为呼叫时的id
       * 动态修改登陆人id在rtm.js文件中
       * */
      changeTrigger() {
        console.log('onlaunch, 123456789');
        // 锁定横屏
        // plus.screen.lockOrientation("landscape-primary");  
        // 锁定竖屏  
        plus.screen.lockOrientation("portrait-primary");
        // 相机、麦克风权限
        this.$Utils.equipment();
        let oa = true;
        // 确保联网
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType !== "none") {
              this.$RTM.init();
              oa = false;
            } else {
              uni.showLoading({
                title: '联网中'
              });
            }
          }
        });
        uni.onNetworkStatusChange((res) => {
          if (res.isConnected) {
            uni.hideLoading();
            if (oa) {
              this.$RTM.init();
              oa = false;
            }
          } else {
            uni.showLoading({
              title: '联网中',
              mask: true
            });
          }
        });
        console.log('App Launch 初始化完成时触发');
      }
    }
  }
</script>
<style scoped lang="scss">
  .body {
    // height: 100vh;
    height: 100%;
    background-color: #F0f5f6;

    .as-bg {
      width: 100vw;
      height: 60vh;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: -999;
      background-color: #F0F5F6;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 91rpx 0 37rpx 0;
    background-image: url(/static/images/img/status_bg_top.png);
    background-repeat: no-repeat;
    background-size: cover;

    .header-name {
      .app-title {
        width: 150rpx;
        height: 36rpx;
      }
    }

    .empty {
      padding-right: 40rpx;
    }

    .header-name {
      text-align: center;
      color: #FFFFFF;
      font-size: 38rpx;
      font-family: HelloFont-WenYiHei, HelloFont;
      font-weight: normal;
    }

    .message {
      text-align: right;
      padding-right: 40rpx;

      .img-container {
        position: relative;
        width: 44rpx;
        height: 44rpx;
        background-image: url(/static/images/img/message.png);
        background-repeat: no-repeat;
        background-size: cover;

        .message-number {
          position: absolute;
          top: -14rpx;
          left: 22rpx;
          width: 46rpx;
          height: 28rpx;
          padding: 2rpx 6rpx 6rpx 8rpx;
          box-sizing: border-box;
          border-radius: 14rpx;
          background-color: #ff3260;
          color: #FFFFFF;
          // height: 24px;
          font-size: 20rpx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 28rpx;
        }
      }

      .message-img {
        width: 44rpx;
        height: 44rpx;
      }
    }
  }

  // 头部
  .header-container {
    background: url(../../static/images/img/status_bg_bottom.png) no-repeat;
    background-size: cover;
    // padding: 20rpx 0 58rpx 0;
    padding: 0 0 58rpx 0;
    box-sizing: border-box;

    // 搜索区域
    .search {
      padding: 0 24rpx;
      // margin: 43rpx 0 0 0;
    }
  }

  // 重要事项
  .matters {
    // width: 100%;
    // height: 422rpx;
    // transform: translateY(-20rpx);
    padding: 34rpx 24rpx 40rpx 24rpx;
    background-color: #ffffff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;

    .title {
      height: 45rpx;
      margin-left: 19rpx;
      margin-bottom: 13rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #171B1C;
      line-height: 45rpx;
    }

    .total {
      display: flex;
      justify-content: space-between;

      .quality,
      .safe {
        width: 341rpx;
        height: 300rpx;
        // margin-right: 20rpx;
        padding: 31rpx 0 0 30rpx;
        box-sizing: border-box;
        background-image: url(/static/images/img/quality_bg.png);
        background-repeat: no-repeat;
        background-size: cover;

        .desc {
          display: flex;
          align-items: center;

          .text {
            height: 50rpx;
            margin-right: 14rpx;
            line-height: 50rpx;
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #171B1C;
          }

          .more {
            width: 36rpx;
            height: 36rpx;
            display: inline-block;
          }
        }

        .subtitle {
          margin-top: 3rpx;
          height: 37rpx;
          line-height: 37rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }

      .safe {
        width: 340rpx;
        height: 300rpx;
        background-image: url(/static/images/img/safe_bg.png);
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

  .plan-title {
    // margin: 44rpx 0 13rpx 19rpx;
    padding: 44rpx 0 13rpx 43rpx;
    box-sizing: border-box;
    // height: 45rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    // line-height: 45rpx;
    background-color: #f0f5f6;
    // transform: translateY(-20rpx);
  }

  // 施工计划
  .plan {
    padding: 0 24rpx;
    background-color: #f0f5f6;

    .detail {
      background-color: #FFFFFF;
      // height: 300rpx;
      margin-bottom: 16rpx;
      padding: 44rpx 20rpx 30rpx 37rpx;
      box-sizing: border-box;
      border-radius: 10rpx;

      .info {
        display: flex;
        justify-content: space-between;

        .info-title {
          .time {
            // display: inline-block;
            padding: 1rpx 7rpx;
            margin-right: 16rpx;
            border-radius: 5rpx;
            background-color: #01c1a9;
            height: 50rpx;
            line-height: 50rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
          }

          .abnormal {
            background-color: #fd9414;
          }

          .info-name {
            height: 50rpx;
            line-height: 50rpx;
            font-size: 32rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
      }

      .project-name {
        margin: 21rpx 0 4rpx 0;
        // height: 42rpx;
        line-height: 44rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      .project-time,
      .apply {
        display: flex;
        align-items: center;

        .icon {
          width: 28rpx;
          height: 28rpx;
          display: inline-block;
          margin-right: 13rpx;
        }

        .text {
          height: 40rpx;
          line-height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }

      .project-time {
        margin-top: 20rpx;
      }

      .apply {
        display: flex;

        .status-item {
          padding: 5rpx 18rpx 5rpx 20rpx;
          margin-right: 17rpx;
          border-radius: 5rpx;
          // background-color: #2979FF;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          // height: 40rpx;
          // line-height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
        }

        .TO_START {
          color: #0065FF;
        }

        .TO_START_BG {
          background-color: #0065FF;
          // background-color: #f1f7ff;
        }

        .START_BG {
          background-color: #f1f7ff;
        }

        .STOP,
        .START {
          // color: #FF3260;
          color: #0065FF;
        }

        .STOP_BG,
        .START_BG {
          // background-color: #FF3260;
          background-color: #0065FF;
        }

        .PAUSE {
          color: #FD9414;
        }

        .PAUSE_BG {
          background-color: #FD9414;
        }

        .START_REJECT {
          color: #FF3260;
        }

        .START_REJECT_BG {
          background-color: #FF3260;
        }

        .FINISH {
          color: #0AAA96;
        }

        .FINISH_BG {
          background-color: #0AAA96;
        }

        .STOP_status_BG,
        .TO_START_status_BG,
        .START_status_BG {
          // background-color: #FFEAEF;
          // background-color: #FFf2f5;
          background-color: #f1f7ff;
        }

        .SUSPEND_status_BG,
        .PAUSE_status_BG,
        .PAUSE_REJECT_status_BG,
        .START_REJECT_status_BG,
        .STOP_REJECT_status_BG {
          background-color: #FEF4E7;
        }

        .FINISH_status_BG {
          background-color: #E5F8F6;
        }
      }

      .apply {
        .commited {
          color: #999999;
        }

        .no-commit {
          color: #FD9414;
        }
      }

      .STOP,
      .START,
      .TO_START {
        // color: #0065FF;
        color: #1575ff;
      }

      .SUSPEND,
      .PAUSE,
      .PAUSE_REJECT,
      .START_REJECT,
      .STOP_REJECT {
        color: #FD9414;
      }

      .FINISH {
        color: #0AAA96;
      }

      .divider {
        margin: 21rpx 0 24rpx 0 !important;
      }
    }

  }

  // 暂停弹窗
  .slot-content {
    width: 100%;
    text-align: left;
    box-sizing: border-box;

    .title {
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 40rpx;
    }

    .text {
      margin-bottom: 40rpx;
      font-size: 34rpx;
      font-weight: 400;
      min-height: 80rpx;
    }
  }

  .btn {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #0ab8a2;
    color: #FFFFFF;
  }
</style>
