<template>
	<view class="video-container">

		<video :src="courseWare.originalPath" ref="wddVideo" class="video-watch" :initial-time="currentTime"
			@timeupdate="timeupdate($event)" @ended="onPlayerEnded($event)" id="wddVideo" v-show="videoShow"></video>

		<view class="video-menu">
			<view class="title">{{courseWare.name}}</view>
			<view class="info">
				<view>{{courseWare.createTime}}</view>
				<view>{{courseWare.createRealName}}</view>
			</view>
		</view>
		<view class="video-line"></view>
		<view class="course-detail-menu">
			<view class="course-detail-menu-title">课程详情</view>
			<view class="course-detail-menu-border"></view>
		</view>
		<view class="descript">
			{{courseWare.description}}
		</view>

		<uni-popup ref="questionDialog" :mask-click="false">
			<view class="question-popup">
				<view class="progress-box">
					<progress :percent="currentAnchor.progress.percentage" stroke-width="3" activeColor="#67C23A" />
					<view class="progress-text">{{ currentAnchor.progress.content }}</view>
				</view>

				<view class="question-dialog">

					<view class="question-dialog-content" v-if="!currentAnchor.submit">
						<!-- 题目展示开始 -->

						<view class="exam-qustion-content">
							<renderHtml
								:content="`${currentAnchor.question.title} （ ${currentAnchor.question.trickScore}分 )`" />
						</view>

						<view v-if="currentAnchor.question.questionType == 1" class="single-choice">
							<radio-group class="question-radio-group" @change="radioChange">
								<label class="choice-label" v-for="item in currentAnchor.question.questionItemFrames"
									:key="item.key">
									<radio class="choice-radio" :value="numToStr(item.key)" style="transform:scale(0.7)"
										color="#68bfd6" />
									<view class="exam-qustion-content" v-html="`${item.prefix}. ${item.content}`" />
								</label>
							</radio-group>
						</view>

						<view
							v-if="currentAnchor.question.questionType === 2 || currentAnchor.question.questionType === 6"
							class="multiple-choice">
							<checkbox-group class="question-checkbox-group" @change="checkboxChange">
								<label class="checkbox-label" v-for="item in currentAnchor.question.questionItemFrames"
									:key="item.key">
									<checkbox class="choice-checkbox" :value="numToStr(item.key)"
										style="transform:scale(0.7)" color="#68bfd6" />
									<view class="exam-qustion-content" v-html="`${item.prefix}. ${item.content}`" />
								</label>
							</checkbox-group>
						</view>

						<view v-if="currentAnchor.question.questionType === 3" class="true-false-choice">
							<radio-group class="question-true-false-group" @change="radioChange">
								<label class="true-false-label"
									v-for="item in currentAnchor.question.questionItemFrames" :key="item.key">
									<radio class="true-false-radio" :value="numToStr(item.key)"
										style="transform:scale(0.7)" color="#68bfd6" />
									<view class="exam-qustion-content" v-html="item.content" style="line-height:2.5;" />
								</label>
							</radio-group>
						</view>

						<view v-if="currentAnchor.question.questionType === 4" class="gap-filling">
							<view v-for="item in currentAnchor.question.questionItemFrames" :key="item.prefix">
								<view class="gap-filling-widget">
									<view class="prefix">{{item.prefix}}</view>
									<view class="editor-widget">
										<view class="uni-textarea">
											<input class="uni-input filling-input" :data-prefix="item.prefix-1"
												@input="inputChange" placeholder="请输入答案" />
										</view>
									</view>
								</view>
							</view>
						</view>

						<view v-if="currentAnchor.question.questionType === 5" class="editor-widget">
							<view class="uni-textarea">
								<textarea maxlength="1000" @input="textareaChange" placeholder="请输入答案"></textarea>
							</view>
						</view>


						<!-- 题目展示结束 -->
					</view>

					<view class="question-dialog-content" v-else>

						<!-- 结果展示开始 -->
						<view class="exam-qustion-content">
							<renderHtml
								:content="`${currentAnchor.question.title} （ ${currentAnchor.question.trickScore}分 )`" />
						</view>

						<view v-if="currentAnchor.question.questionType === 1" class="single-choice">
							<radio-group class="question-radio-group">
								<label class="choice-label" v-for="qItem in currentAnchor.question.questionItemFrames"
									:key="qItem.key">
									<radio class="choice-radio" :checked="qItem.key === currentAnchor.answer.contentKey"
										style="transform:scale(0.7)" color="#68bfd6" />
									<view class="exam-qustion-content" v-html="`${qItem.prefix}. ${qItem.content}`" />
								</label>
							</radio-group>
						</view>

						<view
							v-else-if="currentAnchor.question.questionType === 2 || currentAnchor.question.questionType === 6"
							class="multiple-choice">
							<checkbox-group class="question-checkbox-group">
								<label class="checkbox-label" v-for="qItem in currentAnchor.question.questionItemFrames"
									:key="qItem.key">
									<checkbox class="choice-checkbox"
										:checked="currentAnchor.answer.contentArrayKey.includes(qItem.key)"
										style="transform:scale(0.7)" color="#68bfd6" />
									<view class="exam-qustion-content" v-html="`${qItem.prefix}. ${qItem.content}`" />
								</label>
							</checkbox-group>
						</view>

						<view v-else-if="currentAnchor.question.questionType === 3" class="true-false-choice">
							<radio-group class="question-true-false-group">
								<label class="true-false-label"
									v-for="qItem in currentAnchor.question.questionItemFrames" :key="qItem.key">
									<radio class="true-false-radio"
										:checked="qItem.key === currentAnchor.answer.contentKey"
										style="transform:scale(0.7)" color="#68bfd6" />
									<view v-html="qItem.content" style="line-height:2.5;" />
								</label>
							</radio-group>
						</view>

						<view v-else-if="currentAnchor.question.questionType === 4" class="gap-filling">
							<view v-for="qItem in currentAnchor.question.questionItemFrames" :key="qItem.prefix"
								class="exam-list-contain">
								<view class="exam-list-contain-short-prefix">{{qItem.prefix}}</view>
								<view class="exam-list-contain-content"
									v-html="currentAnchor.answer.contentArray[qItem.prefix-1]" />
							</view>
						</view>


						<view v-else-if="currentAnchor.question.questionType === 5" class="short-answer">
							<view v-html="currentAnchor.answer.content" />
						</view>



						<view class="exam-list-contain" style="margin-top: 25rpx;">
							<view class="exam-list-contain-prefix">标答：</view>
							<view class="exam-list-contain-content"
								v-if="currentAnchor.question.questionType === 1||currentAnchor.question.questionType === 2||currentAnchor.question.questionType === 6">
								{{currentAnchor.answer.correctPrefix}}
							</view>
							<view v-else-if="currentAnchor.question.questionType === 3"
								class="exam-list-contain-content">
								{{currentAnchor.answer.correctContent}}
							</view>
							<view class="exam-list-contain-content"
								v-else-if="currentAnchor.question.questionType === 4">
								<view class="exam-list-contain"
									v-for="qItem in currentAnchor.question.questionItemFrames" :key="qItem.prefix">
									<view class="exam-list-contain-short-prefix">{{qItem.prefix}}</view>
									<view class="exam-list-contain-conteng" v-html="qItem.content" />
								</view>
							</view>
							<view v-else-if="currentAnchor.question.questionType === 5"
								class="exam-list-contain-content" v-html="currentAnchor.question.correct"></view>
						</view>

						<view class="answer-item-result">
							<view class="exam-list-contain-prefix">结果：</view>
							<uni-tag v-if="currentAnchor.answer.doRight === null" class="tag" text="待批改" type="warning"
								size="small" />
							<uni-tag v-else-if="currentAnchor.answer.doRight" class="tag" text="正确" type="success"
								size="small" />
							<uni-tag v-else-if="!currentAnchor.answer.doRight" class="tag" text="错误" type="error"
								size="small" />
						</view>


						<view class="answer-item-score">
							<view class="exam-list-contain-prefix">得分：</view>
							<view>
								{{currentAnchor.answer.customerScoreVM === null?'':currentAnchor.answer.customerScoreVM}}
							</view>
						</view>


						<view class="answer-item-difficult">
							<view class="exam-list-contain-prefix">难度：</view>
							<uni-rate class="rate" :size="28" :disabled="true"
								:value="currentAnchor.question.difficult" />
						</view>

						<view class="exam-list-contain">
							<view class="exam-list-contain-prefix">解析：</view>
							<view class="exam-list-contain-content content-flex">
								<view class="exam-qustion-content" v-html="currentAnchor.question.analyze" />
							</view>
						</view>
						<!-- 结果展示结束 -->

					</view>

					<view class="question-dialog-footer">
						<button class="cu-btn block bg-blue margin-tb-sm action-button"
							@click="questionSubmit">提交</button>
						<button class="cu-btn block bg-blue margin-tb-sm delete-button"
							@click="questionClose">关闭</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import renderHtml from '@/components/render-html/render-html.vue'
	import courseWareApi from '@/api/courseWare'
	import {
		aesDecryptStr,
		aesEncryptStr,
		lastPageAction
	} from '@/utils/index.js'

	export default {
		components: {
			renderHtml
		},
		computed: {
			numToStr(num) {
				return String.valueOf(num)
			}
		},
		data() {
			return {
				cId: null,
				uId: null,
				videoShow: true,
				videoContext: null,
				currentTime: null,
				initTime: false,
				courseWare: {
					originalPath: null,
					courseWareQuestionVMList: []
				},
				player: {
					playSecond: null,
					watchCall: null,
					questionCall: null,
					lastTime: 0
				},
				currentAnchor: {
					question: {},
					answer: {},
					submit: false,
					progress: {
						percentage: 0,
						content: ''
					}
				},
			}
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('wddVideo')
		},
		onLoad(options) {
			this.cId = options.cId
			this.uId = options.uId
			courseWareApi.select(this.cId).then(res => {
				if (res.code === 1) {
					let response = aesDecryptStr(res.response)
					this.courseWare = response
					this.initTime = true
					this.currentTime = this.courseWare.currentTime + 1
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message
					});
				}
			})
		},
		methods: {
			onPlayerEnded(player) {
				courseWareApi.watch({
					trainItemUserId: this.uId,
					courseWareId: this.cId,
					watchTime: this.player.lastTime,
					watchEnd: true
				}).then(re => {
					if (re.code === 1) {
						uni.showModal({
							title: '观看提示',
							content: re.message,
							success: function(reConfirm) {
								if (reConfirm.confirm) {
									lastPageAction(getCurrentPages(), 'pages/train/detail',
										vm => {
											vm.reLoadDate()
										})
									uni.navigateBack()
								}
							}
						});
					}
				})
			},
			timeupdate(player) {
				let currentTime = player.detail.currentTime
				if (this.initTime) {
					this.player.lastTime = currentTime
					this.initTime = false
				} else {
					if (this.watchDrag(currentTime)) {
						return
					}
				}

				let playSecond = Number(currentTime.toFixed(0))
				this.watchRecord(playSecond)
				this.watchQuestion(playSecond)
				this.player.playSecond = playSecond
			},
			watchDrag(currentTime) {
				let last = this.player.lastTime
				if (currentTime - last > 2) {
					this.videoContext.seek(Number(last.toFixed(0)))
					return true
				} else {
					this.player.lastTime = currentTime
					return false
				}
			},
			watchRecord(playSecond) {
				const duration = 60
				let lastPlaySecond = this.player.playSecond
				if (playSecond !== 0 && playSecond % duration === 0) {
					if (lastPlaySecond === playSecond && !this.player.watchCall) {
						this.player.watchCall = true
						let request = {
							trainItemUserId: this.uId,
							courseWareId: this.cId,
							watchTime: playSecond,
							watchEnd: false
						}
						courseWareApi.watch(request).then(re => {
							if (re.code === 1) {
								uni.showModal({
									title: '观看提示',
									content: re.message,
									success: function(reConfirm) {
										if (reConfirm.confirm) {
											lastPageAction(getCurrentPages(), 'pages/train/detail',
												vm => {
													vm.reLoadDate()
												})
											uni.navigateBack()
										}
									}
								});
							}
						})
					}
					if (lastPlaySecond !== playSecond) {
						this.player.watchCall = false
					}
				}
			},
			watchQuestion(playSecond) {
				const duration = 1
				let lastPlaySecond = this.player.playSecond
				if (playSecond !== 0 && playSecond % duration === 0) {
					if (lastPlaySecond === playSecond && !this.player.questionCall) {
						this.player.questionCall = true
						let questionCount = this.courseWare.courseWareQuestionVMList.length
						for (let i = 0; i < questionCount; i++) {
							let item = this.courseWare.courseWareQuestionVMList[i]
							if (item.anchorSecond === playSecond) {
								this.currentAnchor.question = item.questionFrame
								this.currentAnchor.answer = item.questionAnswerFrame
								this.currentAnchor.progress.content = `${i + 1} / ${questionCount}`
								this.currentAnchor.progress.percentage = (i + 1) * 100 / questionCount
								// #ifdef APP-PLUS
								this.videoShow = false
								// #endif
								this.$refs.questionDialog.open()
								this.videoContext.pause()
								this.videoContext.exitFullScreen()
							}
						}
					}
					if (lastPlaySecond !== playSecond) {
						this.player.questionCall = false
					}
				}
			},
			questionSubmit() {
				let parameter = aesEncryptStr({
					id: this.courseWare.id,
					answer: this.currentAnchor.answer
				})
				courseWareApi.submit(parameter).then(res => {
					if (res.code === 1) {
						let response = aesDecryptStr(res.response)
						this.currentAnchor.answer = response
						this.currentAnchor.submit = true
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message
						});
					}
				})
			},
			questionClose() {
				if (this.currentAnchor.submit) {
					this.currentAnchor.submit = false
					// #ifdef APP-PLUS
					this.videoShow = true
					// #endif
					this.videoContext.play()
					this.$refs.questionDialog.close()
				}
			},
			radioChange(e) {
				this.currentAnchor.answer.contentKey = e.detail.value
			},
			checkboxChange(e) {
				this.currentAnchor.answer.contentArrayKey = e.detail.value
			},
			inputChange(e) {
				let prefix = e.target.dataset.prefix
				this.currentAnchor.answer.contentArray[prefix] = e.detail.value
			},
			textareaChange(e) {
				this.currentAnchor.answer.content = e.detail.value
			},
		}
	}
</script>



<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.video-container {

		.video-watch {
			width: 100%;
		}


		.video-menu {
			padding: 10rpx 20rpx;

			.title {
				font-size: 36rpx;
				color: #333333;
			}

			.info {
				color: #909399;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}

		.video-line {
			height: 20rpx;
			background-color: #f6f6f6;
		}

		.course-detail-menu {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			border-bottom-width: 1rpx;
			border-bottom-style: solid;
			border-bottom-color: #e5e5e5;
			padding: 14rpx 0rpx;

			.course-detail-menu-title {
				color: #333333;
				font-weight: 550;
				font-size: 26rpx;
			}


			.course-detail-menu-border {
				height: 8rpx;
				width: 30rpx;
				background-color: #77d5c3;
				border-radius: 8rpx;
			}
		}

		.descript {
			padding: 20rpx;
		}

	}

	.question-popup {
		border-radius: 10rpx;
		background-color: #FFFFFF;

		.progress-box {
			padding: 20rpx 6rpx 0rpx 6rpx;
			display: flex;
			align-items: center;
			flex-direction: row;

			/* #ifdef MP-WEIXIN */
			progress {
				flex: 1;
			}

			/* #endif */

			/* #ifndef MP-WEIXIN */
			.uni-progress {
				flex: 1;
			}

			/* #endif */

			.progress-text {
				color: #67C23A;
				padding: 0rpx 10rpx;
			}
		}
	}


	.question-dialog {
		padding: 0rpx 40rpx 30rpx 40rpx;

		.question-dialog-content {
			margin-top: 20rpx;
		}

		.question-dialog-footer {
			display: flex;
			flex-direction: row;
			justify-content: center;
			margin-top: 20rpx;

			.cu-btn {
				height: 56rpx;
				width: 150rpx;
			}

			.delete-button {
				margin-left: 40rpx;
			}
		}
	}


	.single-choice {
		.question-radio-group {
			margin-top: 15rpx;

			.choice-label {
				margin-right: 20rpx;
				display: flex;

				.choice-radio {
					height: 100%;
				}

				.rich-text {
					display: inline;
				}

			}
		}
	}



	.multiple-choice {
		.question-checkbox-group {
			margin-top: 15rpx;

			.checkbox-label {
				margin-right: 20rpx;
				display: flex;

				.choice-checkbox {
					height: 100%;
				}

				.rich-text {
					display: inline;
				}
			}

		}
	}


	.true-false-choice {
		.question-true-false-group {
			margin-left: 20rpx;
			display: inline-block;

			.true-false-label {
				margin-right: 20rpx;
				display: inline-flex;

				.true-false-radio {
					margin: 10rpx;
					height: 100%;
				}

				.rich-text {
					display: inline;
					margin: 10rpx;
				}
			}
		}
	}

	.gap-filling-widget {
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;

		.prefix {
			width: 50rpx;
		}

		.editor-widget {
			flex: 1;

			.uni-textarea {


				/* #ifdef MP-WEIXIN */
				input {
					padding: 2rpx 10rpx !important;
					height: 58rpx;
				}

				/* #endif */

				/* #ifdef H5 */
				.uni-input {
					padding: 2rpx 10rpx !important;
					height: 58rpx;
				}

				/* #endif */


				/* #ifdef APP-PLUS */
				.uni-input {
					padding: 2rpx 10rpx !important;
					height: 58rpx;
				}

				/* #endif */
			}


		}
	}

	.editor-widget {


		.uni-textarea {
			border: 2rpx solid #d1d1d1;

			/* #ifdef H5 */
			uni-textarea {
				padding: 2rpx 10rpx !important;
				height: 240rpx !important;
				width: 100% !important;
			}

			/* #endif */


			/* #ifdef APP-PLUS */
			uni-textarea {
				padding: 2rpx 10rpx !important;
				height: 240rpx !important;
				width: 100% !important;
			}

			/* #endif */

			/* #ifdef MP-WEIXIN */
			textarea {
				padding: 2rpx 10rpx !important;
				height: 240rpx !important;
				width: 100% !important;
			}

			/* #endif */
		}
	}


	.gap-filling {
		.gap-filling-input-contain {
			display: flex;
			flex-direction: row;
			border: 2rpx solid #d1d1d1;
			margin: 15rpx 0rpx;
			padding: 8rpx;

			.prefix {
				margin-left: 10rpx;
			}

			.filling-input {
				padding: 0rpx 0rpx 0rpx 25rpx;
			}
		}

	}

	.short-answer {
		.uni-textarea {
			margin-top: 10rpx;
			border: 2rpx solid #d1d1d1;

			uni-textarea {
				height: 240rpx !important;
			}
		}
	}

	.answer-item-result {
		display: flex;

		.tag {
			margin-top: 2rpx;
		}
	}


	.answer-item-score {
		display: flex;
	}

	.answer-item-difficult {
		display: flex;
	}

	.answer-item-analyze {
		display: flex;

		.rich-text {
			flex: 1;
		}
	}
</style>