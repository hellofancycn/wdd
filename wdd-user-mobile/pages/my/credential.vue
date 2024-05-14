<template>
	<view class="content">
		<view>
			<view v-if="noneShow" class="none-contain">
				<image src="../../static/none.png" class="none-image"></image>
				<view class="none-text">
					暂无内容
				</view>
			</view>
			<view class="credential-list">
				<view v-for="(item, index) in tableData" :key="index" class="credential-item">
					<view class="image-wrapper" @click="viewImage(item.credentialImagePath)">
						<image :src="item.credentialImagePath"></image>
					</view>
					<text class="title clamp">{{item.name}}</text>
				</view>
			</view>
		</view>

		<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>

	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import credentialApi from '@/api/credential'
	export default {
		components: {
			uniIcons,
			uniLoadMore
		},
		data() {
			return {
				queryParam: {
					pageIndex: 1,
					pageSize: 10
				},
				tableData: [],
				total: 0,
				urlList: [],
				more: null,
				noneShow: false
			};
		},
		onLoad(options) {
			this.search(true)
		},
		methods: {
			viewImage(url) {
				uni.previewImage({
					current: url,
					urls: this.urlList,
				});
			},
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				credentialApi.page(this.queryParam).then(res => {
					if (res.code === 1) {
						const re = res.response
						this.queryParam.pageIndex = re.pageNum
						this.tableData = override ? re.list : this.tableData.concat(re.list)
						this.total = re.pages
						this.noneShow = this.total === 0
						for (let item of re.list) {
							if (!this.urlList.includes(item.credentialImagePath)) {
								this.urlList.push(item.credentialImagePath)
							}
						}
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
	.credential-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30rpx;
		background: #fff;

		.credential-item {
			display: flex;
			flex-direction: column;
			width: 40%;
			margin: 5%;
		}

		.image-wrapper {
			width: 100%;
			height: 220rpx;
			border-radius: 6rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: 28rpx;
			color: $font-color-dark;
			margin-top: 20rpx;
		}
	}
</style>