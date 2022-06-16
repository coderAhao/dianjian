<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>安全督查</view>
        <view class="delete-container" v-if="showDeleteBtn" slot='define' @click="deleteSafe">
          <image class="delete" src="/static/images/icon/delete_icon.png"></image>
        </view>
      </NavigateBar>
    </u-sticky>
    <!-- 表单区域 -->
    <view class="material">
      <view class="item-contain" v-for="(item,index) in textList" :key="item.value">
        <view class="material-item" @click="handleShowPick(item.type, index)">
          <view class="text">{{item.label}}</view>
          <view class="star">*</view>
          <view class="content placeholder-text" v-if="!item.text">{{ '请选择' }}</view>
          <view class="content">{{ item.text }}</view>
          <view class="right-icon">
            <image class="icon" src="/static/images/icon/spread_icon.png"></image>
          </view>
        </view>
        <u-divider></u-divider>
      </view>
      <view class="vio-desc">
        <view class="material-item">
          <view class="text">违章描述</view>
          <view class="star">*</view>
        </view>
        <u--textarea v-model.trim="violationDesc" placeholder="请输入内容"></u--textarea>
      </view>
      <view class="upload-area">
        <u-collapse ref="collapseRef" class="collapse" :border="false" :value="defaultOpen" @change="collapseChange">
          <!-- 违章图片 -->
          <u-collapse-item name="pic">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">违章图片</view>
                <view class="star">*</view>
              </view>
              <view class="account">已上传{{violationPicObj.count}}份</view>
            </view>
            <view class="upload-container">
              <u-upload width="188rpx" height="188rpx" uploadIconColor="#01c1a9" :fileList="violationPicObj.fileList"
                @afterRead="file => afterRead('violationPicObj', file) "
                @delete="file => deletePic('violationPicObj', file)" name="safety" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>
        </u-collapse>
      </view>
    </view>
    <!-- 选择器 -->
    <u-picker :show="pickShow" :columns="pickData" keyName="dictLabel" @confirm="handlePickConfirm"
      @cancel="pickShow = false" @close="pickShow = false" :closeOnClickOverlay="true" :defaultIndex="pickIndex">
    </u-picker>
    <!-- 提交按钮 -->
    <view class="divider"></view>
    <view class="button-area" v-show="!hiddenBtn">
      <u-button class="save-btn btn-text" color="#0ab8a2" @click="clickSave">保存</u-button>
      <u-button class="commit-btn btn-text" :plain="true" @click="clickCommit">提交</u-button>
    </view>
    <!-- 提交/删除 共用弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>{{ isDelete ? '您确定要删除安全督查吗？' : '您确定要提交安全督查吗？'}}</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="cancelCommit">取消</u-button>
          <u-button class="confirm" v-if="commitLoading" @click="confirmCommit" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
    <!-- 保存弹窗 -->
    <u-modal :show="showSaveModal" :showConfirmButton="false" width="300rpx">
      <view class="slot-content">
        <u-loading-icon></u-loading-icon>
        <view>保存中</view>
      </view>
    </u-modal>
  </view>
</template>
<script>
  import {
    getJobNature,
    getViolationType,
    getViolationSubject,
    getViolationLevel,
    addOrEditSafe,
    commitSafe,
    deleteSafe,
    getSafeDetail,
    getProjectDetail
  } from '../../../api/safe.js'
  import {
    DOWNLOAD_FILE_URL,
    UPLOAD_FILE_URL
  } from '../../../request/baseUrl.js'
  import UserLogin from '../../../common/userlogin.js'
  import NavigateBar from 'components/navigate/navigateBar.vue'

  export default {
    data() {
      return {
        pickShow: false,
        showModal: false,
        showSaveModal: false,
        pickData: [],
        jobNature: [],
        violationType: [],
        violationSubject: [],
        violationLevel: [],
        violationDesc: '',
        pickIndex: [0], // 用于选择后的回显 如：工作性质和违章类型分别选择的item的索引不同，那回显时需让其item在相应的位置 这里数据结构对应处理时稍微有点绕
        currentIndex: null, // 点三角标的时候知道是哪一行
        textList: [{
            value: 1,
            label: '工作性质',
            type: 'jobNature',
            text: null,
            index: 0, // 作用是选择后，再次点击时回显对应的item
          },
          {
            value: 2,
            label: '违章类型',
            type: 'violationType',
            text: null,
            index: 0,
          },
          {
            value: 3,
            label: '违章专业',
            type: 'violationSubject',
            text: null,
            index: 0,
          },
          {
            value: 4,
            label: '违章等级',
            type: 'violationLevel',
            text: null,
            index: 0,
          },
        ],
        violationPicObj: {
          count: 0,
          fileList: []
        },
        saveData: {},
        commitLoading: true,
        isDelete: false,
        showDeleteBtn: false,
        detailData: {},
        defaultOpen: ['pic'],
        hiddenBtn: false
      }
    },
    components: {
      NavigateBar
    },
    onShow() {},
    onLoad() {
      this.asyncSwitch()
      this.getProjectDetail()
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
      // 工作性质/违章类型/违章专业/违章等级接口都有了数据后再请求详情
      asyncSwitch() {
        Promise.all([this.getJobNature(), this.getViolationType(), this.getViolationSubject(), this
          .getViolationLevel()
        ]).then(res => {
          console.log(res, '最后的res');
          this.getSafeDetail()
        }).catch(() => {})
      },
      // 通过constructionPlanId拉取详情
      getProjectDetail() {
        const constructionPlanId = this.$store.state.currentProject.id
        getProjectDetail(constructionPlanId).then(res => {
          console.log(res, '获取的详情')
          if (res.code === 200) {
            const data = res.data
            const {
              charger,
              projectId
            } = {
              ...data
            }
            const inspectionDept = '班组自查'
            const unitId = data.unit
            const discoverTime = new Date().getTime()
            this.detailData = {
              charger,
              projectId,
              inspectionDept,
              unitId,
              discoverTime
            }
          }
        }).catch(() => {})
      },
      // 获取工作性质数据
      getJobNature() {
        return getJobNature().then(res => {
          console.log(res, 'gonghzuo');
          if (res.code === 200) {
            this.jobNature = res.data
          }
        }).catch(() => {})
      },
      // 获取违章类型数据
      getViolationType() {
        return getViolationType().then(res => {
          console.log(res, 'gonghzuo');
          if (res.code === 200) {
            this.violationType = res.data
          }
        }).catch(() => {})
      },
      // 获取违章专业数据
      getViolationSubject() {
        return getViolationSubject().then(res => {
          console.log(res, 'gonghzuo');
          if (res.code === 200) {
            this.violationSubject = res.data
          }
        }).catch(() => {})
      },
      // 获取违章等级数据
      getViolationLevel() {
        return getViolationLevel().then(res => {
          console.log(res, 'gonghzuo');
          if (res.code === 200) {
            this.violationLevel = res.data
          }
        }).catch(() => {})
      },
      // 展示选择器
      handleShowPick(type, index) {
        const i = this.textList[index].index
        this.pickIndex = [i] // 用于选择后的回显
        this.pickData = [this[type]] // 注：columns绑定的pickData必须为嵌套数组
        this.currentIndex = index
        this.pickShow = true
        console.log(this.pickIndex, 'pickIndex');
      },
      // 数据选好点击确定
      handlePickConfirm(e) {
        console.log(e, '选择得数据');
        console.log(e.value[0], '选择得数据');
        const pickItem = e.value[0]
        const itemIndex = e.indexs[0]
        this.pickShow = false
        this.textList[this.currentIndex].text = pickItem.dictLabel
        this.textList[this.currentIndex].index = itemIndex
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
          console.log(url, 'url*************************');
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
        const picUploadVal = this.$checkPicStatus([this[type].fileList])
        if (!picUploadVal) return
        const index = file.index
        this[type].fileList.splice(index, 1)
        this[type].count = this[type].fileList.length
      },
      // 保存前的数据处理
      handleSaveData() {
        // 筛选出要提交的字段的数据 后端要中文 直接给text即可
        this.textList.forEach(item => this.saveData[item.type] = item.text)
        this.saveData.violationDesc = this.violationDesc
        // this.saveData.violationDesc = this.violationDesc.replace(/^\s+|\s+$/g, "")
        // 提取违章图片
        console.log(this.violationPicObj, 'this.violationPicObj');
        if (this.violationPicObj.fileList.length) {
          const newArr = this.violationPicObj.fileList.map(item => item.commitUrl)
          this.saveData.violationPic = newArr.toString()
        }
      },
      // 点击保存
      clickSave() {
        const picUploadVal = this.$checkPicStatus([this.violationPicObj.fileList])
        if (!picUploadVal) return
        this.handleSaveData()
        Object.assign(this.saveData, this.detailData)
        this.showSaveModal = true
        console.log(this.saveData, 'this.saveData');
        addOrEditSafe(this.saveData).then(res => {
          if (res.code === 200) {
            this.showSaveModal = false
            uni.redirectTo({
              url: '/pages/index/plan/siteControl'
            })
          } else {
            this.showSaveModal = false
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'error'
            })
          }
        }).catch(() => {})
      },
      // 提交前检查数据填写是否完整
      checkData() {
        const target = this.textList.find(item => !item.text)
        if (target || !this.violationPicObj.count) return false
        return true
      },
      // 点击提交弹出弹窗
      clickCommit() {
        const picUploadVal = this.$checkPicStatus([this.violationPicObj.fileList])
        if (!picUploadVal) return
        this.isDelete = false
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
        Object.assign(this.saveData, this.detailData)
        this.showModal = true
      },
      // 开始提交/删除
      confirmCommit() {
        this.commitLoading = false
        if (this.isDelete) {
          const id = this.saveData.id
          const idList = [id]
          deleteSafe(idList).then(res => {
            if (res.code === 200) {
              setTimeout(() => {
                uni.showToast({
                  title: '删除成功',
                  duration: 1000,
                  icon: 'success'
                })
                this.showModal = false
                this.commitLoading = true
              }, 500)
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/index/plan/siteControl'
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
          })
        } else {
          // const id = this.saveData.id
          const commitData = this.saveData
          console.log(commitData, '提交时的数据');
          commitSafe({
            ...commitData
          }).then(res => {
            console.log(res, '提交返回的res9999999999');
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
                  url: '/pages/index/plan/siteControl'
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
        }
      },
      // 取消提交
      cancelCommit() {
        this.showModal = false
        this.commitLoading = true
      },
      // 点击删除
      deleteSafe() {
        this.isDelete = true
        this.showModal = true
      },
      // 获取督查详情
      getSafeDetail() {
        const id = this.$store.state.safeDetailId
        if (id) {
          getSafeDetail(id).then(res => {
            console.log(res, '获取的安全详情')
            if (res.code === 200) {
              this.showDeleteBtn = true
              const data = res.data
              this.saveData.id = data.id
              if (data.jobNature) {
                const target = this.jobNature.find(item => item.dictLabel == data.jobNature)
                this.textList[0].text = target.dictLabel
                this.textList[0].index = this.jobNature.findIndex(item => item.dictLabel == data.jobNature)
              }
              if (data.violationType) {
                const target = this.violationType.find(item => item.dictLabel == data.violationType)
                this.textList[1].text = target.dictLabel
                this.textList[1].index = this.violationType.findIndex(item => item.dictLabel == data.violationType)
              }
              if (data.violationSubject) {
                const target = this.violationSubject.find(item => item.dictLabel == data.violationSubject)
                this.textList[2].text = target.dictLabel
                this.textList[2].index = this.violationSubject.findIndex(item => item.dictLabel == data
                  .violationSubject)
              }
              if (data.violationLevel) {
                const target = this.violationLevel.find(item => item.dictLabel == data.violationLevel)
                this.textList[3].text = target.dictLabel
                this.textList[3].index = this.violationLevel.findIndex(item => item.dictLabel == data
                  .violationLevel)
              }
              if (data.violationPicList.length) {
                const newArr = []
                data.violationPicList.forEach(item => newArr.push(item.uuid))
                newArr.forEach(item => {
                  this.downLoadFile('violationPicObj', item)
                })
              }
              if (data.violationDesc !== undefined || data.violationDesc !== null || data.violationDesc !== '') {
                this.violationDesc = data.violationDesc
              }
            }
          }).catch(() => {})
        }
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
  .delete-container {
    transform: translateX(30rpx);

    .delete {
      width: 39rpx;
      height: 39rpx;
    }
  }

  .material {
    padding: 17rpx 38rpx 170rpx 36rpx;

    .star {
      margin: 0 27rpx 0 10rpx;
      color: #FF3260;
    }

    // 工作性质
    .material-item {
      display: flex;
      align-items: center;

      .text {
        height: 76rpx;
        line-height: 76rpx;
        font-size: 34rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .content {
        font-size: 32rpx;
        font-family: PingFangSC-Regular-, PingFangSC-Regular;
        font-weight: normal;
        color: #333333;
      }

      .placeholder-text {
        color: #999999;
      }

      .right-icon {
        margin-left: auto;

        .icon {
          width: 30rpx;
          height: 16rpx;
        }
      }
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

        .title-name {
          display: flex;
          align-items: center;

          .title-text {
            font-size: 34rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
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

  // 样式穿透
  ::v-deep .u-divider {
    margin: 10rpx 0;
  }

  ::v-deep .uni-textarea-textarea {
    color: #333333;
  }
</style>
