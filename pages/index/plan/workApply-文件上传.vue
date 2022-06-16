<template>
  <view>
    <view class="">提交开工资料</view>
    <u-button @click="open">选择文件13</u-button>
    <view class="material">
      <view>
        <view class="title">
          <view class="title-name">
            <view class="title-text">工作票/任务单</view>
            <view class="star">*</view>
          </view>
          <view class="account">已上传3份</view>
        </view>
        <view class="upload">
          <!--          <u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="10">
          </u-upload> -->
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  var AfDocument = uni.requireNativePlugin("Aq-ChooseFile");
  import {
    getDetailList,
    getUpload
  } from '../../api/index.js'
  import UserLogin from '../../common/userlogin.js'
  
  export default {
    data() {
      return {
        action: 'http://192.168.2.101:8199/api/v2/file/upload',
        fileList: [],
        data: null,
        img: null
      }
    },
    onShow() {
      const a = uni.getSystemInfoSync()
      console.log(a, 'aaaaaaaaa');
    },
    methods: {
      upload() {
        this.$refs.files.upload()
      },
      // 文件读取后
      afterRead(file) {
        console.log(file, 'file')
        const formatImg = /(png|jpg|jpeg)$/i
        // file.forEach(item => {
        //   const formatImgVal = formatImg.test(item.type)
        //   if () {

        //   }
        // })
      },
      newm(fileInfo) {
        let uploadFileTask = plus.uploader.createUpload(
          // "http://192.168.2.101:8199/api/v2/file/upload", {
          "http://192.168.2.12:8199/api/v2/file/upload", {
            method: "POST",priority: 100
            // header: {
            //   // 修改请求头Content-Type类型 此类型为文件上传
            //   "Content-Type": "multipart/form-data",
            //   'Authorization': 'Bearer ' + UserLogin.getToken()
            // }
          },
          // data：服务器返回的响应值 status: 网络请求状态码
          (data, status) => {
            console.log(data, '9999**********************');
            console.log(status, '666666666');
            // 请求上传文件成功
            // if (status == 200) {
            //   // 获取data.responseText之后根据自己的业务逻辑做处理
            //   let result = data.responseText;
            // }
            // // 请求上传文件失败
            // else {
            //   console.log("上传失败", status)
            // }
          }
        );
        
        uploadFileTask.setRequestHeader('Authorization','Bearer ' + UserLogin.getToken());
        uploadFileTask.setRequestHeader('Content-Type', "multipart/form-data");
        let addFile = uploadFileTask.addFile(fileInfo.pathHolp, {
        		key: "icon_single.png" // 填入图片文件对应的字段名
        });
        uploadFileTask.addData( 'name', fileInfo.name );
        console.log('uploadFileTask.uploadFileTask____________________________',uploadFileTask)
        uploadFileTask.start()
      },
      open() {
        AfDocument.openMode({
          size: '10', //选择总数量
          // paths: ['/storage/emulated/0/Download', '/storage/emulated/0/A', ], //自定义选择目录
          isDown: true, //是否下钻（true 筛选当前目录以下的所有文件，fales 只筛选当前目录文件） 
          types: [{
            name: '文档',
            value: ["doc", "wps", "docx", "xls", "xlsx", "pdf"]
          }, {
            name: '视频',
            value: ["mp4"]
          }, {
            name: '音乐',
            value: ['mp3', 'flac']
          }, {
            name: '图片',
            value: ['jpg', 'png']
          }]
        }, (res) => {
          console.log(res, '132456');
          this.img = res.res[0].pathHolp
          this.newm(res.res[0])
          // this.data = JSON.stringify(res);
        })
      },


    }
  }
</script>
<style scoped lang="scss">
  .material {
    padding: 0 38rpx 0 36rpx;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 37rpx;

      .title-name {
        display: flex;
        align-items: center;

        .title-text {
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
      }

      .account {
        height: 76rpx;
        line-height: 76rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }

    .webview {
      position: absolute;
      top: 300rpx;
      left: 10rpx;
      width: 600rpx;
      height: 500rpx;
    }
  }
</style>
