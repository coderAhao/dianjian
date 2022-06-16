<template>
  <view>
    <view class="contain">
      <view>
      <image class="img" src="/static/images/img/no_data_bg.png"></image>
      <view class="desc">别着急，正在开发中哟</view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>
<style scoped lang="scss">
  .contain {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .desc {
      text-align: center;
      color: #999999;
    }
    .img {
      width: 400rpx;
      height: 290rpx;
    }
  }
</style>
