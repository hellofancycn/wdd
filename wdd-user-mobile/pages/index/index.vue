<template>
	<view class="container">
		<view class="carousel-section">
			<swiper class="carousel" circular>
				<swiper-item class="carousel-item">
					<image src="../../static/home/home.jpg" />
				</swiper-item>
			</swiper>
		</view>

		<view class="index-banner cu-bar bg-white solid-bottom">
			<view class="banner-container" @click="homeLink('/pages/announcement/index')">
				<view class="image-container">
					<image src="../../static/home/announcement.png" class="banner-image"></image>
				</view>
				<view class="banner-title">
					通知公告
				</view>
			</view>
			<view class="banner-container" @click="homeLink('/pages/record/index')">
				<view class="image-container">
					<image src="../../static/home/record.png" class="banner-image"></image>
				</view>
				<view class="banner-title">
					考试记录
				</view>
			</view>
			<view class="banner-container" @click="homeLink('/pages/record/practice')">
				<view class="image-container">
					<image src="../../static/home/practice.png" class="banner-image"></image>
				</view>
				<view class="banner-title">
					练习记录
				</view>
			</view>
		</view>


		<view class="wdd-card announcement-card">
			<view class="index-announcement cu-bar bg-white solid-bottom">
				<view class="action index-card-title">
					通知公告
				</view>
				<view class="index-more" @click="homeLink('/pages/announcement/index')">
					更多
					<image src="../../static/my/arrow.png" class="arrow-image"></image>
				</view>
			</view>
			<view v-if="announcementNoneShow" class="index-none-contain">
				<image src="../../static/none.png" class="index-none-image"></image>
				<view class="index-none-text">
					暂无内容
				</view>
			</view>
			<view class="no-card index-announcement-content">
				<view class="wdd-list">
					<view class="wdd-item" v-for="announcementItem in indexAnnouncementVMList"
						:key="announcementItem.id" @click="goAnnouncement(announcementItem.id)">
						<view class="announcement-content">
							<view class="announcement-title">
								<view class="announcement-title-content">
									<uni-tag class="announcement-tag" text="顶置" type="primary" size="small"
										v-if="announcementItem.overhead" inverted="true" />
									<uni-tag class="announcement-tag" text="重要" type="error" size="small"
										v-if="announcementItem.importanted" inverted="true" />
									{{announcementItem.title}}
								</view>
								<view class="announcement-title-time">{{announcementItem.createTime}}</view>
							</view>
							<image :src="announcementItem.imageSrc" class="announcement-image"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import announcementApi from '@/api/announcement'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue'

	export default {
		components: {
			uniIcons,
			uniTag
		},
		data() {
			return {
				indexAnnouncementVMList: [],
				announcementNoneShow: false,
			}
		},
		onLoad(options) {
			this.refresh()
		},
		methods: {
			homeLink(url) {
				uni.navigateTo({
					url: url
				});
			},
			tabPageLink(url) {
				uni.switchTab({
					url: url
				});
			},
			refresh() {
				this.announcementLoad()
			},
			announcementLoad() {
				announcementApi.page({
					pageIndex: 1,
					pageSize: 5
				}).then(data => {console.log(re,'99888')
					const re = data.response
					console.log(re)
					this.indexAnnouncementVMList = re.list
					this.announcementNoneShow = re.total === 0
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			goAnnouncement(id) {
				uni.navigateTo({
					url: `/pages/announcement/detail?id=${id}`
				})
			},
			onPullDownRefresh() {
				this.refresh()
			}
		}
	}
</script>





<style lang="scss">
	.m-t {
		margin-top: 16rpx;
	}

	.carousel-section {
		position: relative;

		.titleNview-placing {
			height: var(--status-bar-height);
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 360rpx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 440rpx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 0rpx;
			overflow: hidden;
			text-align: center;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}
	}

	.index-banner {
		justify-content: space-around !important;
		height: 180rpx;

		.banner-container {
			width: 140rpx;
			height: 140rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-right: 20rpx;

			.image-container {
				line-height: 1 !important;
				margin-top: 6rpx;

				.banner-image {
					width: 64rpx;
					height: 64rpx;
				}
			}

			.banner-title {
				color: #333333;
				margin-top: 6rpx;
				font-size: 26rpx;
			}

		}
	}

	.announcement-card {
		margin-bottom: 30rpx;
	}


	.index-announcement-content {
		.wdd-item {
			.announcement-content {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 100%;

				.announcement-image {
					width: 234rpx;
					height: 142rpx;
					border-radius: 10rpx;
				}

				.announcement-title {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-right: 20rpx;

					.announcement-title-content {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						height: 100rpx;
						font-size: 28rpx;
					}

					.announcement-title-time {
						color: #909399;
						font-size: 26rpx;
						height: 48rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}

	.index-card-title {
		color: #333333;
	}
</style>
