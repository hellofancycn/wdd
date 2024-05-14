<template>
	<view class="train-detail">
		<view class="train-detail-head">
			<view class="train-image">
				<image :src="train.coverPath" class="loaded" mode="scaleToFill"></image>
			</view>
			<view class="train-detail-info wdd-font-des">
				<span class="text-span">共{{ train.itemCount }}节</span>
				<span class="text-span">|</span>
				<span class="text-span">{{ train.studyTimeStr }}</span>
			</view>
			<view class="train-name">
				{{train.name}}
			</view>
			<view class="train-info wdd-font-des">
				<span class="text-span">{{ train.startTime }}</span>
				<span class="text-span">至</span>
				<span class="text-span">{{ train.endTime }}</span>
			</view>
		</view>

		<view class="train-detail-content">
			<view class="wdd-tab-menu-head">
				<view class="wdd-tab-menu">
					<view class="wdd-tab-menu-item" :class="1 == activeMenu?'wdd-tab-menu-item-select':''"
						@click="tabSelect(1)">
						<view>描述</view>
						<view class="wdd-tab-menu-item-border"></view>
					</view>
					<view class="wdd-tab-menu-item" :class="2 == activeMenu?'wdd-tab-menu-item-select':''"
						@click="tabSelect(2)">
						<view>课程</view>
						<view class="wdd-tab-menu-item-border"></view>
					</view>
					<view class="wdd-tab-menu-item" :class="3 == activeMenu?'wdd-tab-menu-item-select':''"
						@click="tabSelect(3)">
						<view>试卷</view>
						<view class="wdd-tab-menu-item-border"></view>
					</view>
					<view class="wdd-tab-menu-item" :class="4 == activeMenu?'wdd-tab-menu-item-select':''"
						@click="tabSelect(4)">
						<view>证书</view>
						<view class="wdd-tab-menu-item-border"></view>
					</view>
				</view>
			</view>
			<view class="train-des" v-if="activeMenu === 1">
				<render-html :content="train.description" :windowPadding="15" />
			</view>
			<view class="train-course" v-if="activeMenu === 2">
				<view v-for="item in train.courseWareList" :key="item.itemOrder" class="train-course-item"
					@click="courseWatch(item)">
					<view class="train-course-name">
						<image src="../../static/course/video.png" class="file-type-image" v-if="item.fileType === 1">
						</image>
						<image src="../../static/course/document.png" class="file-type-image" v-else> </image>
						<view class="train-course-name-content">{{ item.itemOrder }}. {{ item.name }}</view>
					</view>
					<view class="train-course-progress">
						<progress :percent="item.percentage" :activeColor="item.status === 2 ? '#67c23a':'#409eff'"
							stroke-width="15" />
					</view>
					<view class="progress-content">
						{{ item.currentNumberStr }} / {{ item.passNumberStr }}
					</view>
				</view>
			</view>
			<view class="train-exam-paper" v-if="activeMenu === 3">
				<view class="index-none-contain" v-if="paperNoneShow">
					<image src="../../static/none.png" class="index-none-image"></image>
					<view class="index-none-text">
						暂无内容
					</view>
				</view>
				<view class="train-exam-paper-content" v-else>
					<view class="paper-info" @click="paperDo(train.examPaper)">
						<view class="paper-item-name">{{ train.examPaper.name }}</view>
						<view class="paper-item-list">
							<view class="paper-item-des">合格分：{{ train.examPaper.passNumberStr }}</view>
							<view class="paper-item-des">总分：{{ train.examPaper.maxNumberStr }}</view>
							<view class="paper-item-des">考试次数：{{ train.examPaper.allowCount }}</view>
						</view>
					</view>
					<view class="paper-record">
						<view class="paper-record-top">
							<view class="record-head">
								<view class="table-col-1 table-head">得分</view>
								<view class="table-col-2 table-head">耗时</view>
								<view class="table-col-3 table-head">状态</view>
								<view class="table-col-4 table-head">考试时间</view>
							</view>
							<view v-for="(item,index) in train.examPaper.answerList" :key="index"
								class="paper-record-item">
								<view class="record-content">
									<view class="paper-font table-col-1">{{ item.userScore }}</view>
									<view class="paper-font table-col-2">{{ item.doTime }}</view>
									<view class="paper-font table-col-3">{{ item.statusStr }}</view>
									<view class="paper-font table-col-4">{{ item.createTime }}</view>
								</view>
							</view>
						</view>
						<view class="paper-record-bottom">
							<view class="record-result">
								<view class="paper-font">考试结果：</view>
								<view v-if="train.examPaper.status === 1" class="answer-waite">
									{{ train.examPaper.statusStr }}
								</view>
								<view v-if="train.examPaper.status === 2" class="answer-pass">
									{{ train.examPaper.statusStr }}
								</view>
								<view v-if="train.examPaper.status === 3" class="answer-nopass">
									{{ train.examPaper.statusStr }}
								</view>
							</view>
							<view class="paper-font">完成时间：{{ train.examPaper.completeTime }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="train-credential" v-if="activeMenu === 4">
				<view class="index-none-contain" v-if="credentialNoneShow">
					<image src="../../static/none.png" class="index-none-image"></image>
					<view class="index-none-text">
						暂无内容
					</view>
				</view>
				<view class="image-wrapper" @click="viewImage(train.credential.credentialImagePath)" v-else>
					<image :src="train.credential.credentialImagePath"></image>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import renderHtml from '@/components/render-html/render-html.vue'
	import trainApi from '@/api/train'

	export default {
		components: {
			renderHtml
		},
		data() {
			return {
				activeMenu: 1,
				trainNoneShow: false,
				paperNoneShow: false,
				credentialNoneShow: false,
				train: {
					examPaper: {},
					credential: {
						credentialImagePath: null
					}
				},
				trainId: null
			}
		},
		onLoad(options) {
			this.trainId = options.id;
			this.reLoadDate()
		},
		methods: {
			tabSelect(tab) {
				this.activeMenu = tab
			},
			reLoadDate() {
				trainApi.select(this.trainId).then(re => {
					if (re.code === 1) {
						let response = re.response
						this.paperNoneShow = response.examPaper === null
						this.credentialNoneShow = response.credential === null
						// #ifdef APP-PLUS
						response.description = response.description
						// #endif
						// #ifndef APP-PLUS
						response.description = response.description.replaceAll('\n', '<br/>')
						// #endif
						this.train = response
					} else {
						uni.showToast({
							icon: 'none',
							title: re.message
						});
					}
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			courseWatch(item) {
				this.checkStart(item, 1, () => {
					if (item.fileType === 1) {
						uni.navigateTo({
							url: `/pages/course-ware/video?uId=${item.trainUserItemId}&cId=${item.targetId}`
						});
					} else if (item.fileType === 2) {
						uni.navigateTo({
							url: `/pages/course-ware/pdf?uId=${item.trainUserItemId}&cId=${item.targetId}`
						});
					}
				})
			},
			checkStart(trainItem, type, after) {
				if (null == trainItem.trainUserItemId) {
					trainApi.start(this.trainId).then(res => {
						if (res.code === 1) {
							this.train = res.response
							if (type === 1) {
								this.train.courseWareList.forEach(item => {
									if (item.targetId === trainItem.targetId) {
										trainItem.trainUserItemId = item.trainUserItemId
									}
								})
							} else if (type === 2) {
								trainItem.trainUserItemId = this.train.examPaper.trainUserItemId
							}
							after()
						}
					})
				} else {
					after()
				}
			},
			paperDo(item) {
				this.checkStart(item, 2, () => {
					uni.navigateTo({
						url: `/pages/train/paper?uId=${item.trainUserItemId}&pId=${item.targetId}`
					});
				})
			},
			viewImage(url) {
				uni.previewImage({
					current: url,
					urls: [url],
				});
			},
			onPullDownRefresh() {
				this.reLoadDate()
			}
		}
	}
</script>


<style lang="scss">
	.train-detail-head {
		background-color: #FFFFFF;

		.train-image {
			line-height: 0;

			.loaded {
				width: 100%;
			}
		}

		.train-name {
			padding: 20rpx 30rpx 20rpx 30rpx;
			font-size: 30rpx;
			font-weight: 600;
			line-height: 1.5;
		}

		.train-detail-info {
			text-align: right;
			padding: 20rpx 10rpx;

			.text-span {
				margin-right: 10rpx;
			}
		}

		.train-info {
			border-top-width: 1rpx;
			border-top-style: solid;
			border-top-color: rgba(132, 126, 126, 0.1);
			margin: 0rpx 30rpx;
			padding: 20rpx 0rpx;

			.text-span {
				margin-right: 20rpx;
			}
		}
	}

	.train-detail-content {
		margin-top: 20rpx;
		background-color: #FFFFFF;

		.wdd-tab-menu {
			position: inherit;
			border-bottom-color: #ececec;
		}

		.train-des {
			padding: 30rpx 15px;
		}

		.train-course {
			.train-course-item {
				padding: 20rpx 10rpx;

				.train-course-name {
					display: flex;
					flex-direction: row;
					align-items: center;

					.file-type-image {
						height: 30rpx;
						width: 30rpx;
						margin-right: 10rpx;
						vertical-align: middle;
					}

					.train-course-name-content {
						flex: 1;
					}

				}

				.train-course-progress {
					margin: 6rpx 0rpx;
				}

				.progress-content {
					font-size: 26rpx;
					color: #909399;
					text-align: right;
				}
			}
		}

		.train-exam-paper {
			.train-exam-paper-content {
				background-color: #f6f6f6;

				.paper-info {
					background-color: #FFFFFF;
					padding: 40rpx 30rpx;

					.paper-item-name {}

					.paper-item-list {
						display: flex;
						flex-direction: row;
						justify-content: space-between;

						.paper-item-des {
							font-size: 26rpx;
							color: #909399;
						}
					}
				}

				.paper-record {
					margin-top: 10rpx;
					background-color: #FFFFFF;
					padding: 40rpx 30rpx;

					.paper-font {
						color: #909399;
						font-size: 26rpx;
					}

					.paper-record-top {
						.table-head {
							color: #656565;
							font-size: 28rpx;
						}

						.table-col-1 {
							width: 100rpx;
						}

						.table-col-2 {
							flex: 1
						}

						.table-col-3 {
							width: 120rpx;
						}

						.table-col-4 {
							width: 260rpx;
						}

						.record-head {
							display: flex;
							flex-direction: row;
						}

						.paper-record-item {
							margin: 20rpx 0rpx;

							.record-content {
								display: flex;
								flex-direction: row;
							}
						}
					}


					.paper-record-bottom {
						border-top-width: 1rpx;
						border-top-style: solid;
						border-top-color: rgba(132, 126, 126, 0.1);
						padding-top: 20rpx;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						.record-result {
							display: flex;

							.answer-waite {
								background-color: #409eff;
								border-color: #409eff;
								color: #FFFFFF;
								height: 48rpx;
								line-height: 48rpx;
								font-size: 24rpx;
								padding: 0rpx 16rpx;
								border-radius: 16rpx;
								width: 120rpx;
								text-align: center;
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
								width: 120rpx;
								text-align: center;
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
								width: 120rpx;
								text-align: center;
							}
						}

					}
				}
			}

		}


		.train-credential {
			.image-wrapper {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				padding: 50rpx;
			}
		}

	}
</style>