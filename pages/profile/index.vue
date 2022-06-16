<template>
  <view class="container">
    <!-- 头像区域 -->
    <view class="avatar">
      <image class="img" src="/static/images/icon/user_avatar_icon.png" mode=""></image>
      <view>
        <!-- <view class="name" :class="rtcFail ? 'rtc-fail' : ''">{{userData.username}}</view> -->
        <view class="name">
          <view class="rtc-status" :class="rtcFail ? 'rtc-fail' : ''"></view>
          <view>{{userData.username }}</view>
        </view>
        <view class="company">{{(userData.constructionUnit && userData.constructionUnit.unitName) ? userData.constructionUnit.unitName : '无'}}</view>
      </view>
    </view>
    <!-- 账号信息 -->
    <view class="information">
      <view class="common">
        <image class="img" src="/static/images/icon/user_account_icon.png" mode=""></image>
        <view class="text">账号名</view>
        <view class="content">{{userData.loginName ? userData.loginName : '无'}}</view>
      </view>
      <view class="common">
        <image class="img" src="/static/images/icon/user_role_icon.png" mode=""></image>
        <view class="text">人员角色</view>
        <view class="content">负责人</view>
      </view>
      <view class="common">
        <image class="img" src="/static/images/icon/user_phone_icon.png" mode=""></image>
        <view class="text">手机号</view>
        <view class="content">{{userData.phone ? userData.phone : '无'}}</view>
      </view>
      <view class="common">
        <image class="img" src="/static/images/icon/version_icon.png" mode=""></image>
        <view class="text">版本信息</view>
        <view class="content">{{version}}</view>
      </view>
    </view>
    <view class="logout" @click="clickLogout">退出</view>
    <!-- 登出弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showLogoutModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>您确定要退出系统吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="cancelLogout">取消</u-button>
          <u-button class="confirm" v-if="isCommiting" @click="confirmLogout" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        showLogoutModal: false,
        isCommiting: true,
        userData: {},
        version: null,
        rtcFail: true
      }
    },
    onShow() {
      this.userData = this.$userlogin.getUser()
      this.getVersion()
      this.changeRtmStatus()
      console.log(this.userData, '******');
    },
    methods: {
      // 根据RTM状态显示名字为红色还是白色 红色为rtm登录失败
      changeRtmStatus() {
        const val = this.$store.state.rtmLoginStatus
        this.rtcFail = !val
        console.log(val, 'rtm值');
      },
      // 点击显示退出弹窗
      clickLogout() {
        this.showLogoutModal = true
      },
      // 确认退出
      confirmLogout() {
        this.$userlogin.logout()
        this.$store.dispatch('upDataUId', '999999999'); // 销毁rtc账号
        this.$store.commit('startRtm', 0);
        console.log('退出了');
      },
      // 取消退出
      cancelLogout() {
        this.showLogoutModal = false
      },
      // 获取版本信息
       getVersion() {
        const _this = this
        plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
          _this.version = wgtinfo.version
          console.log(wgtinfo, 'wgtinfowgtinfo');
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  .container {
    height: 100vh;
    background-color: #F0F5F6;
  }
  .desc {
    text-align: center;
    color: #0ab8a2;
  }

  // 头像
  .avatar {
    width: 750rpx;
    // height: 231rpx; 231 + 120
    height: 350rpx;
    padding-top: 120rpx;
    padding-left: 44rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: #05C4AC;
    color: #FFFFFF;

    .img {
      width: 140rpx;
      height: 140rpx;
      border-radius: 70rpx;
      margin-right: 45rpx;
    }

    .name {
      margin-bottom: 19rpx;
      font-size: 34rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      display: flex;
      align-items: center;
      .rtc-status {
        width: 20rpx;
        height: 20rpx;
        margin-right: 10rpx;
        border-radius: 10rpx;
        background-color: #2979FF;
      }
    }
    .rtc-fail {
      background-color: #D0021B;
    }
  
    .company {
      font-size: 30rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
    }
  }

  // 信息
  .information {
    margin-top: 16rpx;
    background-color: #FFFFFF;

    .common {
      display: flex;
      height: 119rpx;
      align-items: center;
      padding: 0 40rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #D8D8D8;

      .img {
        width: 44rpx;
        height: 44rpx;
        margin-right: 22rpx;
      }

      .text {
        font-size: 34rpx;
        font-family: PingFangSC-Regular-, PingFangSC-Regular;
        font-weight: normal;
        color: #333333;
      }

      .content {
        margin-left: auto;
        font-size: 34rpx;
        font-family: PingFangSC-Regular-, PingFangSC-Regular;
        font-weight: normal;
        color: #999999;
      }
    }
  }

  .logout {
    // margin-top: 400rpx;
    // position: absolute;
    // bottom: 10rpx;
    
    margin-top: 17rpx;
    width: 750rpx;
    height: 119rpx;
    line-height: 119rpx;
    text-align: center;
    font-size: 34rpx;
    font-family: PingFangSC-Regular-, PingFangSC-Regular;
    font-weight: normal;
    background-color: #FFFFFF;
    color: #333333;
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
