<template>
	<view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="app-face-icon">
			<uni-icons color="#a8abb2" size="400" type="face-miss" v-if="imagePath === null" />
			<image class="portrait" :src="imagePath" v-else></image>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view>
			<camera device-position="front" flash="off" @error="error" style="width: 100%; height: 800rpx;">
			</camera>
		</view>
		<!-- #endif -->

		<view>
			<!-- #ifndef MP-WEIXIN -->
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="faceInit()">拍照</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="faceClick()">确认</button>
			<!-- #endif -->
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button face-button"
				@click="faceClose()">关闭</button>
		</view>
	</view>
</template>

<script>
	import {
		Web_URL,
		Token_Store_Key
	} from '@/utils/common'
	import examPaperApi from '@/api/examPaper'

	export default {
		data() {
			return {
				paperId: null,
				paperType: null,
				imagePath: null,
			}
		},
		onLoad(options) {
			let _this = this
			_this.paperId = options.id
			_this.paperType = options.type
			_this.faceInit()
		},
		methods: {
			faceInit() {
				let _this = this

				// #ifdef APP-PLUS || H5
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: function(res) {
						const tempFilePath = res.tempFilePaths[0]
						examPaperApi.uploadFace(tempFilePath).then(data => {
							if (data.code === 1) {
								_this.imagePath = data.response
								_this.faceCompare(data.response)
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}
				});
				// #endif

				// #ifdef MP-WEIXIN
				this.cameraContext = uni.createCameraContext()
				// #endif
			},
			faceCompare(imageUrl) {
				let _this = this
				examPaperApi.facePicture({
					paperId: _this.paperId,
					paperType: _this.paperType,
					imageUrl: imageUrl
				}).then(data => {
					if (data.code === 1) {
						uni.navigateTo({
							url: `/pages/exam/do?id=${_this.paperId}&type=${_this.paperType}`
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						});
					}
				})
			},
			faceClick() {
				let _this = this
				this.cameraContext.takePhoto({
					quality: 'normal',
					success(res) {
						const tempFilePath = res.tempImagePath;
						examPaperApi.uploadFace(tempFilePath).then(data => {
							if (data.code === 1) {
								_this.imagePath = data.response
								_this.faceCompare(data.response)
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}
				})
			},
			faceClose() {
				uni.reLaunch({
					url: `/pages/paper/index`
				})
			}
		}
	}
</script>



<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.face-h5 {
		height: 1000rpx;
	}

	.h5-camera {
		position: absolute !important;
		right: 0;
		top: 0;
		height: 1000rpx !important;
		z-index: 99;
		width: 100%;
	}


	.h5-canvas {
		position: absolute !important;
		right: 0;
		top: 0;
		height: 1000rpx !important;
		width: 100%;
	}

	.app-face-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 800rpx;
	}

	.face-button {
		background-color: #F56C6C !important;
	}
</style>