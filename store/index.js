import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		popubId: '', // 弹窗 ID
		uid: '', // 本地用户 uid
		startRtmVal: 0, // 0全局未触发RTM
    callPageData: {}, // 通话界面展示的数据
    currentProject: {}, // 首页列表的item
    startRecordData: {},
    uniAcceptCode: 0,
    safeDetailId: null, // 进到安全督查页面是否拉详情
    qualityDetailId: null, // 进到质量缺陷页面是否拉详情
    rtmLoginStatus: null, // 默认登录不成功
    pcCallerNumber: null, // pc端打来的电话
    syncIData: null // 同步I国网的数据 将其带到开工申请进行拼接
	},
	mutations: {
		// 更新弹窗 ID
		upDataPopubId(state, data) {
			state.popubId = data;
		},
		// 更新本地用户 uid 即登录时的phoneV
		upDataUId(state, data) {
			state.uid = data;
		},	
		//  uid
		startRtm(state, data) {
			state.startRtmVal = data;
		},
    // 进到现场管控 保存当前项目的id、状态等 拉取详情或提交文件时用 
    saveSiteControlItem(state, data) {
      state.currentProject = data
    },
    // 拉取文件详情或时用到type 在首页获取到id 进到现场管控获才取到type 而拉取文件详情时两者都需要 即拉详情时要不同的页面获取的数据
    saveSiteProjectType(state, data) {
      state.currentProject.type = data
    },
    // 通话界面展示的数据
    showCallPageData(state, data) {
      state.callPageData = data
    },
    // 开始录制视频
    startRecordVideo(state, data) {
      state.startRecordData = data
    },
    // 移动端接听 调用审核后的结果
    changeAcceptCode(state, data) {
      state.uniAcceptCode = data
    },
    // 在现场管控页面查询是否有安全督查 若有将其id值存起来，进入到安全督查页面拉取详情使用
    saveSafeDetailId(state, data) {
      state.safeDetailId = data
    },
    // 在现场管控页面查询是否有质量缺陷 若有将其id值存起来，进入到质量缺陷页面拉取详情使用
    saveQualityDetailId(state, data) {
      state.qualityDetailId = data
    },
    // RTM登录成功或失败的状态 在我的页面 使名字变红或变白得知RTM的状态
    toggleRtmLoginStatus(state, data) {
      state.rtmLoginStatus = data
    },
    // RTM登录成功或失败的状态 在我的页面 使名字变红或变白得知RTM的状态
    getPcCallerNumber(state, data) {
      state.pcCallerNumber = data
    },
    // 点击I国网 同步  将其数据保存下来带到开工申请进行拼接
    saveSyncIData(state, data) {
      state.syncIData = data
    }
	},
	actions: {
		// 更改弹窗 ID
		upDataPopubId({
			commit
		}, data) {
			commit('upDataPopubId', data);
		},
		// 更新本地用户 uid
		upDataUId({
			commit
		}, data) {
			commit('upDataUId', data);
		},
		// 触发RTM
		// startRtm({
		// 	commit
		// }, data) {
		// 	commit('startRtm', data);
		// },
	}
})
export default store
