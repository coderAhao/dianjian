<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>整改</view>
      </NavigateBar>
      <view class="project-name">{{rectifyDetail.projectName}}</view>
    </u-sticky>
    <!-- 表单区域 -->
    <view class="material">
      <!-- 整改区域 -->
      <view class="rectify-area">
        <view class="rectify-desc">
          <view class="title">
            <view class="info">整改</view>
            <view v-if="showReject" class="reject-reason" @click="clickReject">(查看驳回)</view>
          </view>
          <view class="material-item rectify-item">
            <view class="text">整改描述</view>
            <view class="star">*</view>
          </view>
          <u--textarea v-model.trim="recDescribe" placeholder="请输入内容"></u--textarea>
        </view>
        <view class="upload-area">
          <u-collapse ref="collapseRef" class="collapse" :border="false" :value="defaultOpen" @change="collapseChange">
            <!-- 整改图片 -->
            <u-collapse-item name="pic">
              <view class="title" slot="title">
                <view class="material-item">
                  <view class="title-text">整改图片</view>
                  <view class="star">*</view>
                </view>
                <view class="account">已上传{{rectifyPicObj.count}}份</view>
              </view>
              <view class="upload-container">
                <u-upload width="188rpx" height="188rpx" uploadIconColor="#01c1a9" :fileList="rectifyPicObj.fileList"
                  @afterRead="file => afterRead('rectifyPicObj', file) "
                  @delete="file => deletePic('rectifyPicObj', file)" name="rectify" multiple :maxCount="10">
                </u-upload>
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>
      </view>

      <!-- 违章区域 -->
      <view class="violation">
        <view class="title">缺陷</view>
        <view class="type">
          <u-tag class="type-item" v-for="item in typeList" :key="item" :text="item" plain type="primary">
          </u-tag>
        </view>
        <view class="desc">{{rectifyDetail.defectDesc}}</view>
        <view class="img-list">
          <view class="upload-container">
            <u-upload width="188rpx" height="188rpx" :deletable="false" :fileList="violationPicObj.fileList"
              name="violation" multiple :maxCount="picLength">
            </u-upload>
          </view>
        </view>
        <view class="detail">
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">期限</text>
            <text class="behind">{{rectifyDetail.recTerm}}(小时)</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">发现人</text>
            <text class="behind">{{rectifyDetail.discovererName}}</text>
          </view>
          <view class="detail-item">
            <text class="front">发现日期</text>
            <text class="behind">{{$u.timeFormat(rectifyDetail.discoverTime, 'yyyy.mm.dd')}}</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">检查部门</text>
            <text class="behind">{{rectifyDetail.inspectionDept}}</text>
          </view>
          <view class="detail-item" v-if="!isSelfInspection">
            <text class="front">抄送人</text>
            <text class="behind">{{rectifyDetail.ccName}}</text>
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
    <!-- 提交按钮 -->
    <view class="divider"></view>
    <view class="button-area" v-show="!hiddenBtn">
      <u-button class="commit-btn" color="#0ab8a2" @click="clickCommit">提交</u-button>
    </view>
    <!-- 提交弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>您确定要提交整改吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="cancelCommit">取消</u-button>
          <u-button class="confirm" v-if="commitLoading" @click="confirmCommit" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
    <!-- 驳回意见 -->
    <ExamineReject ref="showModalRef" :showText="showText" />
  </view>
</template>
<script>
  import {
    getRectifyDetail,
    commitRectify,
    getProcessDetail
  } from '../../../api/quality.js'
  import {
    DOWNLOAD_FILE_URL,
    UPLOAD_FILE_URL
  } from '../../../request/baseUrl.js'
  import UserLogin from '../../../common/userlogin.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'
  import ExamineReject from 'components/examine/examineReject.vue'


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
        processDetail: [],
        commitData: {},
        showModal: false,
        commitLoading: true,
        picLength: 0,
        isSelfInspection: true,
        showText: '',
        showReject: false,
        defaultOpen: ['pic'],
        hiddenBtn: false
      }
    },
    components: {
      NavigateBar,
      ExamineReject
    },
    onShow() {},
    onLoad(options) {
      this.projectId = options.id
      this.getRectifyDetail()
      this.getProcessDetail()
      console.log(options, '接收路由');
    },
    mounted() {
      uni.onKeyboardHeightChange(res => {
        this.hiddenBtn = res.height !== 0 ? true : false 
      })
    },
    updated() {
      this.$nextTick(function() {
        this.$refs.collapseRef.init()
      })
    },
    methods: {
      // 折叠展开
      collapseChange(e) {
        const arr = e.filter(item => item.status === 'open')
        const newArr = []
        arr.forEach(item => {
          newArr.push(item.name)
        })
        this.defaultOpen = newArr
      },
      // 拉取整改详情
      getRectifyDetail() {
        getRectifyDetail(this.projectId).then(res => {
          console.log(res, '整改型腔')
          if (res.code === 200) {
            const data = res.data
            this.rectifyDetail = data
            this.isSelfInspection = data.isSelfInspection
            this.showReject = data.status === 'REJECT' ? true : false
            if (data.rectificationVoList && data.rectificationVoList.length) {
              const length = data.rectificationVoList.length
              // 驳回原因
              this.showText = data.rectificationVoList[length - 1].reviewComments
              // 整改描述和内容暂不回显
              // this.recDescribe = data.rectificationVoList[length - 1].recDescribe
              // if (data.rectificationVoList[length - 1].recPicList.length) {
              //   const newArr = []
              //   data.rectificationVoList[length - 1].recPicList.forEach(item => newArr.push(item.uuid))
              //   newArr.forEach(item => {
              //     this.downLoadFile('rectifyPicObj', item)
              //   })
              // }
            }
            this.picLength = data.defectPicList.length
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
      // 文件读取后
      async afterRead(type, file) {
        const fileArr = file.file
        let fileListLen = this[type].fileList.length
        if (fileArr.length) {
          this[type].count = fileListLen
        }
        const lists = [].concat(fileArr)
        lists.map(item => {
          this[type].fileList.push({
            ...item,
            status: 'uploading',
            message: '上传中'
          })
        })
        for (let i = 0; i < lists.length; i++) {
          const result = await this.uploadFilePromise(lists[i].url)
          const url = JSON.parse(result.data).data
          let item = this[type].fileList[fileListLen]
          item.commitUrl = url
          this[type].fileList.splice(fileListLen, 1, Object.assign(item, {
            status: 'success',
            message: '',
          }))
          fileListLen++
          this[type].count++
        }
      },
      // 走接口传图片
      uploadFilePromise(path) {
        return new Promise((resolve, reject) => {
          let a = uni.uploadFile({
            url: UPLOAD_FILE_URL,
            header: {
              'Authorization': 'Bearer ' + UserLogin.getToken()
            },
            filePath: path,
            name: 'file',
            success: (res) => {
              setTimeout(() => {
                resolve(res)
              }, 300)
            }
          });
        })
      },
      // 删除图片
      deletePic(type, file) {
        const index = file.index
        this[type].fileList.splice(index, 1)
        this[type].count = this[type].fileList.length
      },
      // 提交前的数据处理
      clickCommit() {
        const a = this.rectifyPicObj.fileList.length
        const b = this.recDescribe !== '' && this.recDescribe !== undefined && this.recDescribe !== null
        const picUploadVal = this.$checkPicStatus([this.rectifyPicObj.fileList])
        if (!picUploadVal) return
        if (a && b) {
          const id = this.projectId
          const recDescribe = this.recDescribe
          const newArr = this.rectifyPicObj.fileList.map(item => item.commitUrl)
          const recPic = newArr.toString()
          const recTime = new Date().getTime()
          this.commitData = {
            id,
            recDescribe,
            recPic,
            recTime
          }
          this.showModal = true
          this.commitLoading = true
        } else {
          uni.showToast({
            title: '请填写完整数据',
            icon: 'error',
            duration: 1500,
          })
        }
      },
      // 开始提交
      confirmCommit() {
        this.commitLoading = false
        commitRectify(this.commitData).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              uni.showToast({
                title: '提交成功',
                duration: 1000,
                icon: 'success'
              })
              this.showModal = false
              this.commitLoading = true
            }, 500)
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/index/quality/qualityList'
              })
            }, 1000)
          } else {
            this.commitLoading = true
            uni.showToast({
              title: res.code,
              duration: 1000,
              icon: 'error'
            })
          }
        }).catch(() => {
          this.commitLoading = true
          uni.showToast({
            title: '提交失败',
            duration: 1000,
            icon: 'error'
          })
        })
      },
      // 取消提交
      cancelCommit() {
        this.showModal = false
        this.commitLoading = true
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
      // 查看驳回原因
      clickReject() {
        this.$refs.showModalRef.clickShow()
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
    padding: 0 15rpx 150rpx 15rpx;

    .rectify-area {
      background-color: #FFFFFF;
      padding: 21rpx 25rpx 25rpx 21rpx;

      .rectify-desc {
        .title {
          display: flex;
          font-size: 36rpx;
          font-family: PingFang SC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;

          .reject-reason {
            margin-left: 20rpx;
            color: #ff0000;
          }
        }

        .rectify-item {
          margin: 16rpx 0;
        }
      }
    }

    .material-item {
      display: flex;
      align-items: center;
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }

    .star {
      margin: 0 27rpx 0 10rpx;
      color: #FF3260;
    }

    // 上传区域
    .upload-area {
      ::v-deep .u-upload__deletable {
        width: 46rpx !important;
        height: 46rpx !important;
      }

      ::v-deep .u-upload__deletable__icon {
        top: 6rpx;
      }

      ::v-deep .u-icon__icon {
        font-size: 42rpx !important;
      }

      ::v-deep .uicon-camera-fill {
        font-size: 88rpx !important;
      }

      ::v-deep .u-cell__body {
        padding-right: 0 !important;
      }

      .title {
        transform: translateX(-30rpx);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .account {
          transform: translateX(30rpx);
          margin-left: auto;
          height: 76rpx;
          line-height: 76rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
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

  .button-area {
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
      font-size: 34rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }

    .save-btn {
      margin-right: 19rpx;
    }

    .commit-btn {
      border: 2rpx solid #0AAA96;
      // color: #0EAB97 !important;
      color: #FFFFFF !important;
    }
  }

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
      font-size: 34rpx;
      color: #0ab8a2;
      border: 1rpx solid #0ab8a2;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }

  // 样式穿透
  ::v-deep .u-divider {
    margin: 10rpx 0;
  }

  ::v-deep .uni-textarea-textarea {
    color: #333333;
  }
  ::v-deep .reject-title .u-text__value {
    color: #ff0000!important;
  }
</style>
