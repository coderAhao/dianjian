<template>
  <view class="con">
    <!-- 更新弹窗 -->
    <u-modal class="modal" width="550rpx" :show="showModal" :showConfirmButton="false">
      <view class="slot-content">
        <view class="icon">
          <image class="img" src="/static/images/icon/update_version.png"></image>
        </view>
        <view class="modal-title">提示</view>
        <view class="info">{{'当前版本(' + this.version + ')较低，为能更好的使用请更新至最新版本！'}}</view>
        <view class="process" v-if="!showBtn">
          <u-line-progress :percentage="percent" :showText="false" activeColor="#0ab8a2"></u-line-progress>
          <view class="process-text">当前下载进度：{{percent + '%'}}</view>
        </view>
        <view class="commit-modal-btn" v-else>
          <u-button class="confirm"  @click="downloadApp" color="#0ab8a2">立即更新</u-button>
        </view>
      </view>
    </u-modal>
  </view>
</template>
<script>
  import {getVersion,getAppDownload} from '../../api/index.js'
  // import {APP_VERSION_URL} from '../../request/baseUrl.js'
  
  export default {
    data() {
      return {
        dtask: null,
        // versionUrl: APP_VERSION_URL,
        versionUrl: null,
        percent: 0,
        versionCode: '无',
        version: '无',
        name: '无',
        showModal: false,
        showBtn: true,
        versionVal: '1.0.0'
      }
    },
    created() {
      // this.getAppDownload()
    },
    methods: {
      // 拉取最新得版本号
      getVersion() {
        getVersion().then(res => {
          console.log(res);
          if (res.code === 200) {
            this.versionVal = res.data.versionName
            this.getInfo()
          }
        }).catch(e => {
          console.log(e, 'app版本获取失败');
        })
      },
      // 拉取下载链接
      getAppDownload() {
        getAppDownload().then(res => {
          console.log(res, '版本链接');
          if (res.code === 200) {
            this.versionUrl = res.data.versionName
            this.getVersion()
          }
        }).catch((e) => {
          console.log(e, '报错');
        })
      },
      // 获取版本信息
      getInfo() {
        const _this = this
        plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
          _this.name = wgtinfo.name
          _this.versionCode = wgtinfo.versionCode
          _this.version = wgtinfo.version
          if (_this.version < _this.versionVal) {
            _this.showModal = true            
          } else {
            _this.$emit('isCanLogin', 1) // 本机版本不低于数据库版本则可以登录
          }
          console.log(wgtinfo, 'wgtinfowgtinfo');
          console.log(wgtinfo.version, 'version');
          console.log(_this.versionVal, 'versionVal');
        });
      },
      // 下载APP
      downloadApp() {
        this.showBtn = false
        const _this = this
        this.dtask = plus.downloader.createDownload(this.versionUrl)
        this.dtask.addEventListener('statechanged', function(task, status) {
          console.log(task, status);
          if (task.state === 3) {
            try {
              _this.percent = Math.floor((task.downloadedSize / task.totalSize) * 100)
            } catch (e) {
              console.log(e);
            }
          } else if (task.state === 4) {
            plus.runtime.install(task.filename, {}, function() {
              this.showBtn = true
              plus.runtime.restart()
            })
          }
        })
        this.dtask.start()
      }
    }
  }
</script>
<style scoped lang="scss">

  // 弹窗
  .icon {
    text-align: center;
    .img {
      width: 152rpx;
      height: 152rpx;
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
  .info {
    text-align: center;
    font-size: 28rpx;
    font-family: PingFangSC-Regular-, PingFangSC-Regular;
    font-weight: normal;
    color: #666666;
  }
.process {
  margin-top: 20rpx;
  text-align: center;
  font-size: 28rpx;
  font-family: PingFangSC-Regular-, PingFangSC-Regular;
  font-weight: normal;
  color: #666666;
  .process-text {
    margin-top: 15rpx;
  }
}
.commit-modal-btn {
    display: flex;
    margin-top: 57rpx;

    .confirm {
      flex: 1;
      // font-size: 32rpx;
      color: #0ab8a2;
      border: 1rpx solid #0ab8a2;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
</style>
