<template>
	<view class="user-info">
		<uni-forms :value="form" ref="form" :border="false">
			<uni-forms-item name="violationTime" label="培训时间">
				<uni-datetime-picker type="date" v-model="form.trainBeginTime"
					class="form-birthDay-item"></uni-datetime-picker>
				<uni-datetime-picker type="date" v-model="form.trainEndTime"
					class="form-birthDay-item"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="trainClassname" label="培训班(内容)">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.trainClassname" placeholder="培训班(内容)" />
			</uni-forms-item>
			<uni-forms-item name="trainUnit" label="培训单位">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.trainUnit" placeholder="培训单位" />
			</uni-forms-item>
			<uni-forms-item name="classHour" label="学时">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.classHour" placeholder="学时" />
			</uni-forms-item>
			<uni-forms-item name="checkResult" label="考核结果">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.checkResult" placeholder="考核结果" />
			</uni-forms-item>
			<uni-forms-item name="note" label="备注">
				<uni-easyinput type="textarea" :inputBorder="false" v-model="form.note" placeholder="备注" />
			</uni-forms-item>
		</uni-forms>


		<view class="uni-form-item uni-column">
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="formSubmit">保存</button>
		</view>

	</view>
</template>

<script>
	import userApi from '@/api/user'

	export default {
		data() {
			return {
				id: '',
				form: {
					trainClassname:null,
					trainBeginTime: null,
					trainEndTime: null,
					checkResult: null,
					classHour: null,
					trainUnit: null,
					note: null,
				},
				enableStyle: {
					color: '#333',
					disableColor: '#eee',
					borderColor: '#e5e5e5'
				},
				disableStyle: {
					color: '#9b9b9b',
					disableColor: 'transparent',
				}
			}
		},
		onLoad(option) {
			console.log(option)
			this.id = option.id
			if (this.id  != null) {
				this.load()
			}
		},
		methods: {
			load() {
				console.log(this.id)
				userApi.extenSelectById(this.id).then(re => {
					this.form = re.response
					console.log(re)
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			onPullDownRefresh() {
				this.load()
			},
			formSubmit() {
				if (this.id == null) {
					this.$refs.form.submit().then(res => {
						userApi.extenInsert(this.form).then(data => {
							console.log(this.form,'数据')
							if (data.code === 1) {
								uni.showModal({
									title: '提示',
									content: '添加成功',
									showCancel: false,
									success: function(res) {
										let pages = getCurrentPages()
										if (pages.length >= 2) {
											var prepage = pages[pages.length - 2]
											if (prepage.route === 'pages/my/index') {
												prepage.$vm.load()
											}
											uni.redirectTo({
												url: '/pages/my/examine'
											})
										}
									}
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}).catch(e => {})
				} else {
					this.$refs.form.submit().then(res => {
						console.log(this.form)
						userApi.extenUpdate(this.form).then(data => {
							if (data.code === 1) {
								uni.showModal({
									title: '提示',
									content: '修改成功',
									showCancel: false,
									success: function(res) {
										let pages = getCurrentPages()
										if (pages.length >= 2) {
											var prepage = pages[pages.length - 2]
											if (prepage.route === 'pages/my/index') {
												prepage.$vm.load()
											}
											uni.navigateBack()
										}
									}
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}).catch(e => {})

				}
			}
		}

	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.user-info {
		padding: 20rpx;


		.title {
			padding: 10rpx 24rpx;
		}

		.form-sex-item {
			height: 72rpx;
			line-height: 72rpx !important;
		}

		.form-birthDay-item {
			height: 72rpx;
			line-height: 72rpx !important;
		}
	}
</style>