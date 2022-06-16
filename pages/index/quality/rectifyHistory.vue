<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>历史整改详情</view>
      </NavigateBar>
      <view class="project-name">{{violationDetail.projectName}}</view>
    </u-sticky>
    <!-- 表单区域 -->
    <view class="material">
      <!-- 整改区域 -->
      <view class="rectify-area">
        <view class="rectify-desc">
          <view class="title">整改</view>
          <view class="info">{{rectifyDetail.recDescribe}}</view>
        </view>
        <!-- 整改图片 -->
        <view class="upload-container">
          <u-upload width="188rpx" height="188rpx" :deletable="false" uploadIconColor="#01c1a9" :fileList="rectifyPicObj.fileList"
            name="rectify" multiple :maxCount="recPicLength">
          </u-upload>
        </view>
      </view>

      <!-- 违章区域 -->
      <view class="violation">
        <view class="title">缺陷</view>
        <view class="type">
          <u-tag class="type-item" v-for="item in typeList" :key="item" :text="item" plain type="primary">
          </u-tag>
        </view>
        <view class="desc">{{violationDetail.violationDesc}}</view>
        <view class="img-list">
          <view class="upload-container">
            <u-upload width="188rpx" height="188rpx" :deletable="false" :fileList="violationPicObj.fileList"
              name="violation" multiple :maxCount="vioPicLength">
            </u-upload>
          </view>
        </view>
        <view class="detail">
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">期限</text>
            <text class="behind">{{violationDetail.recTerm}}(小时)</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">发现人</text>
            <text class="behind">{{violationDetail.discovererName}}</text>
          </view>
          <view class="detail-item">
            <text class="front">发现日期</text>
            <text class="behind">{{$u.timeFormat(violationDetail.discoverTime, 'yyyy.mm.dd')}}</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">检查部门</text>
            <text class="behind">{{violationDetail.inspectionDept}}</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">抄送人</text>
            <text class="behind">{{violationDetail.ccName}}</text>
          </view>
        </view>
      </view>
      <!-- 流程区域 -->
      <view class="process">
        <view class="title">流程</view>
        <u-steps :current="processDetail.length" direction="column" activeColor="#73C797">
          <u-steps-item :title="item.statusContent" v-for="item in processDetail" :key="item.moduleId"
            :class="item.statusContent === '驳回' ? 'reject-title' : ''" :error="item.statusContent === '驳回'">
            <view slot="desc" class="slot-content">
              <view class="time">{{item.createTime}}</view>
              <view class="person">
                <image class="img" src="/static/images/icon/process_user_avatar.png" mode=""></image>
                <view class="person-name">{{item.userName}}</view>
              </view>
              <view class="review-opinion" v-if="item.reviewOpinion">{{item.reviewOpinion}}</view>
            </view>
            <view class="slot-icon" slot="icon">
              <image v-if="item.statusContent !== '驳回'" class="img" src="/static/images/icon/process_pass_icon.png" mode=""></image>
              <image v-else class="img" src="/static/images/icon/process_reject_icon.png" mode=""></image>
            </view>
          </u-steps-item>
        </u-steps>
      </view>
    </view>
  <!-- 作为背景用 -->
  <view class="as-bg"></view>
  </view>
</template>
<script>
  import {
    getRectifyDetail,
    getProcessDetail
  } from '../../../api/quality.js'
  import {
    DOWNLOAD_FILE_URL,
  } from '../../../request/baseUrl.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        violationPicObj: {
          count: 0,
          fileList: []
        },
        rectifyPicObj: {
          count: 0,
          fileList: []
        },
        typeList: [],
        recDescribe: '',
        projectId: null,
        rectifyDetail: {},
        violationDetail: {},
        processDetail: [],
        vioPicLength: 0,
        recPicLength: 0,
        isSelfInspection: true,
      }
    },
    components: {
      NavigateBar,
    },
    onShow() {},
    onLoad(options) {
      this.projectId = options.id
      this.getRectifyDetail()
      this.getProcessDetail()
      console.log(options, '接收路由');
    },
    methods: {
      // 拉取整改详情
      getRectifyDetail() {
        getRectifyDetail(this.projectId).then(res => {
          console.log(res, '整改型腔')
          if (res.code === 200) {
            const data = res.data
            this.violationDetail = data
            this.isSelfInspection = data.isSelfInspection
            this.showReject = data.status === 'REJECT' ? true : false
            if (data.rectificationVoList && data.rectificationVoList.length) {
              const length = data.rectificationVoList.length
              // 整改数据 取数组中最后一个
              this.rectifyDetail = data.rectificationVoList[length - 1]
              this.recPicLength = this.rectifyDetail.recPicList.length
              if (this.rectifyDetail.recPicList.length) {
                const newArr = []
                this.rectifyDetail.recPicList.forEach(item => newArr.push(item.uuid))
                newArr.forEach(item => {
                  this.downLoadFile('rectifyPicObj', item)
                })
              }
            }
            this.vioPicLength = data.defectPicList.length
            if (data.defectPicList.length) {
              const newArr = []
              data.defectPicList.forEach(item => newArr.push(item.uuid))
              newArr.forEach(item => {
                this.downLoadFile('violationPicObj', item)
              })
            }
            const {
              jobNature,
              violationSubject,
              defectType
            } = {
              ...data
            }
            this.typeList.push(jobNature, violationSubject, defectType)
          }
        }).catch(() => {})
      },
      // 拉取流程详情
      getProcessDetail() {
        const obj = {
          processModule: 'QUALITY_DEFECT',
          moduleId: this.projectId
        }
        getProcessDetail(obj).then(res => {
          console.log(res, '流程');
          if (res.code === 200) {
            this.processDetail = res.data
          }
        }).catch(() => {})
      },
      // 下载图片
      downLoadFile(obj, url) {
        uni.downloadFile({
          url: DOWNLOAD_FILE_URL + url,
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
          },
          fail: res => {
            console.log(res, '失败了失败了失败了失败了失败了失败了失败了失败了失败了失败了');
          }
        });
      },
      // 返回上一页
      toGoBack() {
        uni.navigateBack({
          delta: 1
        });
      },
    }
  }
</script>
<style scoped lang="scss">
  page {
    background-color: #F3F7F7;
  }

  .container {
    height: 100%;
    background-color: #F3F7F7;
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

  .project-name {
    padding: 29rpx 0 18rpx 40rpx;
    box-sizing: border-box;
    font-size: 36rpx;
    font-family: PingFangSC-Semibold-, PingFangSC-Semibold;
    font-weight: normal;
    color: #333333;
    background-color: #F3F7F7;
    z-index: 99;
  }

  .material {
    padding: 0 15rpx 15rpx 15rpx;
    box-sizing: border-box;
    .rectify-area {
      background-color: #FFFFFF;
      padding: 21rpx 25rpx 25rpx 21rpx;

      .rectify-desc {
        .title {
          font-size: 36rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
        }

        .info {
          margin: 16rpx 0 19rpx 0;
          font-size: 32rpx;
          font-family: PingFangSC-Regular-, PingFangSC-Regular;
          font-weight: normal;
          color: #333333;
        }
      }
    }

    // 违章区域
    .violation {
      background-color: #FFFFFF;
      margin: 16rpx 0;
      padding: 26rpx 30rpx 25rpx 30rpx;

      .title {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold-, PingFangSC-Semibold;
        font-weight: 600;
        color: #333333;
      }

      .type {
        display: flex;
        flex-wrap: wrap;
        margin: 19rpx 0 24rpx 0;

        .type-item {
          margin: 5rpx 5rpx;
        }
      }

      .desc {
        font-size: 30rpx;
        font-family: PingFangSC-Regular-, PingFangSC-Regular;
        font-weight: normal;
        color: #333333;
      }

      .img-list {
        margin: 22rpx 0 30rpx 0;

        .img {
          width: 210rpx;
          height: 210rpx;
        }
      }

      .detail {
        .detail-item {
          margin: 4rpx 0;
          font-size: 32rpx;
          font-family: PingFangSC-Regular-, PingFangSC-Regular;
          font-weight: normal;

          .front {
            margin-right: 41rpx;
            color: #999999;
            display: inline-block;
            width: 130rpx;
          }

          .behind {
            color: #333333;

          }
        }
      }
    }

    // 流程区域
    .process {
      background-color: #FFFFFF;
      padding: 26rpx 30rpx 25rpx 30rpx;

      .title {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold-, PingFangSC-Semibold;
        font-weight: normal;
        color: #333333;
      }

      .slot-content {
        .time {
          font-size: 28rpx;
          font-family: PingFangSC-Regular-, PingFangSC-Regular;
          font-weight: normal;
          color: #999999;
        }

        .person {
          display: flex;
          margin: 5rpx 0;
          align-items: center;
          font-size: 26rpx;
          font-family: PingFangSC-Regular-, PingFangSC-Regular;
          font-weight: normal;
          color: #333333;

          .img {
            width: 30rpx;
            height: 30rpx;
            margin-right: 15rpx;
          }
        }

        .review-opinion {
          font-size: 26rpx;
          font-family: PingFangSC-Regular-, PingFangSC-Regular;
          font-weight: normal;
          color: #333333;
        }
      }
      .slot-icon {
        .img {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }

  }
</style>
