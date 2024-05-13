<template>
	<view class="paper-read">
		<view v-show="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>

		<view class="container" v-show="!noneShow">
			<view class="exam-paper-head" @click="anchorShow">
				<view class="head-question-count-down">
					{{answer.createTime}}
				</view>
				<uni-icons color="#FFFFFF" size="36" type="anchor-list" class="head-question-list" />
			</view>

			<swiper class="paper-content" @change="swiperChange" :current="questionIndex">
				<swiper-item v-for="questionItem in questionList" :key="questionItem.id">
					<scroll-view :scroll-y="true" class="question-scroll-view">
						<view class="question-contain">
							<!-- 题目展示开始 -->
							<view class="question-show">

								<view class="exam-qustion-content">
									<renderHtml
										:content="`${questionItem.itemOrder}、${questionItem.title} （ ${questionItem.trickScore}分 )`" />
								</view>

								<view v-if="questionItem.questionType === 1" class="single-choice">
									<radio-group class="question-radio-group">
										<label class="choice-label" v-for="qItem in questionItem.questionItemFrames"
											:key="qItem.key">
											<radio class="choice-radio"
												:checked="qItem.key === answer.questionAnswerFrameList[questionItem.itemOrder-1].contentKey"
												style="transform:scale(0.7)" color="#68bfd6" />
											<view class="exam-qustion-content"
												v-html="`${qItem.prefix}. ${qItem.content}`" />
										</label>
									</radio-group>
								</view>

								<view v-else-if="questionItem.questionType === 2 || questionItem.questionType === 6"
									class="multiple-choice">
									<checkbox-group class="question-checkbox-group">
										<label class="checkbox-label" v-for="qItem in questionItem.questionItemFrames"
											:key="qItem.key">
											<checkbox class="choice-checkbox"
												:checked="answer.questionAnswerFrameList[questionItem.itemOrder-1].contentArrayKey.includes(qItem.key)"
												style="transform:scale(0.7)" color="#68bfd6" />
											<view class="exam-qustion-content"
												v-html="`${qItem.prefix}. ${qItem.content}`" />
										</label>
									</checkbox-group>
								</view>

								<view v-else-if="questionItem.questionType === 3" class="true-false-choice">
									<radio-group class="question-true-false-group">
										<label class="true-false-label" v-for="qItem in questionItem.questionItemFrames"
											:key="qItem.key">
											<radio class="true-false-radio"
												:checked="qItem.key === answer.questionAnswerFrameList[questionItem.itemOrder-1].contentKey"
												style="transform:scale(0.7)" color="#68bfd6" />
											<view v-html="qItem.content" style="line-height:2.5;" />
										</label>
									</radio-group>
								</view>

								<view v-else-if="questionItem.questionType === 4" class="gap-filling">
									<view v-for="(qItem,index) in questionItem.questionItemFrames" :key="index"
										class="exam-list-contain gap-filling-item">
										<view class="exam-list-contain-short-prefix">{{qItem.prefix}}</view>
										<view class="exam-list-contain-content"
											v-html="answer.questionAnswerFrameList[questionItem.itemOrder-1].contentArray[index]" />
									</view>
								</view>


								<view v-else-if="questionItem.questionType === 5" class="short-answer">
									<view v-html="answer.questionAnswerFrameList[questionItem.itemOrder-1].content" />
								</view>


								<view class="paper-line" style="margin: 25rpx 0rpx;" />

								<view class="exam-list-contain">
									<view class="exam-list-contain-prefix">标答：</view>
									<view class="exam-list-contain-content"
										v-if="questionItem.questionType === 1||questionItem.questionType === 2||questionItem.questionType === 6">
										{{answer.questionAnswerFrameList[questionItem.itemOrder-1].correctPrefix}}
									</view>
									<view v-else-if="questionItem.questionType === 3" class="exam-list-contain-content">
										{{answer.questionAnswerFrameList[questionItem.itemOrder-1].correctContent}}
									</view>
									<view class="exam-list-contain-content" v-else-if="questionItem.questionType === 4">
										<view class="exam-list-contain" v-for="qItem in questionItem.questionItemFrames"
											:key="qItem.prefix">
											<view class="exam-list-contain-short-prefix">{{qItem.prefix}}</view>
											<view class="exam-list-contain-conteng" v-html="qItem.content" />
										</view>
									</view>
									<view v-else-if="questionItem.questionType === 5" class="exam-list-contain-content"
										v-html="questionItem.correct"></view>
								</view>

								<view class="answer-item-result">
									<view class="exam-list-contain-prefix">结果：</view>
									<uni-tag
										v-if="answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight === undefined"
										class="tag" text="已批改" type="primary" size="small" />
									<uni-tag
										v-else-if="answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight === null"
										class="tag" text="待批改" type="warning" size="small" />
									<uni-tag
										v-else-if="answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight"
										class="tag" text="正确" type="success" size="small" />
									<uni-tag
										v-else-if="!answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight"
										class="tag" text="错误" type="error" size="small" />
								</view>


								<view class="answer-item-score">
									<view class="exam-list-contain-prefix">得分：</view>
									<view>
										{{answer.questionAnswerFrameList[questionItem.itemOrder-1].customerScoreVM === null?'':answer.questionAnswerFrameList[questionItem.itemOrder-1].customerScoreVM}}
									</view>
								</view>


								<view class="answer-item-difficult">
									<view class="exam-list-contain-prefix">难度：</view>
									<uni-rate class="rate" :size="28" :disabled="true"
										:value="questionItem.difficult" />
								</view>

								<view class="exam-list-contain">
									<view class="exam-list-contain-prefix">解析：</view>
									<view class="exam-list-contain-content content-flex">
										<view class="exam-qustion-content" v-html="questionItem.analyze" />
									</view>
								</view>


								<view class="judge-box"
									v-if="answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight === null || answer.questionAnswerFrameList[questionItem.itemOrder-1].doRight === undefined">
									<view class="judge-title">批改：</view>
									<view class="judge-content">
										<uni-number-box :min="0" :step="0.5"
											@change="judgeChange($event,questionItem.itemOrder-1)"
											:max="Number(questionItem.trickScore)" :initValue="false"></uni-number-box>
									</view>
								</view>


							</view>

							<!-- 题目展示结束 -->
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>

			<view class="paper-foot">
				<view class="foot-item-left">得分：{{answer.userScore}} / {{answer.paperScore}}</view>
				<view class="foot-item-center">{{questionIndex+1}} / {{questionList.length}}</view>
				<view class="foot-item-right">耗时：{{answer.doTimeStr}}</view>
			</view>
		</view>
		<uni-popup ref="anchorPopup" type="center" :maskClick="true" containClass="width:100%;height:60%">
			<view class="anchor-popup">
				<view class="anchor-head">
					<view>{{paper.name}}</view>
					<view class="paper-other-info">
						<view class="paper-other-text">得分：{{answer.userScore}} / {{answer.paperScore}}</view>
						<view class="paper-other-text">耗时：{{answer.doTimeStr}}</view>
					</view>
				</view>
				<view class="paper-line" />
				<scroll-view scroll-y="true" class="anchor-scroll-view">
					<view v-for="(tItem,tIndex) in paper.examPaperDoTitleList" :key="tIndex">
						<view class="anchor-quesiton-title">
							{{tItem.name}}
						</view>
						<view class="anchor-quesiton-tag-list">
							<uni-tag class="tag" :text="qItem.itemOrder.toString()"
								v-for="qItem in tItem.questionFrameList" @click="goAnchor(qItem.itemOrder-1)"
								:type="answer.questionAnswerFrameList[qItem.itemOrder-1].doRight === undefined ? 'primary' : answer.questionAnswerFrameList[qItem.itemOrder-1].doRight === null ? 'warning' : answer.questionAnswerFrameList[qItem.itemOrder-1].doRight ? 'success' : 'error'"
								:key="qItem.itemOrder" />
						</view>
					</view>
				</scroll-view>
				<button class="cu-btn block bg-blue margin-tb-sm lg popup-submint action-button"
					@click="formSubmit">提交试卷</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import renderHtml from '@/components/render-html/render-html.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import practiceApi from '@/api/practice'
	import {
		aesDecryptStr,
		aesEncryptStr
	} from '@/utils/index.js'

	export default {
		components: {
			uniTag,
			uniRate,
			renderHtml
		},
		data() {
			return {
				questionIndex: 0,
				questionList: [],
				paper: {},
				answer: {},
				innerAudioContext: null,
				noneShow: true
			};
		},
		onLoad(options) {
			let _this = this
			practiceApi.read(options.id).then(res => {
				if (res.code === 1) {
					let re = aesDecryptStr(res.response)
					_this.paper = re.paper
					for (let title of re.paper.examPaperDoTitleList) {
						for (let item of title.questionFrameList) {
							_this.questionList.push(item)
						}
					}
					_this.answer = re.answer
					_this.noneShow = false
				} else {
					_this.noneShow = true
					uni.showToast({
						icon: 'none',
						title: res.message
					});
				}
			})

			// #ifdef MP-WEIXIN
			this.innerAudioContext = wx.createInnerAudioContext();
			this.innerAudioContext.obeyMuteSwitch = false;
			// #endif
		},
		onUnload() {
			// #ifdef MP-WEIXIN
			this.innerAudioContext.destroy();
			// #endif
		},
		methods: {
			swiperChange(e) {
				let index = e.detail.current
				this.questionIndex = index
			},
			anchorShow() {
				this.$refs.anchorPopup.open()
			},
			goAnchor(index) {
				this.questionIndex = index
				this.$refs.anchorPopup.close()
			},
			judgeChange(value, questionIndex) {
				if (value !== null) {
					this.answer.questionAnswerFrameList[questionIndex].judgeScoreVM = value
					this.answer.questionAnswerFrameList[questionIndex].doRight = undefined
				}
			},
			formSubmit() {
				let _this = this
				practiceApi.edit(aesEncryptStr(this.answer)).then(re => {
					if (re.code === 1) {
						uni.showModal({
							title: '考试结果',
							content: `练习得分：${re.response}分`,
							showCancel: false,
							confirmText: '查看答卷',
							success: function(res) {
								uni.redirectTo({
									url: `/pages/practice/read?id=${_this.answer.id}`
								});
							}
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: re.message
						});
					}
				})
			},
		}
	}
</script>


<style lang="scss">
	page {
		height: 100%;
		background: #FFFFFF;
	}

	.paper-read {
		height: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.exam-paper-head {
		height: 70rpx;
		width: 100%;
		background: #68bfd6;
		z-index: 999;
		display: flex;

		.head-question-count-down {
			flex: 1;
			padding-left: 60rpx;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.head-question-list {
			display: flex;
			align-items: center;
			margin-right: 6rpx;
		}
	}

	.anchor-popup {
		background-color: #fff;
		z-index: 999;
		height: 100%;


		.anchor-head {
			padding: 10rpx;
			height: 150rpx;

			.paper-other-info {
				.paper-other-text {
					text-align: right;
					font-size: 24rpx;
					margin-left: 40rpx;
				}
			}
		}

		.anchor-scroll-view {
			height: calc(100% - 170rpx);
		}

		.anchor-quesiton-title {
			font-size: 24rpx;
			padding: 10rpx;
		}

		.anchor-quesiton-tag-list {
			padding: 10rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-content: flex-start;

			.uni-tag {
				width: 80rpx !important;
				height: 50rpx !important;
				margin-left: 6rpx !important;
				margin-top: 6rpx !important;
				border-radius: 0rpx !important;
				padding: 0rpx !important;
				display: block !important;
				text-align: center !important;
				border: 0rpx !important;
				line-height: 50rpx !important;
				font-size: 26rpx !important;
			}

			.uni-tag--default {
				background-color: #F1F3F8 !important;
				color: #B4B6BD !important;
			}
		}
	}



	.paper-content {
		flex: 1;

		.question-scroll-view {
			height: 100%;

			.question-contain {
				padding: 30rpx 20rpx 20rpx 20rpx;


				.judge-box {
					display: flex;
					margin-top: 20rpx;
					align-items: center;

					.judge-title {
						font-weight: 600;
						color: #e54d42;
						font-size: 28rpx;
					}

					.judge-content {}
				}
			}
		}
	}


	.paper-foot {
		height: 70rpx;
		width: 100%;
		display: flex;
		border-top: 2rpx solid #d1d1d1;
		justify-content: space-between;
		align-items: center;
		z-index: 99;

		.foot-item-left {
			padding-left: 10rpx;
			font-size: 24rpx;
		}

		.foot-item-center {
			flex: 1;
			text-align: center;
		}

		.foot-item-right {
			padding-right: 10rpx;
			text-align: right;
			font-size: 24rpx;
		}
	}


	.paper-line {
		z-index: 3;
		height: 2rpx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #f7f6fb
	}


	.single-choice {
		.question-radio-group {
			.choice-label {
				margin: 30rpx 0rpx;
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

			.checkbox-label {
				margin: 30rpx 0rpx;
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
			display: flex;
			flex-direction: column;

			.true-false-label {
				margin: 6px 0rpx;
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

	.gap-filling {
		.gap-filling-item {
			margin: 30rpx 0rpx;
		}
	}

	.short-answer {
		margin: 30rpx 0rpx;
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

	.answer-item-correct {
		display: flex;

		.gra-fill {
			flex: 1;

			.rich-text {
				display: inline-block;
			}
		}

		.rich-text {
			flex: 1;
		}
	}
</style>