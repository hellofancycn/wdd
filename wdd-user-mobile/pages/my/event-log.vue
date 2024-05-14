<template>
	<view class="container">
		<view class=" uni-timeline event-log">
			<view class="uni-timeline-item"
				:class="index===0?'uni-timeline-first-item': (index===(tableData.length-1) ? 'uni-timeline-last-item':'uni-timeline-item')"
				v-for="(item,index) in tableData" :key="item.id">
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<view>
						{{item.content}}
					</view>
					<view class="datetime">
						{{item.createTime}}
					</view>
				</view>
			</view>
			<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import userApi from '@/api/user'

	export default {
		components: {
			uniIcons,
			uniLoadMore
		},
		data() {
			return {
				queryParam: {
					pageIndex: 1,
					pageSize: 20
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
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				userApi.event(this.queryParam).then(res => {
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
	.event-log {
		padding: 40rpx 40rpx;
		background-color: #fff;
		margin: 0 !important;
	}
</style>
