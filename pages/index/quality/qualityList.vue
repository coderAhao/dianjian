<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>质量缺陷</view>
        <view class="history-container" slot='define' @click="switchHistoryList">
          <image class="history" src="/static/images/icon/history_icon.png"></image>
        </view>
      </NavigateBar>
      <!-- 搜索区域 -->
      <view class="search">
        <u-search placeholder="输入关键字" bgColor="#ffffff" height="80rpx" shape="square" :actionStyle='{color:"#01c1a9"}'
          searchIcon="/static/images/icon/search_icon.png" searchIconSize="18" v-model.trim="query.string" clearabled
          :show-action="true" actionText="搜索" @custom="getQualityList" @clear="clearSearch">
        </u-search>
      </view>
    </u-sticky>

    <!-- 整改区域 -->
    <view class="rectify-area" v-if="showNoData">
      <view class="rectify-item" v-for="item in rectifyList" :key="item.id" @click="switchRectify(item)">
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
      <view class="text">暂无数据</view>
    </view>

    <!-- 作为背景用 -->
    <view class="as-bg"></view>
  </view>
</template>

<script>
  import {
    getQualityList
  } from '../../../api/quality.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        searchContent: '',
        rectifyList: [{
          id: 1,
          type: '行为磊',
          name: '测试name',
          time: '2021-03-08',
          status: '待整改'
        }],
        query: {
          limit: 99,
          page: 1,
          string: ''
        },
        showNoData: false
      }
    },
    components: {
      NavigateBar
    },
    onBackPress(options) {
      if (options && options.from  === 'backbutton') {
        this.$u.route({
          type: 'tab',
          url: '/pages/index/index'
        })
      }
      return true
    },
    onShow() {
      // 重置一下,否则搜索后跳转后再回来数据会保留
      this.query = {
          limit: 99,
          page: 1,
          string: ''
        },
        this.getQualityList()
    },
    methods: {
      // 拉取列表
      getQualityList() {
        getQualityList(this.query).then(res => {
          console.log(res, '拉取的列表');
          if (res.code === 200) {
            this.rectifyList = res.data
            this.showNoData = this.rectifyList.length ? true : false
          }
        })
      },
      // 清空搜索
      clearSearch() {
        this.query.string = ''
      },
      // 跳转到历史记录
      switchHistoryList() {
        uni.$u.route('/pages/index/quality/qualityHistory')
      },
      // 跳转到整改
      switchRectify(item) {
        uni.$u.route('/pages/index/quality/rectify', {
          id: item.id
        })
      },
      // 返回上一页
      toGoBack() {
        this.$u.route({
          type: 'tab',
          url: '/pages/index/index'
        })
        // uni.$u.route('/pages/index/index')
        // uni.navigateBack({
        //   delta: 1
        // });
      },
    }
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

  .history-container {
    transform: translateX(30rpx);

    .history {
      width: 39rpx;
      height: 39rpx;
    }
  }

  // 搜索区域
  .search {
    width: 100vw;
    padding: 31rpx 24rpx 40rpx 24rpx;
    box-sizing: border-box;
    background-color: #F0F5F6;
    z-index: 9; // margin: 31rpx 0 40rpx 0
  }

  .rectify-area {
    width: 100vw;
    padding: 0 24rpx;
    box-sizing: border-box;


    // 列表
    .rectify-item {
      background-color: #FFFFFF;
      padding: 30rpx 22rpx 38rpx 29rpx;
      box-sizing: border-box;
      margin-bottom: 16rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular-, PingFangSC-Regular;
      font-weight: normal;
      color: #333333;

      .project-name {
        margin: 8rpx 0;
        font-size: 30rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      .project-desc {
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 500;
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

        .WAIT_SOLVE_bg {
          background-color: #FFF4E7;
          color: #FD9414;
        }

        .REJECT_bg {
          background-color: #FFEAEF;
          color: #FF3260;
        }
      }
    }

  }

  // 无数据
  .no-data {
    height: 100vh;
    text-align: center;
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
