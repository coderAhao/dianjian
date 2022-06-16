<template>
  <view>
    <view class="container">
      <view @click="goBack">
        <image class="go-back-icon" src="/static/images/icon/go_back.png"></image>
      </view>
      <slot name="navigatreText"></slot>
      <view><slot name="define"></slot></view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      goBack() {
        this.$emit('toGoBack')
      }
    },
  }
</script>
<style scoped lang="scss">
  .container {
    height: 156rpx;
    padding-top: 86rpx;
    box-sizing: border-box;
    background-color: #01c1a9;
    display: flex;
    justify-content: space-around;
    // height: 48px;
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    // line-height: 48px;

    .go-back-icon {
      transform: translateX(-40rpx);
      width: 26rpx;
      height: 46rpx;
    }
  }
</style>
