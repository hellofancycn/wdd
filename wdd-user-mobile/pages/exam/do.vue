<template>
	<view class="paper-do">
		<view v-show="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="container" v-show="!noneShow">
			<!-- #ifdef MP-WEIXIN -->
			<view class="paper-camera" v-show="paper.capture">
				<camera device-position="front" flash="off" @error="error" style="width: 98rpx; height: 100rpx;">
				</camera>
			</view>
			<!-- #endif -->

			<!-- #ifdef H5 -->
			<view v-show="paper.capture && camera.initSuccess">
				<canvas canvas-id="canvas" class="h5-paper-canvas"></canvas>
				<video autoplay="autoplay" class="h5-paper-camera"></video>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP-PLUS -->
			<view v-if="paper.capture">
				<web-view :src="cameraUrl" :update-title="false"></web-view>
			</view>
			<!-- #endif -->
			<view class="exam-paper-head" @click="anchorShow">
				<uni-count-down ref="countDown" :show-day="false" class="head-question-count-down" @timeup="timeup"
					@timeUpdate="timeUpdate" />
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
				<view class="anchor-head">
					<view>{{paper.name}}</view>
					<view class="paper-other-info">
						<span>总分：{{paper.score}}</span>
						<span>时间：{{paper.suggestTime}}分钟</span>
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
								:type="answer.questionAnswerFrameList[qItem.itemOrder-1].completed ? 'success' : 'default'"
								:key="qItem.itemOrder" />
						</view>
					</view>
				</scroll-view>
				<button class="cu-btn block bg-blue margin-tb-sm lg popup-submint action-button"
					@click="formSubmitConfirm">提交试卷</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import renderHtml from '@/components/render-html/render-html.vue'
	import uniCountDown from '@/components/uni-count-down/uni-count-down.vue'
	import examPaperApi from '@/api/examPaper'
	import examPaperAnswerApi from '@/api/examPaperAnswer'
	import {
		aesDecryptStr,
		aesEncryptStr,
		toBase64,
		fromBase64
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
			uniCountDown,
			renderHtml
		},
		computed: {
			numToStr(num) {
				return String.valueOf(num)
			}
		},
		data() {
			return {
				cheatCount: 0,
				noneShow: true,
				questionIndex: 0,
				questionList: [],
				paper: {},
				answer: {},
				innerAudioContext: null,
				cameraContext: null,
				camera: {
					initSuccess: false,
					video: null,
					canvas: null,
					context: null,
					random: 50
				},
				cameraUrl: null,
				cacheKey: null
			};
		},
		onLoad(options) {
			let _this = this
			_this.cacheKey = `wdd-exam-answer-${options.id}`
			examPaperApi.select(options.type, options.id).then(res => {
				if (res.code === 1) {
					let re = aesDecryptStr(res.response)
					_this.cheatCount = re.cheatCount
					_this.paper = re.paper
					for (let title of re.paper.examPaperDoTitleList) {
						for (let item of title.questionFrameList) {
							_this.questionList.push(item)
						}
					}

					//首次进入，清理缓存
					if (re.initFirst) {
						uni.removeStorageSync(_this.cacheKey);
					}

					_this.answer = _this.revertCache(re.answer)
					_this.$refs.countDown.start(re.remainTime)
					_this.noneShow = false

					if (_this.paper.cheat !== null && _this.paper.cheat) {
						if (_this.cheatCount >= _this.paper.maxCheatCount) {
							_this.formSubmit()
							return
						}
					}


					// #ifdef H5
					if (_this.paper.capture) {
						_this.$nextTick(function() {
							_this.cameraInit()
						})
					}
					// #endif

					// #ifdef APP-PLUS
					if (_this.paper.capture) {
						let token = encodeURIComponent(uni.getStorageSync(Token_Store_Key))
						_this.cameraUrl = Web_URL +
							`/hybrid/html/camera/index.html?paperId=${_this.paper.id}&token=${token}`
						setTimeout(function() {
							let wv = _this.$scope.$getAppWebview().children()[0]
							wv.setStyle({
								position: 'dock',
								dock: 'right',
								bottom: '0px',
								right: '0px',
								height: '60px',
								width: '70px'
							})
						}, 1000);
					}
					// #endif
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
			this.cameraContext = uni.createCameraContext()
			// #endif

		},
		onHide() {
			this.checkCheat()
		},
		onUnload() {
			// #ifdef MP-WEIXIN
			this.innerAudioContext.destroy();
			// #endif

			// #ifdef APP

			// #endif

			if (this.paper.cheat !== null && this.paper.cheat) {
				examPaperApi.cheat(this.paper.id).then(re => {})
			}

			this.$refs.countDown.timeStop()
		},
		methods: {
			swiperChange(e) {
				let index = e.detail.current
				this.questionIndex = index
			},
			checkCheat() {
				let _this = this
				if (_this.paper.cheat !== null && _this.paper.cheat) {
					++_this.cheatCount
					examPaperApi.cheat(_this.paper.id).then(re => {}).finally(() => {
						if (_this.cheatCount > _this.paper.maxCheatCount) {
							uni.redirectTo({
								url: '/pages/paper/record'
							});
						} else if (_this.cheatCount === _this.paper.maxCheatCount) {
							_this.formSubmit()
						} else {
							uni.showToast({
								icon: 'none',
								title: `请不要离开试卷，超过${_this.paper.maxCheatCount}次会自动提交试卷！`,
								duration: 3000
							});
						}
					})
				}
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

				let answerBase64 = toBase64(JSON.stringify(cacheAnswer))
				uni.setStorageSync(this.cacheKey, answerBase64)
			},
			revertCache(answer) {
				let cacheAnswerStr = uni.getStorageSync(this.cacheKey)
				if (cacheAnswerStr !== null && cacheAnswerStr != '') {
					let cacheAnswer = JSON.parse(fromBase64(cacheAnswerStr))
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
							_this.formSubmit()
						} else if (res.cancel) {

						}
					}
				});
			},
			formSubmit() {
				let _this = this
				this.$refs['countDown'].timeStop()
				this.answer.submitDateTime = new Date()
				examPaperAnswerApi.answerSubmit(aesEncryptStr(this.answer)).then(re => {
					if (re.code === 1) {
						uni.removeStorageSync(_this.cacheKey);
						uni.showModal({
							content: `考试结果：${re.response}分`,
							showCancel: false,
							success: function(res) {
								uni.redirectTo({
									url: '/pages/record/index'
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
			cameraInit() {
				let _this = this
				this.camera.video = document.getElementsByTagName("video")[0]
				this.camera.canvas = document.getElementsByTagName("canvas")[0]
				this.camera.context = this.camera.canvas.getContext('2d')

				if (navigator.mediaDevices === undefined) {
					navigator.mediaDevices = {}
				}
				if (navigator.mediaDevices.getUserMedia === undefined) {
					navigator.mediaDevices.getUserMedia = function(constraints) {
						let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
						if (!getUserMedia) {
							return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
						}
						return new Promise(function(resolve, reject) {
							getUserMedia.call(navigator, constraints, resolve, reject)
						})
					}
				}
				let constraints = {
					video: true
				}
				navigator.mediaDevices.getUserMedia(constraints)
					.then(function(stream) {
						if ('srcObject' in _this.camera.video) {
							_this.camera.video.srcObject = stream
						} else {
							_this.camera.video.src = window.URL.createObjectURL(stream)
						}
						_this.camera.video.onloadedmetadata = function(e) {
							_this.camera.initSuccess = true
							_this.camera.video.play()
						}
					})
					// eslint-disable-next-line handle-callback-err
					.catch(function(err) {
						_this.camera.initSuccess = false
						uni.showToast({
							icon: 'none',
							title: '摄像头打开失败， 请检查权限问题'
						});
					})
			},
			monitorSubmit() {
				let answerStr = JSON.stringify(this.answer)
				let answerMonitor = JSON.parse(answerStr)
				answerMonitor.submitDateTime = new Date()
				let answerBase64 = Buffer.from(JSON.stringify(answerMonitor)).toString('base64')
				examPaperAnswerApi.monitorSubmit({
					value: answerBase64
				}).then(re => {})
			},
			captureSubmit() {
				let _this = this
				// #ifdef MP-WEIXIN
				this.cameraContext.takePhoto({
					quality: 'normal',
					success(res) {
						const tempFilePath = res.tempImagePath;
						examPaperAnswerApi.capturePicture(_this.paper.id, tempFilePath).then(data => {})
					}
				})
				// #endif

				// #ifdef H5
				if (this.camera.initSuccess) {
					this.camera.context.drawImage(this.camera.video, 0, 0, 72, 96)
					let imageBase64 = this.camera.canvas.toDataURL('image/png').substring(22)
					examPaperAnswerApi.capturePictureH5({
						paperId: this.paper.id,
						imageBase64: imageBase64
					}).then(re => {})
				}
				// #endif
			},
			timeUpdate(doTime) {
				++this.answer.doTime
				if (this.answer.doTime % 30 === 0) {
					this.monitorSubmit()
				}

				if (this.paper.capture && this.answer.doTime % 50 === 0) {
					this.captureSubmit()
				}

				if (doTime % 10 === 0) {
					this.cacheSave()
				}
			},
			timeup() {
				this.formSubmit()
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