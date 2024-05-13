<template>
	<view class="container">

		<view class="user-section">
			<view class="user-info-box">
				<view class="portrait-box" @click="chooseImage">
					<uni-icons color="#a8abb2" size="130" type="face-miss" v-if="userInfo.imagePath===null" />
					<image class="portrait" :src="userInfo.imagePath" v-else></image>
				</view>
				<view class="info-box">
					<view class="username">{{userInfo.userName}}</view>
					<view class="degree">{{userInfo.degreeStr}}</view>
				</view>
			</view>
		</view>

		<view class="cover-container">
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">{{userInfo.realName}}</text>
					<text>真实姓名</text>
				</view>
				<view class="tj-item">
					<text class="num" style="width: 400rpx;">{{userInfo.departmentStr}}</text>
					<text>人员类别</text>
				</view>
			</view>

			<view class="my-wdd-list">
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/info')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/user-info.png" class="my-wdd-list-item-left-image"
							style="width: 42rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						个人资料
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/password')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/password.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						修改密码
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/event-log')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/user-event.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						个人动态
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
			</view>


			<view class="my-wdd-list">
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/comment')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/comment.png" class="my-wdd-list-item-left-image"
							style="width: 36rpx;height: 36rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						我的评论
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/train')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/train.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						我的培训
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/credential')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/credential.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						我的证书
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/erroPage')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/password.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						错题记录
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<!-- <view class="my-wdd-list-item" @click="urlLink('/pages/my/examine')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/user-event.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						培训记录
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
				<view class="my-wdd-list-item" @click="urlLink('/pages/my/record')">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/comment.png" class="my-wdd-list-item-left-image"
							style="width: 36rpx;height: 36rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						违章记录
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view> -->
			</view>


			<view class="my-wdd-list">
				<view class="my-wdd-list-item" @click="logOut">
					<view class="my-wdd-list-item-left">
						<image src="../../static/my/logout.png" class="my-wdd-list-item-left-image"
							style="width: 34rpx;height: 34rpx;"></image>
					</view>
					<view class="my-wdd-list-item-center">
						退出登录
					</view>
					<view class="my-wdd-list-item-right">
						<image src="../../static/my/arrow.png" class="my-wdd-list-item-right-image"></image>
					</view>
				</view>
			</view>

		</view>


		<!-- <view class="foot-copyright">
			{{copyright}}
		</view> -->

	</view>
</template>
<script>
	import {
		Token_Store_Key,
		Copyright
	} from '@/utils/common'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import userApi from '@/api/user'
	import publicApi from '@/api/public'

	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				copyright: Copyright,
				userInfo: {}
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			chooseImage() {
				let _this = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0];
						userApi.changePicture(tempFilePath).then(data => {
							if (data.code === 1) {
								this.userInfo.imagePath = data.response
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}
				});
			},
			urlLink(url) {
				uni.navigateTo({
					url: url
				})
			},
			logOut() {
				publicApi.logout().then(re => {
					uni.removeStorageSync(Token_Store_Key);
					uni.reLaunch({
						url: '/pages/public/login'
					})
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			load() {
				userApi.getCurrentUser().then(re => {
					console.log(re)
					this.userInfo = re.response
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			onPullDownRefresh() {
				this.load()
			}
		}
	}
</script>
<style lang='scss'>
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10rpx;
	}


	.user-section {
		height: 220rpx;
		padding: 0rpx 60rpx 0;
		background-color: #13c2c2;
	}

	.user-info-box {
		height: 180rpx;
		display: flex;
		align-items: center;
		z-index: 1;

		.portrait {
			width: 130rpx;
			height: 130rpx;
			border: 1rpx solid #eff2f7;
			border-radius: 50%;
		}

		.username {
			font-size: 40rpx;
			margin-left: 20rpx;
			color: #FFFFFF;
			line-height: 40rpx;
		}

		.degree {
			font-size: 26rpx;
			margin-left: 20rpx;
			color: #75787d;
			line-height: 26rpx;
			margin-top: 10rpx;
		}

		.info-box {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
		}
	}



	.cover-container {
		background: $page-color-base;
		background: #f6f6f6;
		padding-bottom: 20rpx;

	}

	.tj-sction {
		@extend %section;
		border-radius: 0rpx !important;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140rpx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: 28rpx;
			color: $font-color-dark;
			margin-bottom: 8rpx;
			width: 230rpx;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
			white-space: nowrap;
			height: 40rpx;
		}
	}
</style>
