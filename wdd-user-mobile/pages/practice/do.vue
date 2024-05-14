<template>
	<view class="paper-do">
		<view v-show="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="container" v-show="!noneShow">

			<view class="exam-paper-head practice-head" @click="anchorShow">
				<view></view>
				<view class="practice-time">{{formatSeconds(answer.doTime)}}</view>
				<uni-icons color="#FFFFFF" size="36" type="anchor-list" class="head-question-list" />
			</view>

			<swiper class="paper-content" @change="swiperChange" :current="questionIndex">
				<swiper-item v-for="questionItem in questionList" :key="questionItem.id">
					<scroll-view :scroll-y="true" class="question-scroll-view">
						<view class="question-contain">
							<!-- 题目展示开始 -->

							<view class="exam-qustion-content">
								<renderHtml
									:content="`${questionItem.itemOrder}、${questionItem.title} （ ${questionItem.trickScore}分 )`" />
							</view>

							<view v-if="questionItem.questionType == 1" class="single-choice">
								<radio-group class="question-radio-group" :data-index="questionItem.itemOrder-1"
									@change="radioChange">
									<label class="choice-label" v-for="item in questionItem.questionItemFrames"
										:key="item.key">
										<radio class="choice-radio" :value="numToStr(item.key)"
											:checked="numToStr(item.key) === answer.questionAnswerFrameList[questionItem.itemOrder-1].contentKey"
											style="transform:scale(0.7)" color="#68bfd6" />
										<view class="exam-qustion-content" v-html="`${item.prefix}. ${item.content}`" />
									</label>
								</radio-group>
							</view>

							<view v-if="questionItem.questionType === 2 || questionItem.questionType === 6"
								class="multiple-choice">
								<checkbox-group class="question-checkbox-group" :data-index="questionItem.itemOrder-1"
									@change="checkboxChange">
									<label class="checkbox-label" v-for="item in questionItem.questionItemFrames"
										:key="item.key">
										<checkbox class="choice-checkbox" :value="numToStr(item.key)"
											:checked="answer.questionAnswerFrameList[questionItem.itemOrder-1].contentArrayKey.includes(numToStr(item.key))"
											style="transform:scale(0.7)" color="#68bfd6" />
										<view class="exam-qustion-content" v-html="`${item.prefix}. ${item.content}`" />
									</label>
								</checkbox-group>
							</view>

							<view v-if="questionItem.questionType === 3" class="true-false-choice">
								<radio-group class="question-true-false-group" :data-index="questionItem.itemOrder-1"
									@change="radioChange">
									<label class="true-false-label" v-for="item in questionItem.questionItemFrames"
										:key="item.key">
										<radio class="true-false-radio" :value="numToStr(item.key)"
											:checked="numToStr(item.key) === answer.questionAnswerFrameList[questionItem.itemOrder-1].contentKey"
											style="transform:scale(0.7)" color="#68bfd6" />
										<view class="exam-qustion-content" v-html="item.content"
											style="line-height:2.5;" />
									</label>
								</radio-group>
							</view>

							<view v-if="questionItem.questionType === 4" class="gap-filling">
								<view v-for="(item,index) in questionItem.questionItemFrames" :key="index">
									<view class="gap-filling-widget">
										<view class="prefix">{{item.prefix}}</view>
										<view class="editor-widget">
											<view class="uni-textarea">
												<input class="uni-input filling-input"
													:data-index="questionItem.itemOrder-1" :data-prefix="index"
													:value="answer.questionAnswerFrameList[questionItem.itemOrder-1].contentArray[index]"
													@input="inputChange" placeholder="请输入答案" />
											</view>
										</view>
									</view>
								</view>
							</view>

							<view v-if="questionItem.questionType === 5" class="editor-textarea-widget">
								<view class="uni-textarea">
									<textarea maxlength="1000" :data-index="questionItem.itemOrder-1"
										:value="answer.questionAnswerFrameList[questionItem.itemOrder-1].content"
										@input="textareaChange" placeholder="请输入答案"></textarea>
								</view>
							</view>



							<!-- 题目展示结束 -->
						</view>

					</scroll-view>
				</swiper-item>
			</swiper>

			<view class="paper-foot">
				<view class="foot-item-left">
					<button class="cu-btn block bg-blue lg submit-action-button" @click="formSubmitConfirm">交卷</button>
				</view>
				<view class="foot-item-center">{{questionIndex+1}} / {{questionList.length}}</view>
				<view class="foot-item-right" @click="anchorShow">
					<uni-icons color="#68bfd6" size="32" type="anchor-list" class="head-question-list" />
				</view>
			</view>
		</view>
		<uni-popup ref="anchorPopup" type="center" :maskClick="true" containClass="width:100%;height:60%">
			<view class="anchor-popup">
				<!-- <view class="anchor-head">
					<view>{{paper.name}}</view>
					<view class="paper-other-info">
						<span>总分：{{paper.score}}</span>
						<span>建议时长：{{paper.suggestTime}}分钟</span>
					</view>
				</view> -->
				<view class="paper-line" />
				<scroll-view scroll-y="true" class="anchor-scroll-view">
					<view v-for="(tItem,tIndex) in paper.examPaperDoTitleList" :key="tIndex">
						<view class="anchor-quesiton-title">
							{{tItem.name}}
						</view>
						<view class="anchor-quesiton-tag-list">
							<uni-tag class="tag" :text="qItem.itemOrder.toString()"
								v-for="qItem in tItem.questionFrameList" @click="goAnchor(qItem.itemOrder-1)"
								:type="answer.questionAnswerFrameList[qItem.itemOrder-1].completed ? 'success' : 'default'"
								:key="qItem.itemOrder" />
						</view>
					</view>
				</scroll-view>
				<button class="cu-btn block bg-blue margin-tb-sm lg popup-submint action-button"
					@click="formSubmitConfirm">提交练习</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import renderHtml from '@/components/render-html/render-html.vue'
	import practiceApi from '@/api/practice'

	import {
		aesDecryptStr,
		aesEncryptStr,
		toBase64,
		fromBase64,
		formatSeconds
	} from '@/utils/index.js'

	import {
		Web_URL,
		Token_Store_Key
	} from '@/utils/common'

	export default {
		components: {
			uniTag,
			uniIcons,
			uniPopup,
			renderHtml
		},
		computed: {
			numToStr(num) {
				return String.valueOf(num)
			}
		},
		data() {
			return {
				noneShow: true,
				questionIndex: 0,
				questionList: [],
				paper: {},
				answer: {
					doTime: 0,
				},
				innerAudioContext: null,
				cacheKey: null,
				timer: null,
				stopInterval: false

			};
		},
		onLoad(options) {
			let _this = this
			_this.cacheKey = `wdd-practice-answer-${options.id}`
			practiceApi.select(options.id).then(res => {
				if (res.code === 1) {
					let re = aesDecryptStr(res.response)
					_this.paper = re.paper
					for (let title of re.paper.examPaperDoTitleList) {
						for (let item of title.questionFrameList) {
							_this.questionList.push(item)
						}
					}
					_this.answer = _this.revertCache(re.answer)
					_this.timeReduce()
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
			this.stopAll()
		},
		methods: {
			formatSeconds(doTime) {
				return formatSeconds(doTime)
			},
			swiperChange(e) {
				let index = e.detail.current
				this.questionIndex = index
			},
			radioChange(e) {
				let index = e.target.dataset.index
				let answerItem = this.answer.questionAnswerFrameList[index]
				answerItem.contentKey = e.detail.value
				answerItem.completed = true
			},
			checkboxChange(e) {
				let index = e.target.dataset.index
				let answerItem = this.answer.questionAnswerFrameList[index]
				answerItem.contentArrayKey = e.detail.value
				answerItem.completed = answerItem.contentArrayKey.length !== 0
			},
			inputChange(e) {
				let index = e.target.dataset.index
				let prefix = e.target.dataset.prefix
				let answerItem = this.answer.questionAnswerFrameList[index]
				answerItem.contentArray[prefix] = e.detail.value

				let gapCompleted = true
				for (const aItem of answerItem.contentArray) {
					if (aItem.length === 0) {
						gapCompleted = false
						break
					}
				}
				answerItem.completed = gapCompleted
			},
			textareaChange(e) {
				let index = e.target.dataset.index
				let answerItem = this.answer.questionAnswerFrameList[index]
				answerItem.content = e.detail.value
				answerItem.completed = answerItem.content.length !== 0
			},
			cacheSave() {
				let cacheAnswer = []
				for (let i = 0; i < this.answer.questionAnswerFrameList.length; i++) {
					let pageItem = this.answer.questionAnswerFrameList[i]
					let parentAnswer = {
						questionId: pageItem.questionId,
						contentKey: pageItem.contentKey,
						contentArrayKey: pageItem.contentArrayKey,
						contentArray: pageItem.contentArray,
						content: pageItem.content,
						completed: pageItem.completed
					}
					cacheAnswer.push(parentAnswer)
				}
				let cacheContent = {
					doTime: this.answer.doTime,
					answer: cacheAnswer
				}
				let answerBase64 = toBase64(JSON.stringify(cacheContent))
				uni.setStorageSync(this.cacheKey, answerBase64)
			},
			revertCache(answer) {
				let cacheAnswerStr = uni.getStorageSync(this.cacheKey)
				if (cacheAnswerStr !== null && cacheAnswerStr != '') {
					let cacheContent = JSON.parse(fromBase64(cacheAnswerStr))
					answer.doTime = cacheContent.doTime
					let cacheAnswer = cacheContent.answer
					for (let i = 0; i < answer.questionAnswerFrameList.length; i++) {
						let pageItem = answer.questionAnswerFrameList[i]
						for (let j = 0; j < cacheAnswer.length; j++) {
							let cacheItem = cacheAnswer[j]
							if (pageItem.questionId === cacheItem.questionId) {
								pageItem.contentKey = cacheItem.contentKey
								pageItem.contentArrayKey = cacheItem.contentArrayKey
								pageItem.contentArray = cacheItem.contentArray
								pageItem.content = cacheItem.content
								pageItem.completed = cacheItem.completed
							}
						}
					}
				}
				return answer
			},
			formSubmitConfirm() {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '此操作将提交该试卷, 是否继续?',
					success: function(res) {
						if (res.confirm) {
							_this.stopAll()
							_this.formSubmit()
						} else if (res.cancel) {

						}
					}
				});
			},
			formSubmit() {
				let _this = this
				this.answer.submitDateTime = new Date()
				practiceApi.submit(aesEncryptStr(this.answer)).then(re => {
					uni.removeStorageSync(_this.cacheKey);
					if (re.code === 1) { //无需批改
						uni.showModal({
							title: '考试结果',
							content: `练习得分：${re.message}分`,
							showCancel: false,
							confirmText: '查看答卷',
							success: function(res) {
								uni.redirectTo({
									url: `/pages/practice/read?id=${re.response}`
								});
							}
						});
					} else { //需要批改
						uni.showModal({
							title: '考试结果',
							content: `主观题得分：${re.message}分`,
							showCancel: false,
							confirmText: '去批改',
							success: function(res) {
								uni.redirectTo({
									url: `/pages/practice/edit?id=${re.response}`
								});
							}
						});
					}
				})
			},
			timeReduce() {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				let _this = this
				clearInterval(this.timer)
				this.timer = setInterval(function() {
					if (!_this.stopInterval) {
						++_this.answer.doTime
						// 页面缓存答案
						if (_this.answer.doTime % 10 === 0) {
							_this.cacheSave()
						}
					}
				}, 1000)
			},
			stopAll() {
				this.stopInterval = true
				clearInterval(this.timer)
				this.timer = null
			},
			anchorShow() {
				this.$refs.anchorPopup.open()
			},
			goAnchor(index) {
				this.questionIndex = index
				this.$refs.anchorPopup.close()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background: #FFFFFF;
	}

	.paper-do {
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
			padding-top: 8rpx;
			flex: 1;
			padding-left: 60rpx;
			text-align: center;
		}

		.head-question-list {
			display: flex;
			align-items: center;
			margin-right: 6rpx;
		}
	}


	.paper-camera {
		position: absolute;
		top: 0;
		right: 0;
	}

	.h5-paper-camera {
		position: absolute !important;
		right: 0;
		top: 0;
		width: 98rpx !important;
		height: 100rpx !important;
		z-index: 1000;
	}


	.h5-paper-canvas {
		position: absolute !important;
		right: 0;
		top: 0;
		width: 98rpx !important;
		height: 100rpx !important;
	}

	.anchor-popup {
		background-color: #fff;
		z-index: 9999;
		height: 100%;
		padding-bottom: 4rpx;


		.anchor-head {
			padding: 10rpx;
			height: 110rpx;

			.paper-other-info {
				font-size: 24rpx;
				text-align: right;

				span {
					margin-left: 40rpx;
				}
			}
		}

		.anchor-scroll-view {
			height: calc(100% - 190rpx);
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

		.popup-submint {
			margin: 10rpx 0rpx 10rpx 0rpx;
			border-radius: 0rpx;
			font-size: 28rpx;
			height: 60rpx;
		}
	}


	.paper-content {
		flex: 1;

		.question-scroll-view {
			height: 100%;

			.question-contain {
				padding: 30rpx 20rpx 20rpx 20rpx;
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
			width: 200rpx;
			padding-left: 40rpx;

			.submit-action-button {
				height: 50rpx;
				width: 100rpx;
				font-size: 24rpx;
				cursor: pointer;
				background-color: #68bfd6 !important;
				color: #fff;
				outline: none;
				padding: 0rpx;
				border: 0rpx !important;
				border-radius: 30rpx !important;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.foot-item-center {
			flex: 1;
			text-align: center;
		}

		.foot-item-right {
			width: 200rpx;
			text-align: right;
			padding-right: 40rpx;
		}
	}

	.paper-line {
		z-index: 3;
		height: 2rpx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #f7f6fb;
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

	.gap-filling-widget {
		margin: 30rpx 10rpx;
		display: flex;
		flex-direction: row;

		.prefix {
			width: 50rpx;
		}

		.editor-widget {
			flex: 1;

			.uni-textarea {
				border: 2rpx solid #d1d1d1;

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

	.editor-textarea-widget {
		margin: 30rpx 10rpx;

		.uni-textarea {
			border: 2rpx solid #d1d1d1;

			/* #ifdef H5 */
			uni-textarea {
				padding: 2rpx 10rpx !important;
				height: 540rpx !important;
				width: 100% !important;
			}

			/* #endif */


			/* #ifdef APP-PLUS */
			uni-textarea {
				padding: 2rpx 10rpx !important;
				height: 540rpx !important;
				width: 100% !important;
			}

			/* #endif */

			/* #ifdef MP-WEIXIN */
			textarea {
				padding: 2rpx 10rpx !important;
				height: 540rpx !important;
				width: 100% !important;
			}

			/* #endif */
		}
	}
</style>