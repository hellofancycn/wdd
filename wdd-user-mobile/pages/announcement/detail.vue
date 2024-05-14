<template>
	<view class="announcement-container">
		<view class="post-title">
			<uni-tag class="announcement-tag" text="顶置" type="primary" size="small" v-if="announcement.overhead"
				inverted="true" />
			<uni-tag class="announcement-tag" text="重要" type="error" size="small" v-if="announcement.importanted"
				inverted="true" />
			<view class="announcement-title">{{announcement.title}}</view>
		</view>
		<view class="post-content">
			<renderHtml :content="announcement.content" />
		</view>
	</view>
</template>

<script>
	import announcementApi from '@/api/announcement'
	import renderHtml from '@/components/render-html/render-html.vue'

	export default {
		components: {
			renderHtml
		},
		data() {
			return {
				announcement: {}
			}
		},
		onLoad(options) {
			announcementApi.select(options.id).then(res => {
				if (res.code === 1) {
					this.announcement = res.response
					announcementApi.read(options.id).then(re => {

					})
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message
					});
				}
			})
		}
	}
</script>



<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	.announcement-container {
		margin-top: 20rpx;

		.post-title {
			text-align: center;
			padding: 10rpx;

			.announcement-title {
				display: initial;
				font-weight: bold;
				font-size: 34rpx;
				color: #404040;
				vertical-align: middle;
			}
		}

		.post-des {
			font-size: 28rpx;
			color: #909399;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin: 38rpx 10rpx 28rpx 10rpx;

			.announcement-time {}
		}


		.post-content {
			padding: 30rpx;

			.post-content-image {
				text-align: center;
				padding-bottom: 28rpx;
				padding-top: 10rpx;
			}
		}
	}
</style>
