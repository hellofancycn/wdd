<template>
	<view class="container">
		<view class="wdd-tab-menu-head">
			<view class="wdd-tab-menu">
				<view class="wdd-tab-menu-item" :class="1 == queryParam.paperType?'wdd-tab-menu-item-select':''"
					@click="tabSelect" :data-id="1">
					<view>
						正考
					</view>
					<view class="wdd-tab-menu-item-border"></view>
				</view>
				<view class="wdd-tab-menu-item" :class="3 == queryParam.paperType?'wdd-tab-menu-item-select':''"
					@click="tabSelect" :data-id="3">
					<view>练习</view>
					<view class="wdd-tab-menu-item-border"></view>
				</view>
				<view class="wdd-tab-menu-item" :class="4 == queryParam.paperType?'wdd-tab-menu-item-select':''"
					@click="tabSelect" :data-id="4">
					<view>逢查必考</view>
					<view class="wdd-tab-menu-item-border"></view>
				</view>
			</view>
		</view>
		<view v-if="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="no-card paper-content">
			<view class="wdd-card-list" v-if="queryParam.paperType  == 1">
				<view class="wdd-card-item" v-for="(paperItem,index) in tableData" :key="paperItem.id"
					@click="paperClick(paperItem)">
					<view class="paper-name">
						<view class="text-cut">{{paperItem.name}}</view>
					</view>
					<view class="paper-time">
						<view class="wdd-font-des">
							考试时长：
						</view>
						<view class="suggest-time suggest-time-padding">{{paperItem.suggestTimeStr}}</view>
					</view>
					<view>
						<view class="wdd-font-des"><span>考试开始时间：{{paperItem.limitStartTime}}</span></view>
					</view>
					<view>
						<view class="wdd-font-des"><span>考试结束时间：{{paperItem.limitEndTime}}</span></view>
					</view>
					<view>
						<view class="wdd-font-des">
							<span>题目数量：{{paperItem.questionCount}}</span>
							<span>合格分：{{paperItem.passScore}}</span>
							<span>试卷总分：{{paperItem.score}}</span>
						</view>
					</view>
				</view>
				<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
			</view>
			<view class="wdd-card-list" v-if="queryParam.paperType  == 3">
				<view class="wdd-card-item" v-for="(paperItem,index) in tableData" :key="paperItem.id"
					@click="paperClick(paperItem)">
					<view class="paper-name">
						<view class="text-cut">{{paperItem.name}}</view>
					</view>
					<view>
						<view class="wdd-font-des">
							<span>题目数量：{{paperItem.questionCount}}</span>
						</view>
					</view>
				</view>
				<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
			</view>
			<view class="wdd-card-list" v-if="queryParam.paperType  == 4">
				<view class="wdd-card-item" v-for="(paperItem,index) in tableData" :key="paperItem.id"
					@click="paperPopup(paperItem)">
					<view class="paper-name">
						<view class="text-cut">{{paperItem.name}}</view>
					</view>
					<view class="paper-time">
						<view class="wdd-font-des">
							考试时长：
						</view>
						<view class="suggest-time suggest-time-padding">{{paperItem.suggestTimeStr}}</view>
					</view>
					<view>
						<view class="wdd-font-des"><span>考试开始时间：{{paperItem.limitStartTime}}</span></view>
					</view>
					<view>
						<view class="wdd-font-des"><span>考试结束时间：{{paperItem.limitEndTime}}</span></view>
					</view>
					<view>
						<view class="wdd-font-des">
							<span>题目数量：{{paperItem.questionCount}}</span>
							<span>合格分：{{paperItem.passScore}}</span>
							<span>试卷总分：{{paperItem.score}}</span>
						</view>
					</view>
				</view>
				<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
			</view>
		</view>
		<!-- 逢查必考口令验证 -->
		<uni-popup ref="inputDialog" type="dialog" style="width: 200px;">
			<view style=" background-color: #F9F9F9;height: 150px;border-radius: 10px;">
				<h2 style="margin:10px 0 20px 120px;">考试口令</h2>
				<view class="box" style="width: 326px;padding: 20px;">
					<uni-easyinput class="bold-item" v-model="form.secret" type="text" style="width:90%"
						placeholder="请输入考试口令" />
				</view>
				<button style="height: 40px;" @click="dialogInputConfirm">确认</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
	import examPaperApi from '@/api/examPaper'
	import practiceApi from '@/api/practice'

	export default {
		components: {
			uniIcons,
			uniLoadMore,
			uniPopup,
			uniPopupDialog
		},
		data() {
			return {
				queryParam: {
					paperType: 1,
					pageIndex: 1,
					pageSize: 10
				},
				tableData: [],
				total: 0,
				more: null,
				noneShow: false,
				form: {
					secret: '',
					id: '',
				},
				item: '',
			}
		},
		onLoad() {
			this.search(true)
		},
		methods: {
			tabSelect(e) {
				this.more = null
				this.queryParam.paperType = e.currentTarget.dataset.id
				this.search(true)
			},
			paperClick(item) {
				let _this = this
				// #ifdef APP-PLUS
				let type = uni.getSystemInfoSync().platform
				if (type === 'android') {
					plus.android.requestPermissions(['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
						resultObj => {
							_this.urlLink(item)
						})
				} else {
					_this.urlLink(item)
				}
				// #endif
				// #ifndef APP-PLUS
				_this.urlLink(item)
				// #endif
			},
			paperPopup(item) {
				console.log(item)
				this.item = item
				this.form.id = item.id
				this.$refs.inputDialog.open()
			},
			urlLink(item) {
				if (this.queryParam.paperType === 3) { //模拟练习
					if (item.buildType === 3) { //随机试卷，需要生成新试卷
						practiceApi.random(item.id).then(re => {
							if (re.code === 1) {
								uni.navigateTo({
									url: `/pages/practice/do?id=${re.response}`
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: re.message
								});
							}
						})
					} else {
						uni.navigateTo({
							url: `/pages/practice/do?id=${item.practiceExamPaperId}`
						})
					}
				} else {
					if (item.faceCheck) {
						uni.redirectTo({
							url: `/pages/exam/verify?id=${item.id}&type=${this.queryParam.paperType}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/exam/do?id=${item.id}&type=${this.queryParam.paperType}`
						})
					}
				}
			},
			search(override) {
				if (override) {
					this.queryParam.pageIndex = 1
				}
				let page;
				if (this.queryParam.paperType === 3) { //模拟练习
					page = practiceApi.page
				} else {
					page = examPaperApi.page
				}
				page(this.queryParam).then(res => {
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
			},
			dialogInputConfirm() {
				this.$refs.inputDialog.close()
				// 关闭窗口后，恢复默认内容
				console.log(this.secret)
				practiceApi.checkCodes(this.form).then(re => {
					console.log(re, '口令')
					if (re.code == 1) {
						let _this = this
						// #ifdef APP-PLUS
						let type = uni.getSystemInfoSync().platform
						if (type === 'android') {
							plus.android.requestPermissions(['android.permission.CAMERA',
									'android.permission.RECORD_AUDIO'
								],
								resultObj => {
									_this.urlLink(this.item)
								})
						} else {
							_this.urlLink(this.item)
						}
						// #endif

						// #ifndef APP-PLUS
						_this.urlLink(this.item)
						// #endif
					} else {
						uni.showToast({
							title: re.message,
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>


<style lang="scss">
	.paper-content {
		padding-top: 0rpx;

		.wdd-card-list {
			.wdd-card-item {
				.paper-time {
					display: flex;
					align-items: center;
				}

				.wdd-font-des span {
					margin-right: 50rpx;
				}
			}
		}
	}
</style>