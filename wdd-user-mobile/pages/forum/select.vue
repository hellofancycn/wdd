<template>
	<view class="forum-container">
		<view class="forum-title">{{forum.title}}</view>
		<view class="forum-create">
			<view>
				<uni-icons color="#a8abb2" size="72" type="face-miss" v-if="forum.imagePath===null" />
				<image class="forum-image" :src="forum.imagePath" v-else></image>
			</view>
			<view class="forum-create-info">
				<view class="forum-create-name">{{forum.realName}}（{{forum.userName}}）</view>
				<view class="forum-create-time">{{forum.createTime}}</view>
			</view>
		</view>
		<view class="exam-qustion-content forum-content">
			<renderHtml :content="forum.content" />
		</view>
		<view class="forum-content forum-total">
			<span>评论 {{totalCount}} 条</span>
			<uni-icons color="#464646" size="46" type="plus-filled" @click="addComment(null)" />
		</view>
		<view>
			<view v-if="noneShow" class="none-contain">
				<image src="../../static/none.png" class="none-image"></image>
				<view class="none-text">
					暂无评论
				</view>
			</view>
			<view v-for="item in tableData" :key="item.id" class="comment-item forum-content">
				<view class="comment-item-top">
					<view class="comment-top-left">
						<uni-icons color="#a8abb2" size="72" type="face-miss" v-if="item.imagePath===null" />
						<image class="item-image" :src="item.imagePath" v-else></image>
					</view>
					<view class="comment-top-right">
						<view>{{item.realName}}（{{item.userName}}）</view>
						<view class="comment-top-right-time">{{item.createTime}}</view>
					</view>
				</view>
				<view class="comment-item-content" @click="addComment(item)">
					<renderHtml :content="item.content" />
				</view>
				<view class="comment-item-child">
					<view v-for="childItem in item.child" class="comment-item-child-item"
						@click="addComment(childItem)" :key="childItem.id">
						<view class="child-real-name">{{childItem.realName}}</view>
						<view class="child-text">回复</view>
						<view class="child-real-name">{{childItem.replyRealName}}</view>
						<view class="child-text">：</view>
						<renderHtml :content="childItem.content" />
					</view>
				</view>
			</view>
			<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
		</view>

		<uni-popup ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" :title="title" @confirm="commentConfirm" :placeholder="placeholder">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import renderHtml from '@/components/render-html/render-html.vue'
	import forumApi from '@/api/forum'

	export default {
		components: {
			renderHtml,
			uniPopupDialog
		},
		data() {
			return {
				title: '评论',
				placeholder: '',
				forum: {},
				comment: {
					parentId: null,
					forumId: null,
					forumArchiveId: null,
					content: null
				},
				queryParam: {
					forumId: null,
					pageIndex: 1,
					pageSize: 20
				},
				totalCount: 0,
				tableData: [],
				total: 0,
				more: null,
				noneShow: false
			}
		},
		onLoad(options) {
			this.queryParam.forumId = options.id
			this.comment.forumId = options.id
			forumApi.select(options.id).then(res => {
				if (res.code === 1) {
					this.forum = res.response
					this.comment.forumArchiveId = this.forum.forumArchiveId
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message
					});
				}
			})
			this.search(true)
		},
		methods: {
			commentConfirm(done, val) {
				if (val === null || val === '') {
					uni.showToast({
						icon: 'none',
						title: '内容不能为空'
					});
					return
				}
				this.comment.content = val
				forumApi.commentAdd(this.comment).then(re => {
					if (re.code === 1) {
						this.search(true)
						done()
					} else {
						uni.showToast({
							icon: 'none',
							title: re.message
						});
					}
				})
			},
			addComment(item) {
				if (null === item) {
					this.placeholder = ''
					this.title = '评论'
					this.comment.parentId = null
				} else {
					this.placeholder = '回复：' + item.realName
					this.title = '回复'
					this.comment.parentId = item.id
				}

				this.$refs.dialogInput.open()
			},
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				forumApi.commentPageList(this.queryParam).then(res => {
					uni.stopPullDownRefresh()
					if (res.code === 1) {
						const re = res.response
						this.queryParam.pageIndex = re.pageNum
						this.tableData = override ? re.list : this.tableData.concat(re.list)
						this.total = re.pages
						this.noneShow = this.total === 0
						this.totalCount = res.response.total
					}
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			onPullDownRefresh() {
				this.queryParam.pageIndex = 1
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
	page {}

	.forum-container {


		.forum-title {
			font-weight: 700;
			color: #222;
			font-size: 36rpx;
			background-color: #FFFFFF;
			padding: 0rpx 20rpx;
		}

		.forum-create {
			background-color: #FFFFFF;
			padding: 30rpx 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			.forum-image {
				width: 72rpx;
				height: 72rpx;
				display: flex;
				align-items: center;
			}

			.forum-create-info {
				display: flex;
				flex-direction: column;
				padding-left: 30rpx;

				.forum-create-name {
					color: #222;
					font-size: 26rpx;
				}

				.forum-create-time {
					color: #909399;
					font-size: 24rpx;
				}
			}
		}

		.forum-content {
			background-color: #FFFFFF;
			padding: 0rpx 20rpx;
		}

		.forum-total {
			padding-top: 30rpx;
			padding-bottom: 30rpx;
			color: #222;
			font-weight: 700;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}


		.comment-item {

			display: flex;
			flex-direction: column;
			margin-bottom: 10rpx;
			padding-top: 10rpx;

			.comment-item-top {
				display: flex;

				.comment-top-left {
					display: flex;
					align-items: center;

					.item-image {
						width: 72rpx;
						height: 72rpx;
					}
				}

				.comment-top-right {
					padding-left: 20rpx;
					display: flex;
					flex-direction: column;

					.comment-top-right-time {
						font-size: 24rpx;
						color: #909399;
					}

				}
			}

			.comment-item-content {
				padding: 20rpx 0rpx;
				border-bottom: 2rpx solid #eee;
			}

			.comment-item-child {
				padding-bottom: 20rpx;

				.comment-item-child-item {
					padding-top: 10rpx;
					display: flex;
					flex-wrap: wrap;

					.child-real-name {
						font-size: 26rpx;
						color: #4e72b8;
					}

					.child-text {
						font-size: 26rpx;
						margin: 0rpx 10rpx;
					}
				}
			}

		}
	}
</style>
