<template>
	<view class="container">
		<view v-if="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="no-card my-comment-content">
			<view class="wdd-card-list">
				<view class="wdd-card-item " v-for="commentItem in tableData" :key="commentItem.id">
					<view class="content">
						<view class="comment-title" @click="urlLink(commentItem.forumId)">
							{{commentItem.title}}
						</view>
						<view class="comment-reply" v-if="commentItem.replyContent.length > 0">
							<renderHtml :content="commentItem.replyContent" />
						</view>
						<view class="user-comment-content">
							<renderHtml :content="commentItem.content" />
						</view>
						<view class="comment-bottom">
							<view class="comment-create-time">{{commentItem.createTime}}</view>
							<view>
								<view class="delete-button" @click="deleteComment(commentItem.id)">删除评论</view>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
	</view>
</template>

<script>
	import renderHtml from '@/components/render-html/render-html.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import userApi from '@/api/user'
	import forumApi from '@/api/forum'
	export default {
		components: {
			renderHtml,
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
			urlLink(id) {
				uni.navigateTo({
					url: `/pages/forum/select?id=${id}`
				});
			},
			deleteComment(commentId) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确定删除评论吗？',
					success: function(res) {
						if (res.confirm) {
							forumApi.commentDelete(commentId).then(re => {
								if (re.code === 1) {
									_this.search(true)
									uni.showToast({
										icon: 'none',
										title: '删除成功'
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
				userApi.comment(this.queryParam).then(res => {
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
	.my-comment-content {
		padding-top: 0rpx;

		.wdd-card-list {
			display: flex;
			flex-direction: column;

			.wdd-card-item {
				background: #FFFFFF;

				.comment-title {
					padding: 20rpx 10rpx;
					font-weight: 700;
					    color: #222;
				}

				.comment-reply {
					color: #888888;
					background-color: #f9f9f9;
					padding: 20rpx 10rpx;
				}

				.user-comment-content {
					padding: 20rpx 10rpx;
				}

				.comment-bottom {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 10rpx;

					.comment-create-time {
						font-size: 26rpx;
						color: #aaaaaa;
					}
				}
			}
		}
	}
</style>
