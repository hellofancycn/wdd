<template>
	<view class="container">

		<view class="wdd-tab-menu">
			<view class="wdd-tab-menu-left">
				<view class="wdd-tab-menu-left-item"
					:class="item.id === queryParam.applyArchiveId?'wdd-tab-menu-item-select':''" @click="tabSelect"
					:data-id="item.id" v-for="item in menuDate" :key="item.id">
					{{item.name}}
					<view class="wdd-tab-menu-item-border"></view>
				</view>
			</view>
		</view>

		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" @down="downCallback" @up="upCallback">
			<view class="no-card apply-content">
				<view class="wdd-card-list">
					<view class="wdd-card-item" v-for="(applyItem,index) in tableData" :key="applyItem.id"
						@click="goApplyConfirm(applyItem.id)">
						<view>
							<view class="text-cut">{{applyItem.name}}</view>
						</view>
						<view class="wdd-font-des">
							人数限制：{{applyItem.limitCount}}
						</view>
						<view class="wdd-font-des">
							截止时间：{{applyItem.applyEndTime}}
						</view>
						<view class="wdd-font-des">
							考试开始时间：{{applyItem.limitStartTime}}
						</view>
						<view class="wdd-font-des">
							考试结束时间：{{applyItem.limitEndTime}}
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
	import applyApi from '@/api/apply'

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				queryParam: {
					applyArchiveId: null,
					pageIndex: 1,
					pageSize: 20
				},
				menuDate: [],
				tableData: []
			}
		},
		onLoad() {
			applyApi.list().then(res => {
				this.menuDate = res.response
			})
		},
		methods: {
			goApplyConfirm(id) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '此操作将提交报名申请, 是否继续?',
					success: function(res) {
						if (res.confirm) {
							_this.goApply(id)
						} else if (res.cancel) {

						}
					}
				});
			},
			goApply(id) {
				let _this = this
				applyApi.goApply(id).then(re => {
					if (re.code === 1) {
						_this.upCallback({
							num: 1
						})
						uni.showToast({
							icon: 'none',
							title: re.response
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: re.message
						});
					}
				})
			},
			tabSelect(e) {
				let targetId = e.currentTarget.dataset.id
				if (this.queryParam.applyArchiveId === targetId) {
					this.queryParam.applyArchiveId = null
				} else {
					this.queryParam.applyArchiveId = targetId
				}
				this.tableData = []
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				this.queryParam.pageIndex = page.num
				applyApi.page(this.queryParam).then(res => {
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
		}
	}
</script>


<style lang="scss">
	.apply-content {
		padding-top: 0rpx;

		.apply-list {
			display: flex;
			flex-direction: column;

			.apply-item {
				background: #FFFFFF;
				margin-bottom: 10rpx;
				padding: 40rpx 20rpx;
			}
		}
	}
</style>
