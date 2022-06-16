<template>
  <view class="container">
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>详情</view>
      </NavigateBar>
    </u-sticky>
    <view class="detail">
      <view>
       <u-overlay :show="picLoading">
         <view><u-loadmore status="loading" loading-text="图片加载中" color="#ffffff" fontSize="32rpx" /></view>
        </u-overlay>
      </view>
      
      <view class="info">I国网附件详情</view>
      <view class="item">
        <view class="time">
          <image class="icon" src="/static/images/icon/calendar.png" />
          <!-- <text>{{$u.timeFormat(planStartTime, 'yyyy.mm.dd')}}-{{$u.timeFormat(planEndTime, 'yyyy.mm.dd')}}</text> -->
          <text>{{updateTime}}</text>
          <text class="pic-count">图片数量{{picListLength}}</text>
        </view>
        <u-divider class="divider" :dashed="true"></u-divider>
        <!-- 详情图片 -->
        <view class="upload-container">
          <u-upload width="200rpx" height="200rpx" :deletable="false" uploadIconColor="#01c1a9"
            :fileList="picObj.fileList" name="picDetail" multiple :maxCount="picObj.count - 1">
          </u-upload>
        </view>
      </view>
    </view>
    <view class="btn-area">
      <u-button class="btn-text" color="#0ab8a2" @click="showSyncModal = true">同步</u-button>
    </view>

    <!-- 同步中弹窗 -->
    <u-modal :show="showLoadingModal" :showConfirmButton="false" width="300rpx">
      <view class="slot-content">
        <u-loading-icon></u-loading-icon>
        <view>同步中</view>
      </view>
    </u-modal>

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

    <!-- 作为背景用 -->
    <view class="as-bg"></view>
  </view>
</template>
<script>
  import {
    getSyncIDetail,
    syncIOperate
  } from '../../../api/index.js'
  import {
    DOWNLOAD_FILE_URL
  } from '../../../request/baseUrl.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        showSyncModal: false,
        showLoadingModal: false,
        picLoading: true,
        picObj: {
          fileList: [],
          count: 0
        },
        planStartTime: 1655109830000,
        planEndTime: 1655109830000,
        picListLength: 0,
        updateTime: '',
        planId: null
      }
    },
    components: {
      NavigateBar,
    },
    onLoad(options) {
      console.log(options);
      // if (options.picList) {
      //   const newArr = options.picList.split(',')
      //   newArr.forEach(item => {
      //     this.downLoadFile('picObj', item)
      //   })
      // }
      if (options && options.workPlanId) {
        this.getSyncIDetail(options.workPlanId)
        this.planId = options.workPlanId
      }
      this.updateTime = options.updateTime || ''
    },
    methods: {
      getSyncIDetail(id) {
        getSyncIDetail(id).then(res => {
          console.log(res, 'res')
          if (res.code === 200) {
            const data = res.data
            let picList = []
            if (data.investigationList) {
              picList = [...data.investigationList]
            }
            if (data.safetyMeasuresList) {
              picList = [...picList,...data.safetyMeasuresList]
            }
            if (data.otherList) {
              picList = [...picList, ...data.otherList]
            }
            if (data.ticketList) {
              picList = [...picList,...data.ticketList]
            }
            console.log(picList, 'picList');
            this.picListLength = picList.length
            if (!this.picListLength) {
              this.picLoading = false
            }
            this.picObj.list = []
            picList.forEach(item => {
              // 在这里改为唯一的标识              
              // this.downLoadFile('picObj', item.uuid)
              
              this.downLoadFile('picObj', item)
            })
          }
        }).catch(() => {})
      },
      // 下载图片
      downLoadFile(obj, url) {
        uni.downloadFile({
          // url: DOWNLOAD_FILE_URL + url,
          url,
          success: (res) => {
            console.log(res, '下载成功下载成功下载成功下载成功下载成功下载成功下载成功');
            const data = res
            const item = {
              type: "image",
              thumb: data.tempFilePath,
              commitUrl: url
            }
            this[obj].fileList.push(item)
            this[obj].count++
            if (this[obj].count == this.picListLength) {
              this.picLoading = false
            }
          },
          fail: res => {
            console.log(res, '失败了失败了失败了失败了失败了失败了失败了失败了失败了失败了');
          }
        });
      },
      // 确定同步
      confirmSync() {
        this.showSyncModal = false
        this.showLoadingModal = true
        syncIOperate(this.planId).then(res => {
          if (res.code === 200) {
            this.$store.commit('saveSyncIData', res.data)
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
      // 返回上一页
      toGoBack() {
        // uni.$u.route('/pages/index/plan/siteControl')
        uni.navigateBack({
          delta: 1
        });
        // uni.navigateBack({
        //   url: '/pages/index/plan/workApply',
        // });
      },
    },
    // onBackPress(options) {
    //   console.log(options, 'options')
    //   uni.$u.route('/pages/index/plan/siteControl')
    //   return true
    // },
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
        padding: 30rpx;
        margin-bottom: 16rpx;
        background-color: #FFFFFF;

        .time {
          .icon {
            width: 28rpx;
            height: 28rpx;
            display: inline-block;
            margin-right: 13rpx;
          }
          .pic-count {
            margin-left: 50rpx;
          }
        }

        .divider {
          margin: 20rpx 0 32rpx 0 !important;
        }
        .upload-container {
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0 20rpx;
          padding-bottom: 100rpx;
        }
      }
    }

    .btn-area {
      position: fixed;
      z-index: 99;
      width: 100%;
      bottom: 0;
      left: 0;
      display: flex;
      padding: 30rpx 30rpx 33rpx 30rpx;
      box-sizing: border-box;
      background-color: #FFFFFF;
      border-top: 2rpx solid #f0f2f5;

      .btn-text {
        font-size: 32rpx !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
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

    .confirm, .cancel {
      width: 210rpx;
    }
    .cancel {
      margin-right: 20rpx;
      // font-size: 32rpx;
      color: #0ab8a2;
      border: 1rpx solid #0ab8a2;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
  
  ::v-deep .u-transition {
    width: 750rpx;
    // height: calc(100vh - 156rpx);
    margin-top: 156rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  ::v-deep .u-cell__body {
    padding-right: 0 !important;
  }
</style>
