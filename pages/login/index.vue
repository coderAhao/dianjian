<template>
  <view class="white-pannel">
    <!-- 标题 -->
    <view class="title">
      电力施工平台
    </view>
    <!-- 账号与密码 -->
    <view class="input-row u-border-bottom">
      <input class="input" clearable v-model.trim="form.loginName" @input="handleNameChange" placeholder="请输入账号"
        style="color:#333333;font-size: 32rpx;"></input>
    </view>
    <view class="input-row u-border-bottom">
      <input class="input" :password="inputType"  @input="handlePasswordChange" clearable v-model.trim="form.password"
        placeholder="请输入密码" style="color:#333333;font-size: 32rpx;"></input>
      <view class="icon-container" @click="showPassWord">
        <image class="input-icon" v-if="!inputType" src="/static/images/icon/show_pwd.png" mode="aspectFill"></image>
        <image class="input-icon" v-else src="/static/images/icon/hide_pwd.png" mode="aspectFill"></image>
      </view>
    </view>
    <!-- 记住密码 -->
    <view class="remember">
      <u-checkbox-group @change="checkboxChange" v-model="checkboxValue">
        <u-checkbox :customStyle="{marginBottom: '8px'}" label="记住密码" name="isTrue" activeColor="#01c1a9">
        </u-checkbox>
      </u-checkbox-group>
    </view>
    <!-- 登录 -->
    <view class="login-button" :class="this.active ? 'active-login-button' : ''" @click="clickLogin(0)">登录</view>
    <!-- 协议与隐私 -->
    <view class="privacy">
      阅读<span class="agreement">《用户协议》</span>与<span class="agreement">《隐私政策》</span>
    </view>
    <view class="login_bottom_left">
      <image class="login_left_img" src="/static/images/img/login_bottom_left.png"></image>
    </view>
    <view class="login_bottom_right">
      <image class="login_right_img" src="/static/images/img/login_bottom_right.png"></image>
    </view>
    <view class="version" v-show="!hiddenVersion">{{'版本：' + version}}</view>
    <!-- 加载页 -->
    <u-loading-page class="loading-page" :loading="pageLoading" bgColor="#01c1a9" loading-color="#01c1a9"
      loading-text="登录中,请稍等" color="#01c1a9">
      <image class="page-slogan" src="/static/images/img/start_page_slogan.png" mode=""></image>
      <image class="page-company" src="/static/images/img/start_page_company.png" mode=""></image>
    </u-loading-page>
    <!-- 版本更新弹窗 -->
    <UpdateVersion ref="updateRef" @isCanLogin="clickLogin" />
  </view>
</template>

<script>
  import {
    getLogin
  } from '../../api/index.js'
  import UpdateVersion from '../../components/update-version/updateVersion.vue'
  
  // import {stopNotify} from '../../util/rtc/music.js'
  export default {
    data() {
      return {
        form: {
          loginName: '',
          password: null
        },
        inputType: true,
        checkboxValue: ['isTrue'],
        pageLoading: false,
        active: false,
        version: null,
        hiddenVersion: false
      }
    },
    components: {
      UpdateVersion
    },
    mounted() {
      // 键盘弹起隐藏版本,否则版本号会被顶上来
      uni.onKeyboardHeightChange(res => {
        this.hiddenVersion = res.height !== 0 ? true : false 
      })
    },
    onShow() {      
      this.$store.commit('startRtm', 0);
      this.$store.dispatch('upDataUId', '9999999999'); // 随便给赋值个号码
      setTimeout(() => {
        console.log(this.$store.state.uid, '同步this.$store.state.uid');
        this.$RTM.init(); // 将随便的号码当成初始化的，用来销毁rtc账号
      }, 1000)
      
      this.fillPassword()
      this.handleNameChange()
      this.handlePasswordChange()
      this.getVersion()
    },
    methods: {
      // 输入账号密码后登陆按钮高亮
      handleNameChange() {
        console.log(this.form.loginName, this.form.password, 'this.form.password');
        this.active = this.form.loginName && this.form.password ? true : false
      },
      handlePasswordChange() {
        console.log(this.form.loginName, this.form.password, 'this.form.password');
        this.active = this.form.loginName && this.form.password ? true : false
      },
      // 根据是否记住密码 自动填入密码
      fillPassword() {
        // const password = this.$userlogin.getPassword()
        const formData = this.$userlogin.getPassword()
        if (formData && formData.password) {
          this.checkboxValue = ['isTrue']
          this.form.loginName = formData.loginName
          this.form.password = formData.password
        } else {
          this.checkboxValue = []
          this.form.loginName = null
          this.form.password = null
        }
      },
      // 是否记住密码
      rememberPassword() {
        const value = this.checkboxValue.length
        const password = this.form.password
        if (value) {
          console.log(value, 'valuevaluevalue');
          this.$userlogin.savePassword(this.form)
          // this.$userlogin.savePassword(password)
        } else {
          this.$userlogin.savePassword(null)
        }
      },
      // 展示密码
      showPassWord() {
        this.inputType = !this.inputType
      },
      // 记住密码
      checkboxChange(val) {
        this.checkboxValue = val.length ? ['isTrue'] : []
      },
      // 校验登录
      checkLogin() {
        const loginName = this.form.loginName
        const password = this.form.password
        if (loginName === '' || loginName === null || loginName === undefined) {
          uni.showToast({
            title: '用户名不可为空',
            duration: 2000,
            icon: 'error'
          })
          return false
        }
        if (password === '' || password === null || password === undefined) {
          uni.showToast({
            title: '密码不可为空',
            duration: 2000,
            icon: 'error'
          })
          return false
        }
        return true
      },
      // 登录
      clickLogin(options) {
        console.log(options, 'options');
        if (!options) {
          this.$refs.updateRef.getAppDownload()
          return
        }
        console.log('点击了登录')
        const checkLoginVal = this.checkLogin()
        if (!checkLoginVal) return
        this.pageLoading = true
        getLogin(this.form).then(res => {
          console.log(res, '111111');
          if (res.code === 200) {
            setTimeout(() => {
              this.pageLoading = false
              this.$userlogin.saveToken(res.data.token)
              this.$userlogin.saveUser(res.data.user)
              // 将电话作为打电话时的呼叫id存储到store中 拿字段phoneV 不要phone
              let rtcId = res.data.user.phoneV
              if (rtcId) {
                rtcId = res.data.user.phoneV.toString()
              } else {
                // 注:此行else由于后端未返回phoneV所写, 真正运行时需将其删除
                rtcId = '1650437867'
              }
              this.$store.dispatch('upDataUId', rtcId);
              console.log(this.$store.state.uid, '同步this.$store.state.uid');
              setTimeout(() => {
                console.log(this.$store.state.uid, '异步this.$store.state.uid');
              }, 1500)
              this.rememberPassword()
              this.$u.route({
                type: 'tab',
                url: '/pages/index/index'
              })
            }, 200)
          } else {
            setTimeout(() => {
              this.pageLoading = false
              uni.showToast({
                title: res.msg,
                duration: 2000,
                icon: 'error'
              })
            }, 500)
          }
        }).catch(e => {
          console.log(e, 'eeeeeeeeeeeeeeeeeeee');
          setTimeout(() => {
            this.pageLoading = false
            uni.showToast({
              title: '系统或网络错误',
              duration: 2000,
              icon: 'error'
            })
          }, 500)
        })
      },
      // 获取版本信息
      getVersion() {
        const _this = this
        plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
          _this.version = wgtinfo.version
          console.log(wgtinfo, 'wgtinfowgtinfo');
        });
      },
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #fff;
  }

  .white-pannel {
    padding: 283rpx 65rpx 0;
    background-color: white;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }

  .image-logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }

  .title {
    margin-bottom: 125rpx;
    height: 81rpx;
    line-height: 81rpx;
    font-size: 58rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    text-align: center;
  }

  .input-row {
    width: 100%;
    display: flex;
    align-items: center;
    height: 110rpx;

    .input-icon {
      width: 40rpx;
      height: 40rpx;
    }

    .input {
      flex: 1;
      margin-left: 20rpx;
      font-size: 30rpx;
      color: #999999;
    }
  }

  .remember {
    margin-top: 36rpx;
    text-align: left;
  }

  .login-button {
    width: 620rpx;
    height: 100rpx;
    margin-top: 76rpx;
    line-height: 100rpx;
    border-radius: 10rpx;
    font-size: 34rpx;
    text-align: center;
    background-color: #4dd3c2;
    color: white;
  }

  .active-login-button {
    background-color: #0EAB97;
  }

  .privacy {
    margin-top: 114rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    text-align: center;

    .agreement {
      // color: #4dd3c2;
      color: #0EAB97;
    }
  }

  .login_bottom_left {
    position: absolute;
    z-index: -99;
    bottom: 109rpx;
    left: 65rpx;

    .login_left_img {
      width: 295rpx;
      height: 281rpx;
    }
  }

  .login_bottom_right {
    position: absolute;
    bottom: 0;
    right: 0;

    .login_right_img {
      width: 370rpx;
      height: 339rpx;
    }
  }

  // 加载页
  .loading-page {
    position: relative;

    .page-slogan {
      width: 531rpx;
      height: 156rpx;
    }

    .page-company {
      position: absolute;
      bottom: 171rpx;
      // left: 0;
      // right: 0;
      width: 367rpx;
      height: 88rpx;
    }
  }
  .version {
    text-align: center;
    position: fixed;
    z-index: 99;
    bottom: 30rpx;
    left: 0;
    right: 0;
    color: #01C1A9;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
  }
</style>
