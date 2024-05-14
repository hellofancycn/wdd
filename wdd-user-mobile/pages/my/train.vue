<template>
	<view class="container">
		<view v-if="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="no-card my-train-content">
			<view class="wdd-card-list">
				<view class="wdd-card-item " v-for="(item,index) in tableData" :key="item.id" @click="urlLink(item)">
					<view class="train-title">{{ item.name }}</view>
					<view class="train-description">{{ item.description }}</view>
					<view class="train-foot">
						<view class="train-foot-status">{{ item.statusStr }}</view>
						<view>{{ item.createTimeStr }}</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
	</view>
</template>

<script>
	import userApi from '@/api/user'
	export default {
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
			urlLink(item) {
				uni.navigateTo({
					url: `/pages/train/detail?id=${item.trainId}`
				});
			},
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				userApi.train(this.queryParam).then(res => {
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
	.my-train-content {
		padding-top: 0rpx;

		.wdd-card-list {
			display: flex;
			flex-direction: column;

			.wdd-card-item {
				background: #FFFFFF;
				padding: 40rpx 20rpx;

				.train-title {
					padding: 20rpx 0rpx;
					font-size: 30rpx;
					font-weight: 600;
					line-height: 1.5;
				}

				.train-description {
					font-size: 26rpx;
					color: #909399;
				}

				.train-foot {
					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;

					.train-foot-status {
						margin-right: 40rpx;
						color: #14141f;
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>