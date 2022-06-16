<template>
  <view class="container">
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>同步I国网</view>
      </NavigateBar>
    </u-sticky>
    <view class="detail">
      <view class="info">请选择需要同步内容</view>
      <view class="list">
        <view class="item" v-for="item in list" :key="item.id">
          <view class="time">
            <image class="icon" src="/static/images/icon/calendar.png" />
            <!-- <text>{{$u.timeFormat(item.planStartTime, 'yyyy.mm.dd')}}-{{$u.timeFormat(item.planEndTime, 'yyyy.mm.dd')}}</text> -->
            <text>{{item.updateTime}}</text>
          </view>
          <u-divider class="divider" :dashed="true"></u-divider>
          <view class="item-detail">
            <view class="item-title">计划内容</view>
            <view>{{item.workcontents}}</view>
          </view>
          <view class="btn-area">
            <u-button class="save-btn btn-text" color="#0ab8a2" @click="handleClickSync(item)">同步</u-button>
            <u-button class="detail-btn btn-text" :plain="true" @click="viewPicDetail(item)">附件详情</u-button>
          </view>
        </view>
      </view>
    </view>

    <!-- 是否同步选择弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showSyncModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view class="modal-tip">您确定要同步吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="showSyncModal = false">取消</u-button>
          <u-button class="confirm" @click="confirmSync" color="#0ab8a2">确定</u-button>
        </view>
      </view>
    </u-modal>
    <u-modal :show="showLoadingModal" :showConfirmButton="false" width="300rpx">
      <view class="slot-content">
        <u-loading-icon></u-loading-icon>
        <view>同步中</view>
      </view>
    </u-modal>

    <!-- 作为背景用 -->
    <view class="as-bg"></view>
  </view>
</template>
<script>
  import {
    getSyncIList,
    syncIOperate
  } from '../../../api/index.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        showSyncModal: false,
        showLoadingModal: false,
        list: [],
        planId: null
      }
    },
    components: {
      NavigateBar,
    },
    onLoad() {
      // this.getFileDataDetail()
    },
    onShow() {
      this.getSyncIList()
    },
    methods: {
      // 拉取计划列表
      getSyncIList() {
        const query = {
          "limit": 99,
          "page": 1
        }
        console.log(query, 'query')
        getSyncIList(query).then(res => {
          console.log(res, '列表数据');
          if (res.code === 200) {
            this.list = res.data
          }
        }).catch(() => {})
      },
      // 点击同步
      handleClickSync(item) {
        console.log(item, 'item');
        this.showSyncModal = true
        this.planId = item.workPlanId
      },
      // 确定同步
      confirmSync() {
        this.showSyncModal = false
        this.showLoadingModal = true
        syncIOperate(this.planId).then(res => {
          console.log(res, '同步后的结果');
          if (res.code === 200) {
            
            this.$store.commit('saveSyncIData', res.data)
            // uni.$emit('saveSyncIData', res.data)
            uni.redirectTo({
              url: '/pages/index/plan/workApply',
            })
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'error'
            })
          }
        })
      },
      // 点击查看附件
      viewPicDetail(project) {
        uni.$u.route('/pages/index/plan/syncSitePicDetail', {
          ...project
        })
      },
      // 返回上一页
      toGoBack() {
        uni.$u.route('/pages/index/plan/workApply')
        // uni.navigateBack({
        //   delta: 1
        // });
        // uni.navigateBack({
        //   url: '/pages/index/plan/workApply',
        // });
        // uni.redirectTo({
        //   url: '/pages/index/plan/workApply',
        // })
      },
    },
    onBackPress(options) {
      console.log(options, 'options')
      uni.$u.route('/pages/index/plan/workApply')
      return true
    },
  }
</script>
<style scoped lang="scss">
  page {
    background-color: #F0F5F6;
  }

  .container {
    width: 100vw;
    height: 100%;
    background-color: #F0F5F6;

    .as-bg {
      width: 100vw;
      height: 100vh;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: -9;
      background-color: #F0F5F6;
    }

    .detail {
      .info {
        width: 750rpx;
        height: 104rpx;
        box-sizing: border-box;
        padding-top: 42rpx;
        padding-left: 37rpx;
        font-size: 34rpx;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 40rpx;
      }

      .item {
        box-sizing: border-box;
        padding: 33rpx 30rpx 98rpx 30rpx;
        margin-bottom: 16rpx;
        background-color: #FFFFFF;

        .time {
          .icon {
            width: 28rpx;
            height: 28rpx;
            display: inline-block;
            margin-right: 13rpx;
          }
        }

        .divider {
          margin: 20rpx 0 32rpx 0 !important;
        }

        .btn-area {
          display: flex;
          margin-top: 78rpx;

          .btn-text {
            font-size: 32rpx !important;
            font-family: PingFangSC-Regular, PingFang SC !important;
          }

          .save-btn {
            margin-right: 19rpx;
          }

          .detail-btn {
            border: 2rpx solid #0AAA96;
            color: #0EAB97 !important;
          }
        }

        .item-detail {
          font-weight: 400;
          font-size: 30rpx;
          color: #666666;

          .item-title {
            height: 48rpx;
            line-height: 40rpx;
            font-size: 34rpx;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
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

  .modal-tip {
    text-align: center;
  }

  .commit-modal-btn {
    display: flex;
    margin-top: 57rpx;

    .confirm,
    .cancel {
      width: 210rpx;
    }

    .cancel {
      margin-right: 20rpx;
      font-size: 34rpx;
      color: #0ab8a2;
      border: 1rpx solid #0ab8a2;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
</style>
