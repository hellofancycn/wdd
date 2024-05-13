<template>
	<view class="container about-color">
		<view class="about-title">
			<image src="../../static/my/wk.png" class="about-image"></image>
			<view class="about-name">
				<view class="about-name-des">智慧矿山考试系统</view>
				<view class="about-name-des">v9.5.0</view>
			</view>
		</view>
		<view class="about-content">
			<view class="wdd-list">
				<view class="wdd-item">
					组卷方式丰富、考试防作弊、人脸识别、抓拍
				</view>
				<view class="wdd-item">
					高性能化的设计，保证系统长期稳定运行
				</view>
				<view class="wdd-item">
					电子证书、电子签章，分享证书更方便
				</view>
				<view class="wdd-item">
					详细答卷分析、展示、导出，统计、归档方便
				</view>
				<view class="wdd-item">
					丰富培训课件类型，在线学习、考试、颁发证书
				</view>
				<view class="wdd-item">
					支持内外网部署、离线部署、Docker容器部署
				</view>
			</view>
		</view>

		<view class="about-link">
			<view class="wdd-list">
				<view class="wdd-item" @click="urlLink('https://www.mindskip.net/policy/wk/user.html')">
					<view>
						用户协议
					</view>
					<view>
						<image src="../../static/my/arrow.png" class="arrow-image"></image>
					</view>
				</view>
				<view class="wdd-item" @click="urlLink('https://www.mindskip.net/policy/wk/privacy.html')">
					<view>
						隐私政策
					</view>
					<view>
						<image src="../../static/my/arrow.png" class="arrow-image"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="about-link">
			<view class="wdd-list">
				<view class="wdd-item" @click="feedBackLink('/pages/my/feedback')">
					<view>
						意见反馈
					</view>
					<view>
						<image src="../../static/my/arrow.png" class="arrow-image"></image>
					</view>
				</view>
			</view>
		</view>


		<view class="about-copyright">
			Copyright ©2024-2028 山西华夏典籍科技有限公司
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				config: ''
			}
		},
		onLoad() {},
		methods: {
			feedBackLink(url) {
				uni.navigateTo({
					url: url
				})
			},
			urlLink(url) {
				uni.navigateTo({
					url: `/pages/my/webView?url=${url}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {}


	.about-color {}

	.about-title {
		text-align: center;

		.about-image {
			width: 100rpx;
			height: 100rpx;
			margin-top: 70rpx;
		}

		.about-name {
			margin-top: 20rpx;

			.about-name-des {
				line-height: 1.5;
			}
		}
	}

	.about-content {
		margin-top: 30rpx;

		.wdd-list {
			.wdd-item {
				padding: 22rpx 40rpx;
			}
		}
	}

	.about-link {
		margin-top: 30rpx;

		.wdd-list {
			.wdd-item {
				padding: 22rpx 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.arrow-image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

	}


	.about-copyright {
		margin-top: 100rpx;
		color: #b6b7bb;
		font-size: 24rpx;
		text-align: center;
	}
</style>