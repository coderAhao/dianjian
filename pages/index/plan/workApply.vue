<template>
  <view class="container">
    <u-sticky>
      <NavigateBar @toGoBack="toGoBack">
        <view slot='navigatreText'>开工申请</view>
      </NavigateBar>
    </u-sticky>
    <view class="header">
      <view class="header-left">提交开工资料</view>
      <view class="header-right" @click="syncSite">
        <image v-if="isCanSync" class="icon" src="/static/images/icon/can_synchro_icon.png"></image>
        <image v-else class="icon" src="/static/images/icon/synchro_icon.png"></image>
        <view class="synchro" :class="!isCanSync ? 'no-sync' : ''">同步i国网</view>
      </view>
    </view>
    <view class="material">
      <view class="worker">
        <view class="text">实际施工人数</view>
        <view class="star">*</view>
        <input type="number" class="worker-number" clearable v-if="this.fileData" v-model="fileData.workerNum"
          placeholder="请输入"></input>
      </view>

      <!-- <u-line class="divide-line"></u-line> -->
      <!-- 上传区域 -->
      <view class="upload-area">
        <u-collapse ref="collapseRef" class="collapse" :border="false" :value="defaultOpen" @change="collapseChange">

          <!-- 安措 -->
          <u-collapse-item name="safetyMeasuresPic">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">安措</view>
                <!-- <view class="star">*</view> -->
                <view v-if="this.rejectReason && this.rejectReason.safetyMeasuresOk" class="view-reject"
                  @click.stop="clickShowModal('safetyMeasuresOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{safetyMeasuresPicObj.count}}份</view>
            </view>
            <view class="upload-container">
              <u-upload width="188rpx" height="188rpx" uploadIconColor="#01c1a9"
                :fileList="safetyMeasuresPicObj.fileList" @afterRead="file => afterRead('safetyMeasuresPicObj', file) "
                @delete="file => deletePic('safetyMeasuresPicObj', file)" name="safety" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>

          <!-- 工作票 -->
          <u-collapse-item name="tickets">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">工作票/任务单</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.ticketOk" class="view-reject"
                  @click.stop="clickShowModal('ticketOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{ticketObj.count}}份</view>
            </view>
            <view class="upload-container">
              <u-upload width="188rpx" height="188rpx" uploadIconColor="#01c1a9" :fileList="ticketObj.fileList"
                @afterRead="file => afterRead('ticketObj', file) " @delete="file => deletePic('ticketObj', file)"
                name="ticket" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>

          <!-- 风险措施执行情况确认 -->
          <u-collapse-item name="risk">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">风险措施执行情况确认</view>
                <!-- <view class="star">*</view> -->
                <view v-if="this.rejectReason && this.rejectReason.riskExecOk" class="view-reject"
                  @click.stop="clickShowModal('riskExecOk')">(查看驳回)</view>
              </view>
              <view class="account">已上传{{riskExecuteCount}}份</view>
            </view>
            <view v-if="this.showRiskExecute">

              <view class="risk-upload" v-for="(item, index) in riskExecuteList" :key="item.planRiskExecuteId">
                <view class="desc-text">{{index + 1 + '. '}}{{item.riskContent}}</view>
                <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9"
                  :fileList="(riskUploadList[index]).fileList"
                  @afterRead="file => afterRiskRead(item.planRiskExecuteId, file) "
                  @delete="file => deleteRiskPic(item.planRiskExecuteId,index, file)"
                  :name="item.planRiskExecuteId + 'str'" multiple :maxCount="10">
                </u-upload>
              </view>
            </view>
            <view v-else style="text-align: left;">无</view>

            <!-- </view> -->
          </u-collapse-item>

          <!-- 交底记录 -->
          <!--          <u-collapse-item name="record">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">交底记录</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.recordsOk" class="view-reject"
                  @click.stop="clickShowModal('recordsOk')">(查看驳回)</view>
              </view>
              <view class="account">已上传{{discloseObj.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="discloseObj.fileList"
                @afterRead="file => afterRead('discloseObj', file) " @delete="file => deletePic('discloseObj', file)"
                name="disclose" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>
 -->
          <!-- 勘查记录 -->
          <u-collapse-item name="invest">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">勘查记录</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.investigateDocsOk" class="view-reject"
                  @click.stop="clickShowModal('investigateDocsOk')">(查看驳回)</view>
              </view>
              <view class="account">已上传{{prospectObj.count}}份</view>
            </view>
            <view class="upload">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="prospectObj.fileList"
                @afterRead="file => afterRead('prospectObj', file) " @delete="file => deletePic('prospectObj', file)"
                name="prospect" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>

          <!-- 动火票 -->
          <u-collapse-item name="fireTicket">
            <!-- <view> -->
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">动火票</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.fireTicketOk" class="view-reject"
                  @click.stop="clickShowModal('fireTicketOk')">(查看驳回)</view>

              </view>
              <view class="account">已上传{{fireTicketObj.count}}份</view>
            </view>
            <view class="select-area">
              <u-radio-group v-model="fireRadiovalue" placement="row" @change="e => handleRadioChange(e, 'fire')">
                <u-radio activeColor="#01c1a9" v-for="item in radioList"
                  :customStyle="{marginBottom: '8px', marginRight: '8px'}" :key="item.value" :label="item.label"
                  :name="item.value">
                </u-radio>
              </u-radio-group>
            </view>
            <view class="upload" v-if="fireRadiovalue == 1">
              <!-- <view class="upload"> -->
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="fireTicketObj.fileList"
                @afterRead="file => afterRead('fireTicketObj', file) "
                @delete="file => deletePic('fireTicketObj', file)" name="fire" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item>

          <!-- 大型设备进场 -->
          <!-- <u-collapse-item name="largeEquipment">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">大型设备进场</view>
                <view v-if="this.rejectReason && this.rejectReason.largeEquipmentOk" class="view-reject"
                  @click.stop="clickShowModal('largeEquipmentOk')">(查看驳回)</view>
              </view>
              <view class="account">已上传{{largeEquipmentObj.count}}份</view>
            </view>
            <view class="select-area">
              <u-radio-group v-model="equirpmentRadiovalue" placement="row"
                @change="e => handleRadioChange(e, 'equirpment')">
                <u-radio activeColor="#01c1a9" v-for="item in radioList" :customStyle="{marginBottom: '8px', marginRight: '8px'}"
                  :key="item.value" :label="item.label" :name="item.value">
                </u-radio>
              </u-radio-group>
            </view>
            <view class="upload" v-if="equirpmentRadiovalue == 1">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9" :fileList="largeEquipmentObj.fileList"
                @afterRead="file => afterRead('largeEquipmentObj', file) "
                @delete="file => deletePic('largeEquipmentObj', file)" name="large" multiple :maxCount="10">
              </u-upload>
            </view>
          </u-collapse-item> -->

          <!-- 有限空间检测 -->
          <u-collapse-item name="gasDetectionRecord">
            <view class="title" slot="title">
              <view class="title-name">
                <view class="title-text">有限空间检测</view>
                <view class="star">*</view>
                <view v-if="this.rejectReason && this.rejectReason.gasDetectionRecordOk" class="view-reject"
                  @click.stop="clickShowModal('gasDetectionRecordOk')">(查看驳回)</view>
              </view>
              <view class="account">已上传{{gasDetectionRecordObj.count}}份</view>
            </view>
            <view class="select-area">
              <u-radio-group v-model="gasDetectionRecordRadiovalue" placement="row"
                @change="e => handleRadioChange(e, 'gasDetectionRecord')">
                <u-radio activeColor="#01c1a9" v-for="item in radioList"
                  :customStyle="{marginBottom: '8px', marginRight: '8px'}" :key="item.value" :label="item.label"
                  :name="item.value">
                </u-radio>
              </u-radio-group>
            </view>
            <view class="upload" v-if="gasDetectionRecordRadiovalue == 1">
              <u-upload width="186rpx" height="186rpx" uploadIconColor="#01c1a9"
                :fileList="gasDetectionRecordObj.fileList"
                @afterRead="file => afterRead('gasDetectionRecordObj', file) "
                @delete="file => deletePic('gasDetectionRecordObj', file)" name="large" multiple :maxCount="10">
              </u-upload>
            </view>
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
                @afterRead="file => afterRead('otherObj', file) " @delete="file => deletePic('otherObj', file)"
                name="other" multiple :maxCount="10">
              </u-upload>
            </view>
            <!-- </view> -->
          </u-collapse-item>
        </u-collapse>
      </view>
    </view>
    <view class="divider"></view>
    <view class="button-area" v-show="!hiddenBtn">
      <u-button class="save-btn btn-text" color="#0ab8a2" @click="clickSave">保存</u-button>
      <u-button class="commit-btn btn-text" :plain="true" @click="clickCommit">提交</u-button>
    </view>
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="modal-title">提示</view>
        <view>您确定要提交开工申请吗？</view>
        <view class="commit-modal-btn">
          <u-button class="cancel" @click="cancelCommit">取消</u-button>
          <u-button class="confirm" v-if="isCommiting" @click="confirmCommit" color="#0ab8a2">确定</u-button>
          <u-button class="confirm" v-else loading color="#0ab8a2"></u-button>
        </view>
      </view>
    </u-modal>
    <!--    <u-modal :show="showModal" :showCancelButton="true" :title="modalTitle" :asyncClose="true" @confirm="confirmCommit"
      @cancel="cancelCommit">
      <view class="slot-content">
        您确定要提交开工申请吗？
      </view>
    </u-modal> -->
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
    getFileDataDetail,
    judgeSyncIOperate
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
        riskUploadList: [],
        fileData: {
          workerNum: 0,
        }, // 保存时提交的数据对象
        temporaryData: {}, // 拉取详情的副本数据 保存时需其中的id type等几个字段
        safetyMeasuresPicObj: {
          count: 0,
          fileList: []
        },
        ticketObj: {
          count: 0,
          fileList: []
        },
        discloseObj: {
          count: 0,
          fileList: []
        },
        prospectObj: {
          count: 0,
          fileList: []
        },
        fireTicketObj: {
          count: 0,
          fileList: []
        },
        largeEquipmentObj: {
          count: 0,
          fileList: []
        },
        gasDetectionRecordObj: {
          count: 0,
          fileList: []
        },
        otherObj: {
          count: 0,
          fileList: []
        },
        riskExecuteList: [],
        riskExecuteCount: 0,
        showSaveModal: false,
        showRejectModal: true,
        titleText: '保存中',
        showRiskExecute: true,
        showText: '',
        rejectReason: {},
        isCommiting: true,
        fireRadiovalue: 1,
        equirpmentRadiovalue: 1,
        gasDetectionRecordRadiovalue: 1,
        radioList: [{
            value: 1,
            label: '有'
          },
          {
            value: 2,
            label: '无'
          }
        ],
        defaultOpen: ['tickets', 'safetyMeasuresPic', 'risk', 'record', 'invest', 'fireTicket', 'gasDetectionRecord',
          'other'
        ],
        hiddenBtn: false,
        isCanSync: false,
        syncData: {}
      }
    },
    components: {
      NavigateBar,
      ExamineReject
    },
    onShow() {
      this.getFileDataDetail()
      this.$nextTick(function() {
        this.$refs.collapseRef.init()
      })
      // this.loadFile()
      this.judgeSyncIOperate()
    },
    onLoad() {
      // this.getFileDataDetail()
      // uni.$on('saveSyncIData', this.saveSyncData)
    },
    onUnload() {
      // uni.$off('saveSyncIData')
    },
    mounted() {
      // 键盘弹起隐藏保存按钮,否则按钮会被顶上来
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
      // 判断可否同步
      judgeSyncIOperate() {
        judgeSyncIOperate().then(res => {
          console.log(res, '能否同步***************')
          if (res.code === 200) {
            const data = res.data
            this.isCanSync = data
          }
        }).catch(() => {})
      },
      // 同步到I国网
      syncSite() {
        if (!this.isCanSync) return
        uni.$u.route('/pages/index/plan/syncSiteDetail')
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
      // 单独为风险措施执行文件写的读取方法
      async afterRiskRead(riskId, file) {
        const target = this.riskExecuteList.find((item, index) => {
          item.index = index
          if (item.planRiskExecuteId == riskId) {
            return item
          }
        })
        console.log(target, 'targettargettargettarget');
        const fileArr = file.file
        let fileListLen = target.fileList.length
        if (fileArr.length) {
          target.count = fileListLen
        }
        const lists = [].concat(fileArr)
        lists.map(item => {
          target.fileList.push({
            ...item,
            status: 'uploading',
            message: '上传中'
          })
          // this.riskUploadList[target.index] = JSON.parse(JSON.stringify(target))
          this.riskUploadList[target.index] = uni.$u.deepClone(target)
          this.$forceUpdate()
        })
        for (let i = 0; i < lists.length; i++) {
          const result = await this.uploadFilePromise(lists[i].url)
          // JSON.parse(result.data).data 也就是上传成功后后端返回的唯一标识
          // 因为uni的upload方法将返回结果转为了字符串，故需解析
          const url = JSON.parse(result.data).data
          let item = target.fileList[fileListLen]
          item.commitUrl = url
          item.url = 'http://124.71.133.99:9000/suneng/' + url
          target.fileList.splice(fileListLen, 1, Object.assign(item, {
            status: 'success',
            message: '',
          }))
          fileListLen++
          this.riskExecuteCount++
          // this.riskUploadList[target.index] = JSON.parse(JSON.stringify(target))
          this.riskUploadList[target.index] = uni.$u.deepClone(target)
          this.$forceUpdate()
          // console.log(target.fileList, 'target.fileList');
          // console.log(this.riskExecuteList, 'this.riskExecuteListthis.riskExecuteList');
        }
        // this.riskUploadList[target.index] = JSON.parse(JSON.stringify(target))
        this.riskUploadList[target.index] = uni.$u.deepClone(target)
        console.log(this.riskUploadList, 'this.riskUploadList.riskUploadList');
        this.$forceUpdate()
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
            console.log(this.ticketObj, 'this.ticketObj this.ticketObj');
            // console.log(this[obj].fileList, 'this[obj].fileListthis[obj].fileList');
          },
          fail: res => {
            console.log(res, '失败了失败了失败了失败了失败了失败了失败了失败了失败了失败了');
          }
        });
      },
      // 下载图片 单独处理风险措施
      downLoadRiskFile(index, url) {
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
              commitUrl: url,
              url: DOWNLOAD_FILE_URL + url
              // url: 'http://124.71.133.99:9000/suneng/' + url
            }
            const arr = uni.$u.deepClone(this.riskExecuteList[index].fileList)
            arr.push(item)
            this.riskExecuteList[index].fileList = arr
            this.riskUploadList[index].fileList = arr
            // this.riskExecuteList[index].fileList.push(item)
            // this.riskUploadList[index].fileList.push(item)
            console.log(this.riskUploadList, 'this.riskUploadListthis.riskUploadList');
            this.riskExecuteCount++
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
            // url: 'https://linkgapie.com:19000/suneng3/',
            // url: 'http://192.168.2.20:8199/api/v2/file/upload',
            // url: 'http://192.168.2.101:8199/api/v2/file/upload',
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
              }, 500)
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
      deleteRiskPic(type, i, file) {
        const index = file.index
        const arr = uni.$u.deepClone(this.riskExecuteList)

        // 文件上传时禁止删除
        const picUploadVal = this.$checkPicStatus([arr[i].fileList])
        if (!picUploadVal) return

        arr[i].fileList.splice(index, 1)
        this.riskUploadList = arr
        this.riskExecuteList = arr
        this.riskExecuteCount--
        this.$forceUpdate()
      },
      // 单选框改变
      handleRadioChange(e, type) {
        console.log(e, type, 'eeeeeeeeeeeeeeeee');
        if (type == 'fire') {
          this.fireRadiovalue = e
          if (e == 2) {
            this.fireTicketObj.fileList = []
            this.fireTicketObj.count = 0
          }
        } else if (type == 'equirpment') {
          this.equirpmentRadiovalue = e
          if (e == 2) {
            this.largeEquipmentObj.fileList = []
            this.largeEquipmentObj.count = 0
          }
        } else if (type == 'gasDetectionRecord') {
          this.gasDetectionRecordRadiovalue = e
          if (e == 2) {
            this.gasDetectionRecordObj.fileList = []
            this.gasDetectionRecordObj.count = 0
          }
        }
      },
      // 保存前校验动火票和大型设备是否选择
      checkSelect() {
        if (this.fireRadiovalue == 1 && !this.fireTicketObj.fileList.length) {
          uni.showToast({
            title: '请上传动火票',
            icon: 'error',
            duration: 1500
          })
          return
        }
        // if (this.equirpmentRadiovalue == 1 && !this.largeEquipmentObj.fileList.length) {
        //   uni.showToast({
        //     title: '请上传大型设备',
        //     icon: 'error',
        //     duration: 1500
        //   })
        //   return
        // }
        if (this.gasDetectionRecordRadiovalue == 1 && !this.gasDetectionRecordObj.fileList.length) {
          uni.showToast({
            title: '请上传有限空间检测',
            icon: 'error',
            duration: 1500
          })
          return
        }
        return true
      },
      // 保存前的数据处理
      handleSaveData() {
        const picUploadVal = this.$checkPicStatus([this.safetyMeasuresPicObj.fileList, this.ticketObj.fileList, this
          .prospectObj.fileList, this.fireTicketObj.fileList, this.gasDetectionRecordObj.fileList, this.otherObj
          .fileList
        ])
        if (!picUploadVal) return
        const arr = ['ticketObj', 'safetyMeasuresPicObj', 'prospectObj', 'fireTicketObj',
          'largeEquipmentObj', 'gasDetectionRecordObj', 'otherObj'
        ]
        let saveData = {}
        if (this.safetyMeasuresPicObj.fileList.length) {
          const newArr = this.safetyMeasuresPicObj.fileList.map(item => item.commitUrl)
          saveData.safetyMeasuresPic = newArr.toString()
        }
        if (this.ticketObj.fileList.length) {
          const newArr = this.ticketObj.fileList.map(item => item.commitUrl)
          saveData.tickets = newArr.toString()
        }
        // if (this.discloseObj.fileList.length) {
        //   const newArr = this.discloseObj.fileList.map(item => item.commitUrl)
        //   saveData.disclosureRecord = newArr.toString()
        // }
        if (this.prospectObj.fileList.length) {
          const newArr = this.prospectObj.fileList.map(item => item.commitUrl)
          saveData.investigateRecord = newArr.toString()
        }
        if (this.fireTicketObj.fileList.length) {
          const newArr = this.fireTicketObj.fileList.map(item => item.commitUrl)
          saveData.fireTicket = newArr.toString()
        }
        if (this.largeEquipmentObj.fileList.length) {
          const newArr = this.largeEquipmentObj.fileList.map(item => item.commitUrl)
          saveData.largeEquipment = newArr.toString()
        }
        if (this.gasDetectionRecordObj.fileList.length) {
          const newArr = this.gasDetectionRecordObj.fileList.map(item => item.commitUrl)
          saveData.gasDetectionRecord = newArr.toString()
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
        // saveData.riskExecuteList = this.riskExecuteList
        // const riskExecuteList = this.riskExecuteList
        // const riskUploadList = uni.$u.deepClone(this.riskUploadList)
        const riskUploadList = uni.$u.deepClone(this.riskExecuteList)
        riskUploadList.forEach(item => {
          if (item.fileList.length) {
            let arr = item.fileList.map(item => item.commitUrl)
            item.fileIds = arr.toString()
            delete item.fileList
            delete item.count
            delete item.index
          } else {
            delete item.fileList
            delete item.count
          }
        })
        saveData.riskExecuteList = riskUploadList
        // 着重处理 riskExecuteList
        console.log(this.riskExecuteList, 'this.riskExecuteListthis.riskExecuteList');
        console.log(this.riskUploadList, 'this.riskExecuteListthis.riskExecuteList');
        const workerNum = this.fileData.workerNum
        this.fileData = {
          workerNum,
          ...saveData
        }
      },
      // 点击保存回到现场管控
      clickSave() {
        const checkSelectValue = this.checkSelect()
        if (!checkSelectValue) return
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
        // const arr = ['ticketObj', 'safetyMeasuresPicObj', 'prospectObj']
        const arr = ['ticketObj', 'prospectObj']
        const target = arr.find(item => !this[item].fileList.length)
        const workerNum = this.fileData.workerNum
        // if (!target && workerNum && this.riskExecuteCount) {
        if (!target && workerNum) {
          return true
        } else {
          return false
        }
      },
      // 点击提交出弹窗
      clickCommit() {
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
        // this.handleSaveData()
        console.log(this.fileData, 'this.saveDatathis.saveData');
        this.isCommiting = false
        commitFileData(this.fileData).then(res => {
          console.log(res, '提交返回的res9999999999');
          if (res.code === 200) {
            setTimeout(() => {
              uni.showToast({
                title: '提交成功',
                duration: 1000
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
            this.showModal = false
            this.isCommiting = true
            setTimeout(() => {
              uni.showToast({
                title: res.msg,
                duration: 1000,
                icon: 'error'
              })
            }, 500)
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
        this.splicingSyncData() // 调用拼接方法
        
        const constructionPlanId = this.$store.state.currentProject.id
        const type = this.$store.state.currentProject.type || 'START'
        const objArr = ['safetyMeasuresPicObj', 'ticketObj', 'prospectObj', 'fireTicketObj',
          'largeEquipmentObj', 'gasDetectionRecordObj', 'otherObj'
        ]
        getFileDataDetail({
            constructionPlanId,
            type
          })
          .then(res => {
            console.log(res, '页面获取的详情');
            if (res.code === 200) {
              this.temporaryData = res.data
              this.fileData.workerNum = res.data.workerNum
              // 需要特殊处理 风险措施，因为需要动态生成上传组件
              this.riskExecuteList = res.data.riskExecuteList
              if (this.riskExecuteList.length) {
                this.riskExecuteList.forEach((item, index) => {
                  item.fileList = []
                  item.count = 0
                  this.riskUploadList[index] = {}
                  this.riskUploadList[index].fileList = []
                  if (item.fileIds) {
                    const newArr = item.fileIds.split(',')
                    newArr.forEach(arrItem => {
                      this.downLoadRiskFile(index, arrItem)
                    })
                  }
                })
                this.showRiskExecute = true
              } else {
                this.showRiskExecute = false
              }

              // this.splicingSyncData() // 调用拼接方法

              const data = res.data
              this.rejectReason = data.audit
              if (data.safetyMeasuresPic) {
                const newArr = data.safetyMeasuresPic.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[0], item)
                })
              }
              if (data.tickets) {
                const newArr = data.tickets.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[1], item)
                })
              }
              // if (data.disclosureRecord) {
              //   const newArr = data.disclosureRecord.split(',')
              //   newArr.forEach(item => {
              //     this.downLoadFile(objArr[2], item)
              //   })
              // }
              if (data.investigateRecord) {
                const newArr = data.investigateRecord.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[2], item)
                })
              }
              if (data.fireTicket) {
                this.fireRadiovalue = 1
                const newArr = data.fireTicket.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[3], item)
                })
              } else {
                this.fireRadiovalue = 2
              }
              if (data.largeEquipment) {
                this.equirpmentRadiovalue = 1
                const newArr = data.largeEquipment.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[4], item)
                })
              } else {
                this.equirpmentRadiovalue = 2
              }
              if (data.gasDetectionRecord) {
                this.gasDetectionRecordRadiovalue = 1
                const newArr = data.gasDetectionRecord.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[5], item)
                })
              } else {
                this.gasDetectionRecordRadiovalue = 2
              }
              if (data.other) {
                const newArr = data.other.split(',')
                newArr.forEach(item => {
                  this.downLoadFile(objArr[6], item)
                })
              }
            }
          }).catch(e => {
            console.log(e, '报错了*****************************');
          })
      },
      // 另存拼接的数据
      saveSyncData(data) {
        console.log(data, 'data*******************');
        this.syncData = data
      },
      // 拼接数据
      splicingSyncData() {
        // const data = this.syncData        
        // const id = this.$store.state.currentProject.id
        const data = this.$store.state.syncIData
        console.log(data, 'tongbuchuanlaide1shuju');
        const objArr = ['safetyMeasuresPicObj', 'ticketObj', 'prospectObj', 'otherObj']
        if (data) {
          if (data.safetyMeasuresFileList && data.safetyMeasuresFileList.length) {
            data.safetyMeasuresFileList.forEach(item => {
              this.downLoadFile(objArr[0], item)
            })
          }
          if (data.ticketFileList && data.ticketFileList.length) {
            data.ticketFileList.forEach(item => {
              this.downLoadFile(objArr[1], item)
            })
          }
          if (data.investigationFileList && data.investigationFileList.length) {
            data.investigationFileList.forEach(item => {
              this.downLoadFile(objArr[2], item)
            })
          }
          if (data.otherFileList && data.otherFileList.length) {
            data.otherFileList.forEach(item => {
              this.downLoadFile(objArr[3], item)
            })
          }
          setTimeout(() => {
            console.log(this.otherObj, 'ticketObjticketObj');
          }, 30 * 1000)
        }
      },
      // 返回上一页
      toGoBack() {
        uni.$u.route('/pages/index/plan/siteControl')
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

      .synchro {
        color: #01c1a9;
      }

      .no-sync {
        color: #999;
      }
    }
  }

  .material {
    padding: 17rpx 38rpx 170rpx 36rpx;

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

    .view-reject {
      margin-left: 8rpx;
      color: #FF3260;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .divide-line {
      margin: 16rpx 0 !important;
    }

    ::v-deep .u-radio__icon-wrap {
      border-color: #01c1a9 !important;
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

      .right-icon {
        padding: 0 !important;
        margin: 0 !important;
        // transform: translateX(10rpx);
        position: absolute;
        right: -20rpx;
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
          // margin-left: auto;
          height: 76rpx;
          line-height: 76rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }

      .select-area {
        margin-bottom: 5rpx;
      }

      .risk-upload {
        .desc-text {
          margin-bottom: 22rpx;
        }
      }

      .upload-container {
        padding: 0 2rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

      }
    }

  }

  .button-area {
    // position: absolute;
    position: fixed;
    z-index: 99;
    width: 100%;
    // padding-bottom: 33rpx;
    bottom: 0;
    left: 0;
    display: flex;
    padding: 30rpx 30rpx 33rpx 30rpx;
    box-sizing: border-box;
    background-color: #FFFFFF;
    border-top: 2rpx solid #f0f2f5;
    // background-color: #f0f2f5;

    .save-btn {
      margin-right: 19rpx;
    }

    .commit-btn {
      border: 2rpx solid #0AAA96;
      color: #0EAB97 !important;
    }
  }

  .btn-text {
    font-size: 34rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
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
