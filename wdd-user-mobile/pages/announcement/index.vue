<template>
	<view class="container">

		<view class="wdd-tab-menu">
			<view class="wdd-tab-menu-left">
				<view class="wdd-tab-menu-left-item"
					:class="item.id === queryParam.announcementArchiveId?'wdd-tab-menu-item-select':''"
					@click="tabSelect" :data-id="item.id" v-for="item in menuDate" :key="item.id">
					{{item.name}}
					<view class="wdd-tab-menu-item-border"></view>
				</view>
			</view>
		</view>

		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" @down="downCallback" @up="upCallback">
			<view class="no-card announcement-content">
				<view class="wdd-list">
					<view class="wdd-item" v-for="announcementItem in tableData" :key="announcementItem.id">
						<view class="announcement-content" @click="urlLink(announcementItem.id)">
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
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
	import announcementApi from '@/api/announcement'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				queryParam: {
					announcementArchiveId: null,
					pageIndex: 1,
					pageSize: 20
				},
				menuDate: [],
				tableData: []
			}
		},
		onLoad() {
			announcementApi.list().then(res => {
				this.menuDate = res.response
			})
		},
		methods: {
			tabSelect(e) {
				let targetId = e.currentTarget.dataset.id
				if (this.queryParam.announcementArchiveId === targetId) {
					this.queryParam.announcementArchiveId = null
				} else {
					this.queryParam.announcementArchiveId = targetId
				}
				this.tableData = []
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				this.queryParam.pageIndex = page.num
				announcementApi.page(this.queryParam).then(res => {
					const re = res.response
					this.mescroll.endSuccess(re.list.length, re.hasNextPage)
					if (page.num == 1) {
						this.tableData = []
					}
					this.tableData = this.tableData.concat(re.list)
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			urlLink(id) {
				uni.navigateTo({
					url: `/pages/announcement/detail?id=${id}`
				})
			}
		}
	}
</script>



<style lang="scss">
	.announcement-content {
		padding-top: 0rpx;


		.wdd-list {
			display: flex;
			flex-direction: column;

			.wdd-item {
				background: #FFFFFF;
				padding: 40rpx 20rpx;

				.announcement-content {
					display: flex;
					flex-direction: row;
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
						padding-left: 20rpx;

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
	}
</style>
