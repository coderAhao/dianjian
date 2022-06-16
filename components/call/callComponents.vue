<template>
  <view>
    <!-- 组件使用方法 -->
    <!-- 1. 父组件直接调用 call 方法 开始拨打电话 -->
    <view></view>
  </view>
</template>
<script>
  export default {
    onLoad(options) {
      // 默认弹窗
      this.$store.dispatch('upDataPopubId', 'poPup');
      if (options.state === 'end' || options.state === 'abnormityEnd') {
    	   setTimeout(() => {
          this.$Utils.hintInfo(options.state === 'end' ? '通话已结束' : '通话异常', options.state === 'end' ?
            'success' : 'warn');
    	   }, 800)
      }
    },
    data() {
      return {
        // 对方 uid
        peeerUid: '3736',
        // 频道id
        channelId: '',
        windowWidth: 200,
        windowHeight: 200,
        callTypeList: ["视频呼叫", "语音呼叫"],

        disabledCall: true,
      }
    },
    created() {
      // 默认弹窗
      this.$store.dispatch('upDataPopubId', 'poPup-p2p');
      let _this = this;
    	 uni.getSystemInfo({
        success: function(res) {
          _this.windowWidth = res.windowWidth;
          _this.windowHeight = res.windowHeight;
        }
      })
    },
    onShow() {
      this.disabledCall = true
    },
    methods: {
      // 打电话
      call(phone = '8888') {
        // this.$u.route('/pages/rtc/p2p');
        this.channelId = phone.toString()
        this.peeerUid = phone.toString()
        this.startCallFn()
      },
      // 修改disabledCall值
      changeCallValue() {
        this.disabledCall = true
      },
      // 来时呼叫
      async startCallFn() {
        if (this.peeerUid) {
          // 先查询是否在线
          console.log(this.peeerUid, 'if');
      		  if (await this.PeersOnlineStatusFn()) {
            const oIndex = await new Promise((resolve, reject) => {
              /**
               * 视频和语音弹窗，将其注释掉，直接走视频通话
              * */ 
              // uni.showActionSheet({
              // 	itemList: this.callTypeList,
              // 	success: function(res) {
              //    console.log(res, 'resres12312312');
              // 		resolve(res);
              // 	},
              // });
              /**
               * 直接走resolve
              **/
              const obj = {
                "errMsg": "showActionSheet:ok",
                "tapIndex": 0
              }
              resolve(obj)
            });
            console.log(this.disabledCall, 'this.disabledCallthis.disabledCallthis.disabledCall');
       			  if (this.disabledCall) {
              // this.disabledCall = false; // RTC源代码 将其注释掉 否则循环打电话只会拨打一次
              this.callFn(oIndex.tapIndex);
            }
          } else {
            console.log('不在线9999999');
            // uni.showToast({
            //   title: '呼叫用户不在线',
            //   mask: false,
            // 	 duration: 1000,
            //   icon: "none"
            // });
            // this.$Utils.hintInfo('呼叫用户不在线', 'error');
            uni.$emit('callFailBack', {code: 3, mes: '呼叫用户不在线'})
            this.disabledCall = true;
          }
        } else {
          console.log(this.peeerUid, 'else');
          this.$Utils.hintInfo("请输入正确的用户，呼叫对象不能为自己", "error");
        }
      },
      // 发起呼叫
      async callFn(num) {
        if (await this.PeersOnlineStatusFn()) {
          // 生成随机频道Id
          // this.channelId = await this.$Utils.generateNumber(9);
          // 携带信息
          const oTnfo = {
            Mode: num, // 呼叫类型 视频通话 0 语音通话 1
            Conference: false, // 是否是多人会议
            ChanId: this.channelId + '', // 频道房间
            UserData: "",
            SipData: "",
            VidCodec: ["H264"],
            AudCodec: ["Opus"],
          }
          // 发起呼叫
          const code = await this.$RTM.sendLocalInvitation(this.peeerUid, oTnfo);
          console.log("发起呼叫", code);
          if (code != 0 && code != 5) {
            console.log(code, '123465789');
            this.$Utils.hintInfo('调用 sendLocalInvitation 发送呼叫失败');
            this.disabledCall = true;
          } else {
            // this.disabledCall = false; // RTC源代码 将其注释掉 否则循环打电话只会拨打一次
          }
        } else {
      		  this.$Utils.hintInfo('呼叫用户已离线', 'error');
          this.disabledCall = true;
        }
      },
      // 判断呼叫对象人员在线
      async PeersOnlineStatusFn() {
        // 查看呼叫用户是否存在
       	const queryPeersOnline = await this.$RTM.queryPeersOnlineStatus([this.peeerUid]);
        console.log("查看呼叫用户是否存在", queryPeersOnline);
        if (queryPeersOnline.code === 0 && queryPeersOnline.peerOnlineStatus[0].state != 2) {
        // 有时用户在线 但RTC返回的数据无peerOnlineStatus 尝试去掉一个判断条件
        // if (queryPeersOnline.code === 0) {
          return true
        } else {
          return false
        }
      }

    }
  }
</script>

<style scoped lang="scss">

</style>
