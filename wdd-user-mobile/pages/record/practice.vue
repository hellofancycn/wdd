<template>
	<view class="container">

		<view class="wdd-tab-menu">
			<view class="wdd-tab-menu-left">
				<view class="wdd-tab-menu-left-item"
					:class="item.id === queryParam.examPaperArchiveId?'wdd-tab-menu-item-select':''" @click="tabSelect"
					:data-id="item.id" v-for="item in menuDate" :key="item.id">
					{{item.name}}
					<view class="wdd-tab-menu-item-border"></view>
				</view>
			</view>
		</view>

		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="90" @down="downCallback" @up="upCallback">
			<view class="no-card record-content">
				<view class="wdd-card-list">
					<view class="wdd-card-item" v-for="item in tableData" :key="item.id">
						<view class="content">
							<view class="text-cut">{{item.paperName}}</view>
							<view class="wdd-font-des">试卷状态：{{item.statusStr}}</view>
							<view class="wdd-font-des">提交时间：{{item.createTime}}</view>
							<view class="paper-record-score">
								<view class="wdd-font-des">正确：{{item.questionCorrect}}/{{item.questionCount}}</view>
								<view class="wdd-font-des">最终得分：{{item.userScore}} / {{item.paperScore}}</view>
								<view class="wdd-font-des">耗时：{{item.doTime}}</view>
							</view>
							<view class="record-action">
								<view class="left">
									<view class="answer-judge" v-if="item.status === 1">待批改</view>
									<view class="answer-pass" v-if="item.passed !== null && item.passed">合格</view>
									<view class="answer-nopass" v-if="item.passed !== null && !item.passed">不合格</view>
								</view>
								<view class="right">
									<view @click="urlLink(item)" class="action-button" v-if="item.status === 1">去批改
									</view>
									<view @click="urlLink(item)" class="action-button" v-else>查看试卷</view>
								</view>
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
	import examPaperApi from '@/api/examPaper'
	import practiceApi from '@/api/practice'

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				queryParam: {
					examPaperArchiveId: null,
					pageIndex: 1,
					pageSize: 20
				},
				menuDate: [],
				tableData: []
			}
		},
		onLoad() {
			examPaperApi.list().then(res => {
				this.menuDate = res.response
			})
		},
		methods: {
			tabSelect(e) {
				let targetId = e.currentTarget.dataset.id
				if (this.queryParam.examPaperArchiveId === targetId) {
					this.queryParam.examPaperArchiveId = null
				} else {
					this.queryParam.examPaperArchiveId = targetId
				}
				this.tableData = []
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				this.queryParam.pageIndex = page.num
				practiceApi.answerPage(this.queryParam).then(res => {
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
			urlLink(item) {
				if (item.status === 1) {
					uni.navigateTo({
						url: `/pages/practice/edit?id=${item.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/practice/read?id=${item.id}`
					})
				}
			}
		}
	}
</script>



<style lang="scss">
	.record-content {
		padding-top: 0rpx;


		.wdd-card-list {
			.wdd-card-item {


				.content {

					.paper-record-score {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}


					.left {
						.answer-judge {
							background-color: rgba(27, 31, 35, .05);
							color: #f29209;
							height: 48rpx;
							line-height: 48rpx;
							font-size: 24rpx;
							padding: 0rpx 16rpx;
							border-radius: 16rpx;
						}

						.answer-pass {
							background-color: #f0f9eb;
							border-color: #e1f3d8;
							color: #67c23a;
							height: 48rpx;
							line-height: 48rpx;
							font-size: 24rpx;
							padding: 0rpx 16rpx;
							border-radius: 16rpx;
						}

						.answer-nopass {
							background-color: #fef0f0;
							border-color: #fde2e2;
							color: #f56c6c;
							height: 48rpx;
							line-height: 48rpx;
							font-size: 24rpx;
							padding: 0rpx 16rpx;
							border-radius: 16rpx;
						}
					}

					.record-action {
						margin-top: 10rpx;
						display: flex;
						justify-content: space-between;

						.cu-tag {
							line-height: 48rpx;
						}
					}
				}
			}
		}
	}
</style>