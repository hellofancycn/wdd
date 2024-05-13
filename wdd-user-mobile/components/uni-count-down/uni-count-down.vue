<template>
	<view class="uni-countdown">
		<view v-if="showDay" :style="{ borderColor: borderColor, color: color, background: backgroundColor }" class="uni-countdown__number">{{ d }}</view>
		<view v-if="showDay" :style="{ color: splitorColor }" class="uni-countdown__splitor">天</view>
		<view :style="{ borderColor: borderColor, color: color, background: backgroundColor }" class="uni-countdown__number">{{ h }}</view>
		<view :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '时' }}</view>
		<view :style="{ borderColor: borderColor, color: color, background: backgroundColor }" class="uni-countdown__number">{{ i }}</view>
		<view :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '分' }}</view>
		<view :style="{ borderColor: borderColor, color: color, background: backgroundColor }" class="uni-countdown__number">{{ s }}</view>
		<view v-if="!showColon" :style="{ color: splitorColor }" class="uni-countdown__splitor">秒</view>
	</view>
</template>
<script>
	export default {
		name: 'UniCountDown',
		props: {
			showDay: {
				type: Boolean,
				default: true
			},
			showColon: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: 'transparent'
			},
			borderColor: {
				type: String,
				default: 'transparent'
			},
			color: {
				type: String,
				default: '#fff'
			},
			splitorColor: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				timer: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				limitTime: 0,
				seconds: 0,
				endTime: null
			}
		},
		created: function(e) {},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			start(seconds) {
				this.endTime = new Date(new Date().getTime() + seconds * 1000).getTime();
				this.seconds = seconds
				this.limitTime = this.seconds
				this.countDown()
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds < 0) {
						this.timeUp()
						return
					}
					this.countDown()
				}, 1000)
			},
			timeUp() {
				clearInterval(this.timer)
				this.$emit('timeup')
			},
			timeStop() {
				clearInterval(this.timer)
			},
			timeUpdate() {
				let remainMilliSecond = this.endTime - new Date().getTime()
				let remainSencond = Math.floor(remainMilliSecond <= 0 ? 0 : remainMilliSecond / 1000);
				this.$emit('timeUpdate', this.limitTime - remainSencond)
				this.seconds = remainSencond
			},
			countDown() {
				this.$emit('timeUpdate', this.limitTime - this.seconds)
				let seconds = this.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					day = Math.floor(seconds / (60 * 60 * 24))
					hour = Math.floor(seconds / (60 * 60)) - day * 24
					minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60
					second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
				} else {
					this.timeUp()
				}
				if (day < 10) {
					day = '0' + day
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				this.d = day
				this.h = hour
				this.i = minute
				this.s = second
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-countdown {
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: center
	}

	.uni-countdown__splitor {
		justify-content: center;
		font-size: 32rpx;
	}

	.uni-countdown__number {
		justify-content: center;
		height: 44rpx;
		font-size: 32rpx;
	}
</style>
