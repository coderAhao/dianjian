// 定义音乐
let music = null;
music = uni.createInnerAudioContext();
music.src = '/static/rtc/audio.mp3'

let vibrateStatus = 1 // 0 不震动 1 振动
let intervalVibrate = null // 定时器

// 定时手机振动
const vibrate = function() {
	intervalVibrate = setInterval(() => {
		if (!vibrateStatus) {
			clearInterval(intervalVibrate)
			intervalVibrate = null
			vibrateStatus = 1
			return
		}
    // plus.device.vibrate(500)
    // console.log('成功振动123')
    
		uni.vibrateLong({
			success() {
				// console.log('成功振动')
			},
			fail() {
				console.log('振动失败喽')
			}
		})
	}, 600)
}
// 播放来电提醒
export const notify = function() {
	music.play() // 播放音乐
	vibrate() // 定时振动
}

// 取消来电提醒
export const stopNotify = function() {
	music.stop() // 停止音乐
	vibrateStatus = 0 // 停止振动
}

export default {
	notify,
	stopNotify
}