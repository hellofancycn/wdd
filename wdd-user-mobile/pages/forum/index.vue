<template>
	<view>
		<view class="wdd-tab-menu">
			<view class="wdd-tab-menu-left">
				<view class="wdd-tab-menu-left-item"
					:class="item.id === queryParam.forumArchiveId?'wdd-tab-menu-item-select':''" @click="tabSelect"
					:data-id="item.id" v-for="item in menuDate">
					{{item.name}}
					<view class="wdd-tab-menu-item-border"></view>
				</view>
			</view>
			<view class="wdd-tab-menu-right" @click="forumAdd">
				<image src="../../static/forum/write.png" class="forum-write-image"></image>
			</view>
		</view>

		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" @down="downCallback" @up="upCallback">
			<view class="no-card forum-content">
				<view class="wdd-card-list">
					<view class="wdd-card-item" v-for="forumItem in tableData" :key="forumItem.id">
						<view class="content" @click="urlLink(forumItem)">
							<view>
								{{forumItem.title}}
							</view>
							<view class="forum-content wdd-font-des">
								{{forumItem.content}}
							</view>
							<view class="wdd-font-des forum-foot">
								<span class="forum-user-info">
									<uni-icons color="#a8abb2" size="60" type="face-miss"
										v-if="forumItem.imagePath===null" />
									<image class="forum-image" :src="forumItem.imagePath" v-else></image>
									<span style="margin-left: 20rpx;">
										{{forumItem.realName}}
									</span>
								</span>
								<span>
									{{forumItem.createTime}}
								</span>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import forumApi from '@/api/forum'
	export default {
		mixins: [MescrollMixin],
		components: {
			uniIcons
		},
		data() {
			return {
				queryParam: {
					forumArchiveId: null,
					pageIndex: 1,
					pageSize: 20
				},
				menuDate: [],
				tableData: []
			}
		},
		onLoad() {
			forumApi.list().then(res => {
				this.menuDate = res.response
			})
		},
		methods: {
			refresh() {
				this.tableData = []
				this.mescroll.resetUpScroll()
			},
			tabSelect(e) {
				let targetId = e.currentTarget.dataset.id
				if (this.queryParam.forumArchiveId === targetId) {
					this.queryParam.forumArchiveId = null
				} else {
					this.queryParam.forumArchiveId = targetId
				}
				this.refresh()
			},
			forumAdd() {
				uni.navigateTo({
					url: `/pages/forum/add`,
				})
			},
			urlLink(forumItem) {
				uni.navigateTo({
					url: `/pages/forum/select?id=${forumItem.id}`
				});
			},
			upCallback(page) {
				this.queryParam.pageIndex = page.num
				forumApi.pageList(this.queryParam).then(res => {
					const re = res.response
					this.mescroll.endSuccess(re.list.length, re.hasNextPage)
					if (page.num == 1) {
						this.tableData = []
					}
					this.tableData = this.tableData.concat(re.list)
				}).catch(() => {
					this.mescroll.endErr();
				})
			}
		}
	}
</script>



<style lang="scss">
	.forum-publish {
		height: 70rpx;

		.action-button {
			position: fixed;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			z-index: 99;
			border-radius: 0rpx !important;
		}
	}

	.forum-content {
		padding-top: 0rpx;

		.wdd-card-list {
			.wdd-card-item {
				padding: 40rpx 20rpx;

				.forum-content {
					margin-top: 20rpx;
				}

				.forum-archive {
					margin-top: 20rpx;
				}

				.forum-foot {
					margin-top: 20rpx;
					display: flex;
					align-content: center;
					justify-content: space-between;
					align-items: center;

					.forum-user-info {
						display: flex;
						align-content: center;
						align-items: center;
					}

					.forum-image {
						width: 60rpx;
						height: 60rpx;
					}
				}
			}
		}

	}
</style>
