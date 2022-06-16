<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>质量缺陷历史记录</view>
      </NavigateBar>
      <!-- 搜索区域 -->
      <view class="search">
        <u-search placeholder="输入关键字" bgColor="#ffffff" height="80rpx" shape="square" :actionStyle='{color:"#01c1a9"}'
          searchIcon="/static/images/icon/search_icon.png" searchIconSize="18" v-model.trim="query.string" clearabled
          :show-action="true" actionText="搜索" @custom="clickSearch" @clear="clearSearch">
        </u-search>
      </view>
    </u-sticky>
    <!-- 历史记录区域 -->
    <view class="history-area" v-if="showNoData">
      <view class="history-item" v-for="item in historyList" :key="item.id" @click="switchRectifyHistory(item)">
        <view class="project-desc">{{item.defectDesc}}</view>
        <view class="project-name">{{item.projectName}}</view>
        <view class="project-time">
          <view class="project-type">{{item.defectType}}</view>
          <image class="icon" src="/static/images/icon/calendar.png" mode=""></image>
          <text class="text">{{$u.timeFormat(item.discoverTime, 'yyyy.mm.dd')}}</text>
          <view class="status" :class="item.status + '_bg'">
            {{item.status | enumValueByKey($const.RECTIFY_STATUS)}}{{item.isSelfInspection ? '(自查)' : ''}}
          </view>
        </view>
      </view>
    </view>
    <view class="no-data" v-else>
      <image class="img" src="/static/images/img/no_search_data_bg.png"></image>
      <view class="no">暂无数据</view>
    </view>
    <!-- 作为背景用  当搜索出的内容只有一两条时 内容下面会出现白色的背景 迂回一下解决这个问题 -->
    <view class="as-bg"></view>
  </view>
</template>

<script>
  import {
    getQualityHistoryList
  } from '../../../api/quality.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        showHistoryBtn: true,
        searchContent: '',
        historyList: [],
        query: {
          limit: 10,
          page: 1,
          string: ''
        },
        showNoData: true
      }
    },
    components: {
      NavigateBar
    },
    onShow() {
      this.query = {
        limit: 10,
        page: 1,
        string: ''
      }
      this.historyList = []
      this.getQualityHistoryList()
    },
    // 快触底时加载更多
    onReachBottom() {
      this.query.page += 1
      this.getQualityHistoryList()
      console.log('chudile触底了触底了触底了触底了触底了触底了');
    },
    onBackPress(options) {
      console.log(options, 'options')
      if (options && options.from  === 'backbutton') {
        uni.navigateBack({
          url: '/pages/index/quality/qualityList',
        });
        // 注: 此处的return需写在if里面
        return true
      }
    },
    methods: {
      // 拉取历史列表
      getQualityHistoryList() {
        getQualityHistoryList(this.query).then(res => {
          console.log(res, '拉取历史记录列表');
          if (res.code === 200) {
            this.historyList.push(...res.data)
            this.showNoData = this.historyList.length ? true : false
          }
        })
      },
      // 点击搜索
      clickSearch() {
        this.query.page = 1
        this.historyList = []
        this.getQualityHistoryList()
      },
      // 清空搜索
      clearSearch() {
        this.query.string = ''
      },
      // 跳转到整改历史详情
      switchRectifyHistory(item) {
        uni.$u.route('/pages/index/quality/rectifyHistory', {
          id: item.id
        })
      },
      // 返回上一页
      toGoBack() {
        uni.navigateBack({
          url: '/pages/index/quality/qualityList',
        });
      },
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
  }

  // 搜索区域
  .search {
    width: 100vw;
    padding: 31rpx 24rpx 40rpx 24rpx;
    box-sizing: border-box;
    background-color: #F0F5F6;
    z-index: 9;
  }

  .history-area {
    width: 100vw;
    padding: 0 24rpx;
    box-sizing: border-box;

    // 列表
    .history-item {
      background-color: #FFFFFF;
      padding: 30rpx 22rpx 38rpx 29rpx;
      box-sizing: border-box;
      margin-bottom: 16rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular-, PingFangSC-Regular;
      font-weight: normal;
      color: #333333;

      .project-desc {
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .project-name {
        margin: 8rpx 0;
        font-size: 30rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      .project-time {
        display: flex;
        align-items: center;

        .project-type {
          color: #999999;
          margin-right: 30rpx;
        }

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

        .status {
          height: 50rpx;
          padding: 5rpx 17rpx;
          box-sizing: border-box;
          background-color: #2979FF;
          border-radius: 25rpx;
          margin-left: auto;
        }

        .FINISH_bg {
          background-color: #E5F9F6;
          color: #0AAA96;
        }

        .REJECT_bg {
          background-color: #FFEAEF;
          color: #FF3260;
        }

        .WAIT_CONFIRM_bg {
          background-color: #FFF4E7;
          color: #FD9414;
        }
      }
    }

  }

  // 无数据
  .no-data {
    height: 100vh;
    text-align: center !important;
    font-size: 32rpx;
    font-family: PingFangSC-Regular-, PingFangSC-Regular;
    font-weight: normal;
    color: #666666;

    .img {
      width: 536rpx;
      height: 288rpx;
      margin: 331rpx 0 64rpx 0;
    }
  }
</style>
