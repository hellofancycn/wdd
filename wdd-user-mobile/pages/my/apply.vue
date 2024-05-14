<template>
	<view class="container">
		<view v-if="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="no-card apply-content">
			<view class="wdd-card-list">
				<view class="wdd-card-item " v-for="(applyItem,index) in tableData" :key="applyItem.id">
					<view class="content">
						<view>
							{{applyItem.name}}
						</view>
						<view class="wdd-font-des">
							报名状态：{{applyItem.statusStr}}
						</view>
						<view class="wdd-font-des">
							人数限制：{{applyItem.limitCount}}
						</view>
						<view class="wdd-font-des">
							截止时间：{{applyItem.applyEndTimeStr}}
						</view>
						<view class="wdd-font-des">
							考试时间：{{applyItem.limitStartTimeStr}} 至 {{applyItem.limitEndTimeStr}}
						</view>
						<view class="wdd-font-des">
							报名时间：{{applyItem.applyDateTimeStr}}
						</view>
						<view class="apply-cancel" v-if="applyItem.status === 1">
							<view class="delete-button" @click="cancelApply(applyItem.applyId,applyItem.id)">取消报名</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import applyApi from '@/api/apply'
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				queryParam: {
					pageIndex: 1,
					pageSize: 10
				},
				tableData: [],
				total: 0,
				more: null,
				noneShow: false
			}
		},
		onLoad() {
			this.search(true)
		},
		methods: {
			cancelApply(applyId, userApplyId) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确定取消报名吗？',
					success: function(res) {
						if (res.confirm) {
							applyApi.cancelApply(applyId, userApplyId).then(re => {
								if (re.code === 1) {
									_this.search(true)
									uni.showToast({
										icon: 'none',
										title: '取消报名成功'
									});
								} else {
									uni.showToast({
										icon: 'none',
										title: re.message
									});
								}
							})
						}
					}
				});
			},
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				applyApi.record(this.queryParam).then(res => {
					if (res.code === 1) {
						const re = res.response
						this.queryParam.pageIndex = re.pageNum
						this.tableData = override ? re.list : this.tableData.concat(re.list)
						this.total = re.pages
						this.noneShow = this.total === 0
					}
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			onPullDownRefresh() {
				this.search(true)
			},
			onReachBottom() {
				//this.more = 'loading'
				if (this.queryParam.pageIndex < this.total) {
					++this.queryParam.pageIndex
					this.search(false)
				} else {
					this.more = 'noMore'
				}
			}
		}
	}
</script>



<style lang="scss">
	.apply-content {
		padding-top: 0rpx;

		.wdd-card-list {
			display: flex;
			flex-direction: column;

			.wdd-card-item {
				background: #FFFFFF;
				padding: 40rpx 20rpx;
			}

			.apply-cancel {
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>
