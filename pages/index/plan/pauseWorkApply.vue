<template>
  <view class="container">
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>间断申请</view>
      </NavigateBar>
    </u-sticky>
    <view class="header">
      <view class="header-left">提交间断资料</view>
      <!-- <view class="header-right" @click="syncSite">
        <image class="icon" src="/static/images/icon/synchro_icon.png"></image>
        <view class="synchro">同步i国网</view>
      </view> -->
    </view>
    <view class="material">
      <!-- 上传区域 -->
      <view class="upload-area">
        <u-collapse ref="collapseRef" :border="false" :value="defaultOpen">
          <!-- 工作票 -->
          <u-collapse-item name="tickets">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">工作票/任务单</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.ticketOk" class="view-reject"
                  @click.stop="clickShowModal('ticketOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{ticketObj.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="ticketObj.fileList"
                @afterRead="file => afterRead('ticketObj', file) " @delete="file => deletePic('ticketObj', file)"
                name="1" multiple :maxCount="30">
              </u-upload>
            </view>
            <!-- </view> -->
          </u-collapse-item>

          <!-- 收工会 -->
          <u-collapse-item name="closingMeet">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">收工会</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.closingMeetOk" class="view-reject"
                  @click.stop="clickShowModal('closingMeetOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{closingMeetPic.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="closingMeetPic.fileList"
                @afterRead="file => afterRead('closingMeetPic', file) "
                @delete="file => deletePic('closingMeetPic', file)" name="2" multiple :maxCount="30">
              </u-upload>
            </view>
            <!-- </view> -->
          </u-collapse-item>

          <!-- 间断安措 -->
          <u-collapse-item name="safetyMeasures">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">间断安措</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.safetyMeasuresOk" class="view-reject"
                  @click.stop="clickShowModal('safetyMeasuresOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{safetyMeasuresPic.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="210rpx" height="210rpx" uploadIconColor="#01c1a9" :fileList="safetyMeasuresPic.fileList"
                @afterRead="file => afterRead('safetyMeasuresPic', file) "
                @delete="file => deletePic('safetyMeasuresPic', file)" name="5" multiple :maxCount="30">
              </u-upload>
            </view>
            <!-- </view> -->
          </u-collapse-item>

          <!-- 其他 -->
          <u-collapse-item name="other">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">其他</view>
                <view v-if="this.rejectReason && this.rejectReason.otherOk" class="view-reject"
                  @click.stop="clickShowModal('otherOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{otherObj.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="otherObj.fileList"
                @afterRead="file => afterRead('otherObj', file) " @delete="file => deletePic('otherObj', file)" name="6"
                multiple :maxCount="30">
              </u-upload>
            </view>
            <!-- </view> -->
          </u-collapse-item>
        </u-collapse>
      </view>
    </view>
    <view class="button-area" v-show="!hiddenBtn">
      <u-button class="save-btn btn-text" color="#0ab8a2" @click="clickSave">保存</u-button>
      <u-button class="commit-btn btn-text" :plain="true" @click="clickCommit">提交</u-button>
    </view>
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>您确定要提交间断申请吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="cancelCommit">取消</u-button>
          <u-button class="confirm" v-if="isCommiting" @click="confirmCommit" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
    <u-modal :show="showSaveModal" :showConfirmButton="false" width="300rpx">
      <view class="slot-content">
        <u-loading-icon></u-loading-icon>
        <view>保存中</view>
      </view>
    </u-modal>
    <!-- 驳回意见 -->
    <ExamineReject ref="showModalRef" :showText="showText" />
  </view>
</template>
<script>
  import {
    getDetailList,
    getUpload,
    saveFileData,
    commitFileData,
    getFileDataDetail
  } from '../../../api/index.js'
  import UserLogin from '../../../common/userlogin.js'
  import {
    DOWNLOAD_FILE_URL,
    UPLOAD_FILE_URL
  } from '../../../request/baseUrl.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'
  import ExamineReject from 'components/examine/examineReject.vue'

  export default {
    data() {
      return {
        // downloadUrl: 'http://124.71.133.99:9000/suneng/',
        // downloadUrl: 'http://124.71.133.99:9000/suneng3/',
        modalTitle: '提示',
        showModal: false,
        fileData: {}, // 保存时提交的数据对象
        temporaryData: {}, // 拉取详情的副本数据 保存时需其中的id type等几个字段
        ticketObj: {
          count: 0,
          fileList: []
        },
        closingMeetPic: {
          count: 0,
          fileList: []
        },
        safetyMeasuresPic: {
          count: 0,
          fileList: []
        },
        otherObj: {
          count: 0,
          fileList: []
        },
        showSaveModal: false,
        showText: '',
        rejectReason: {},
        isCommiting: true,
        defaultOpen: ['tickets', 'closingMeet', 'safetyMeasures', 'other'],
        hiddenBtn: false
      }
    },
    components: {
      NavigateBar,
      ExamineReject
    },
    onShow() {
      // this.loadFile()
      // this.getFileDataDetail()
    },
    onLoad() {
      this.getFileDataDetail()
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
      // 同步到I国网
      syncSite() {
        // uni.$u.route('/pages/index/plan/syncSiteDetail')
      },
      // 折叠展开
      collapseChange(e) {
        const arr = e.filter(item => item.status === 'open')
        const newArr = []
        arr.forEach(item => {
          newArr.push(item.name)
        })
        this.defaultOpen = newArr
      },
      // 文件读取后
      async afterRead(type, file) {
        console.log(type, 'typetypetypetypetype');
        console.log(file, 'file');
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
          // JSON.parse(result.data).data 也就是上传成功后后端返回的唯一标识
          // 因为uni的upload方法将返回结果转为了字符串，故需解析
          const url = JSON.parse(result.data).data
          let item = this[type].fileList[fileListLen]
          item.commitUrl = url
          this[type].fileList.splice(fileListLen, 1, Object.assign(item, {
            status: 'success',
            message: '',
          }))
          fileListLen++
          this[type].count++
          console.log(this[type].fileList, 'this[type].fileList');
        }
      },
      // 下载图片
      downLoadFile(obj, url) {
        uni.downloadFile({
          // url: this.downloadUrl + url,
          url: DOWNLOAD_FILE_URL + url,
          success: (res) => {
            console.log(res, '下载成功下载成功下载成功下载成功下载成功下载成功下载成功');
            // const a = JSON.parse(res)
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
      // 走接口传图片
      uploadFilePromise(path) {
        return new Promise((resolve, reject) => {
          let a = uni.uploadFile({
            // url: 'http://192.168.2.20:8199/api/v2/file/upload',
            // url: 'http://192.168.2.101:8199/api/v2/file/upload',
            // url: 'https://linkgapie.com:19000/suneng3/',
            // url: 'https://linkgapie.com:8000/api/v2/file/upload',
            url: UPLOAD_FILE_URL,
            header: {
              'Authorization': 'Bearer ' + UserLogin.getToken()
            },
            filePath: path,
            name: 'file',
            formData: {
              user: 'test'
            },
            success: (res) => {
              setTimeout(() => {
                console.log(res, 'resresres');
                console.log(res.data.data, 'res.data.data');
                // resolve(res.data.data)
                resolve(res)
              }, 300)
            }
          });
        })
      },

      // 删除图片
      deletePic(type, file) {
        const picUploadVal = this.$checkPicStatus([this[type].fileList])
        if (!picUploadVal) return
        const index = file.index
        this[type].fileList.splice(index, 1)
        this[type].count = this[type].fileList.length
      },
      // 保存前的数据处理
      handleSaveData() {
        const arr = ['ticketObj', 'closingMeetPic', 'safetyMeasuresPic', 'otherObj']
        let saveData = {}
        if (this.ticketObj.fileList.length) {
          const newArr = this.ticketObj.fileList.map(item => item.commitUrl)
          saveData.tickets = newArr.toString()
        }
        if (this.closingMeetPic.fileList.length) {
          const newArr = this.closingMeetPic.fileList.map(item => item.commitUrl)
          saveData.closingMeetPic = newArr.toString()
        }
        if (this.safetyMeasuresPic.fileList.length) {
          const newArr = this.safetyMeasuresPic.fileList.map(item => item.commitUrl)
          saveData.safetyMeasuresPic = newArr.toString()
        }
        if (this.otherObj.fileList.length) {
          const newArr = this.otherObj.fileList.map(item => item.commitUrl)
          saveData.other = newArr.toString()
        }
        // const id = this.$store.state.currentProject.id
        // saveData.constructionPlanId = id
        const {
          id,
          constructionPlanId,
          type
        } = {
          ...this.temporaryData
        }
        saveData = {
          id,
          constructionPlanId,
          type,
          ...saveData
        }
        saveData.riskExecuteList = []
        this.fileData = {
          ...saveData
        }
      },
      // 点击保存回到现场管控
      clickSave() {
        const picUploadVal = this.$checkPicStatus([this.ticketObj.fileList, this.closingMeetPic.fileList, this
          .safetyMeasuresPic.fileList, this.otherObj.fileList
        ])
        if (!picUploadVal) return
        this.handleSaveData()
        console.log(this.fileData, 'fileDatafileDatafileDatafileData');
        this.showSaveModal = true
        saveFileData(this.fileData).then(res => {
          console.log(res, 'res******************');
          if (res.code === 200) {
            // uni.$u.route('/pages/index/plan/siteControl')
            this.showSaveModal = false
            uni.redirectTo({
              url: '/pages/index/plan/siteControl'
            })
          } else {
            this.showSaveModal = false
            uni.showToast({
              title: res.data,
              duration: 2000,
              icon: 'error'
            })
          }
        }).catch(() => {})
      },
      // 提交前检测数据是否填写完整
      checkData() {
        const arr = ['ticketObj', 'closingMeetPic', 'safetyMeasuresPic']
        const target = arr.find(item => !this[item].fileList.length)
        if (!target) {
          return true
        } else {
          return false
        }
      },
      // 点击提交出弹窗
      clickCommit() {
        const picUploadVal = this.$checkPicStatus([this.ticketObj.fileList, this.closingMeetPic.fileList, this
          .safetyMeasuresPic.fileList, this.otherObj.fileList
        ])
        if (!picUploadVal) return
        const isCanCommit = this.checkData()
        if (!isCanCommit) {
          uni.showToast({
            title: '请填写完整数据',
            icon: 'error',
            duration: 2000
          })
          return
        }
        this.handleSaveData()
        this.showModal = true
      },
      // 确认提交
      confirmCommit() {
        this.isCommiting = false
        commitFileData(this.fileData).then(res => {
          console.log(res, '提交返回的res9999999999');
          if (res.code === 200) {
            setTimeout(() => {
              uni.showToast({
                title: '提交成功',
                duration: 1000,
                icon: 'success'
              })
              this.showModal = false
              this.isCommiting = true
            }, 500)
            setTimeout(() => {
              // uni.$u.route('/pages/index/plan/siteControl')
              uni.redirectTo({
                url: '/pages/index/plan/siteControl'
              })
            }, 1000)
          } else {
            this.isCommiting = true
            uni.showToast({
              title: res.code,
              duration: 1000,
              icon: 'error'
            })
          }
        })
      },
      // 取消提交
      cancelCommit() {
        this.showModal = false
        this.isCommiting = true
      },
      // 获取文件详情
      getFileDataDetail() {
        const constructionPlanId = this.$store.state.currentProject.id
        let postType = this.$store.state.currentProject.type
        const type = this.$store.state.currentProject.type
        const status = this.$store.state.currentProject.status
        console.log(status, 'status');
        if (type === 'START' && status === 'FINISH') {
          postType = 'PAUSE'
        }
        console.log(postType, this.$store.state.currentProject, '888888888888888888888888888');
        const objArr = ['ticketObj', 'closingMeetPic', 'safetyMeasuresPic', 'otherObj']
        console.log(constructionPlanId, type, 'constructionPlanId和type')
        getFileDataDetail({
            constructionPlanId,
            type: postType
          })
          .then(res => {
            console.log(res, 'res999999999999999');
            if (res.code === 200) {
              this.temporaryData = res.data
              const data = res.data
              console.log(this.fileData, '8888888888888888888');
              this.rejectReason = data.audit
              if (data.tickets) {
                const newArr = data.tickets.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[0], item)
                })
              }
              if (data.closingMeetPic) {
                const newArr = data.closingMeetPic.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[1], item)
                })
              }
              if (data.safetyMeasuresPic) {
                const newArr = data.safetyMeasuresPic.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[2], item)
                })
              }
              if (data.other) {
                const newArr = data.other.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[3], item)
                })
              }
            }
          }).catch(e => {
            console.log(e, '报错了*****************************');
          })
      },
      // 返回上一页
      toGoBack() {
        // uni.$u.route('/pages/index/plan/siteControl')
        // uni.navigateBack({
        //   delta: 1
        // })
        uni.navigateBack({
          url: '/pages/index/plan/siteControl',
        });
      },
      // 展示审核意见
      clickShowModal(val) {
        this.showText = this.rejectReason[val]
        this.$refs.showModalRef.clickShow()
      }
    },
    onBackPress(options) {
      console.log(options, 'options')
      uni.$u.route('/pages/index/plan/siteControl')
      return true
    },
  }
</script>
<style scoped lang="scss">
  .header {
    padding: 40rpx 27rpx 22rpx 37rpx;
    background-color: #F0F5F6;
    display: flex;
    justify-content: space-between;
    font-size: 34rpx;
    color: #333333;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;

    .header-right {
      display: flex;
      align-items: center;

      .icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 9rpx;
      }
    }
  }

  .material {
    padding: 17rpx 38rpx 130rpx 36rpx;

    .worker {
      display: flex;
      align-items: center;

      .text {
        margin-right: 10rpx;
        height: 76rpx;
        line-height: 76rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .star {
        color: #FF3260;
      }

      .worker-number {
        flex: 1;
        text-align: right
      }
    }

    .divide-line {
      margin: 16rpx 0 !important;
    }

    .view-reject {
      margin-left: 8rpx;
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
        // margin-bottom: 37rpx;

        .title-name {
          display: flex;
          align-items: center;

          .title-text {
            margin-right: 10rpx;
            // height: 76rpx;
            // line-height: 76rpx;
            font-size: 34rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }

          .star {
            color: #FF3260;
          }
        }

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

  .button-area {
    // position: absolute;
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
      // font-weight: 400;
    }

    .save-btn {
      margin-right: 19rpx;
    }

    .commit-btn {
      border: 2rpx solid #0AAA96;
      color: #0EAB97 !important;
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
</style>
