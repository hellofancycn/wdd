<template>
	<view class="page-warp">

		<view class="top-warp">
			<view class="train-search">
				<uni-easyinput type="text" :inputBorder="false" v-model="queryParam.name" placeholder="培训名称搜索"
					suffixIcon="search" @iconClick="search" @confirm="search" />
			</view>
		</view>

		<view class="center-warp">
			<scroll-view class="left-warp" :scroll-y="true">
				<view class="wdd-scroll-menu-item"
					:class="item.id === queryParam.trainArchiveId?'wdd-scroll-menu-item-select':''"
					@click="tabSelect(item)" :data-id="item.id" v-for="item in tabs" :key="item.id">
					<view class="wdd-scroll-menu-item-border"></view>
					<view class="wdd-scroll-menu-item-content">{{item.name}}</view>
				</view>
			</scroll-view>

			<view class="right-warp">
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback"
					@up="upCallback">
					<view class="no-card train-content">
						<view class="wdd-list">
							<view class="wdd-item" v-for="trainItem in tableData" :key="trainItem.id">
								<view class="content" @click="urlLink(trainItem)">
									<view class="train-name">{{trainItem.name}}</view>
									<view class="train-description wdd-font-des">
										{{trainItem.description}}
									</view>
									<view class="wdd-font-des train-foot">
										共{{ trainItem.itemCount }}节 | {{ trainItem.studyTimeStr }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>

	</view>
</template>


<script>
	import trainApi from '@/api/train'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				queryParam: {
					name: null,
					trainArchiveId: null,
					pageIndex: 1,
					pageSize: 20
				},
				tableData: [],
				tabs: [],
				tabIndex: null
			}
		},
		onLoad() {
			trainApi.list().then(res => {
				this.tabs = res.response
			})
		},
		methods: {
			upCallback(page) {
				this.queryParam.pageIndex = page.num
				trainApi.pageList(this.queryParam).then(res => {
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
			tabSelect(item) {
				let targetId = item.id
				if (this.queryParam.trainArchiveId === targetId) {
					this.queryParam.trainArchiveId = null
				} else {
					this.queryParam.trainArchiveId = targetId
				}
				this.tableData = []
				this.mescroll.resetUpScroll()
			},
			search() {
				this.mescroll.resetUpScroll()
			},
			urlLink(trainItem) {
				uni.navigateTo({
					url: `/pages/train/detail?id=${trainItem.id}`
				});
			}
		}
	}
</script>


<style lang="scss">
	page {
		height: 100%;
		background: #FFFFFF;

		.page-warp {
			height: 100%;
			display: flex;
			flex-direction: column;


			.top-warp {}

			.center-warp {
				flex: 1;
				min-width: 0;
				min-height: 0;
				display: flex;

				.left-warp {
					width: 140rpx;
					height: 100%;
					background-color: #f6f6f6;

					.wdd-scroll-menu-item {
						display: flex;
						flex-direction: row;
						align-items: center;
						padding: 30rpx 0rpx;

						.wdd-scroll-menu-item-border {
							width: 12rpx;
							height: 40rpx;
						}

						.wdd-scroll-menu-item-content {
							font-size: 24rpx;
							margin-left: 8rpx;
						}
					}

					.wdd-scroll-menu-item-select {
						background-color: #FFFFFF;

						.wdd-scroll-menu-item-border {
							background-color: #74d4c6;
						}

						.wdd-scroll-menu-item-content {
							font-weight: 550;
						}
					}
				}

				.right-warp {
					flex: 1;
					min-width: 0;

					.train-content {
						padding-top: 0rpx;

						.wdd-list {
							display: flex;
							flex-direction: column;

							.wdd-item {
								padding: 40rpx 20rpx;

								.train-name {
									display: inline;
									vertical-align: middle;
								}

								.train-description {
									margin-top: 20rpx;
								}

								.train-foot {
									text-align: right;
									font-size: 26rpx;
								}

							}
						}
					}
				}
			}
		}
	}
</style>