<template>
  <view>
   <u-modal class="modal" :show="showModal" :showConfirmButton="false">
     <view class="slot-content">
       <view class="title">驳回理由</view>
       <view class="text">{{ showText }}</view>
        <view class="btn" @click="clickClose">关闭</view>
     </view>
   </u-modal>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        showModal: false,
      }
    },
    props: {
      showText: {
        // type: Object,
        // default: () => {
        //   return {}
        // }
        type: String
      }
    },
    methods: {
      // 关闭弹窗
      clickClose() {
        this.showModal = false
      },
      // 开启弹窗
      clickShow() {
        this.showModal = true
      }
    },
  }
</script>
<style scoped lang="scss">
  .modal {
    width: 620rpx;
  }
  .slot-content {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    .title {
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 40rpx;
    }
    .text {
      margin-bottom: 40rpx;
      font-size: 34rpx;
      font-weight: 400;
      min-height: 80rpx;
    }
  }
  .btn {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #0ab8a2;
    color: #FFFFFF;
  }
</style>
