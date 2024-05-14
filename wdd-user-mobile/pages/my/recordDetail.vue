<template>
	<view class="user-info">
		<uni-forms :value="form" ref="form" :border="false">
			<uni-forms-item name="violationTime" label="时间">
				<uni-datetime-picker type="date" v-model="form.violationTime"
					class="form-birthDay-item"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="violation" label="违规违章行为">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.violation" placeholder="违规违章行为" />
			</uni-forms-item>
			<uni-forms-item name="violationLeveliolation" label="级别">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.violationLeveliolation"
					placeholder="级别" />
			</uni-forms-item>
			<uni-forms-item name="violationResult" label="追责处理结果">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.violationResult" placeholder="追责处理结果" />
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
					violation: null,
					violationLevel: null,
					violationResult: null,
					violationTime: null,
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
			if (this.id != null) {
				this.load()
			}
		},
		methods: {
			load() {
				console.log(this.id)
				userApi.violationSelectById(this.id).then(re => {
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
						userApi.violationInsert(this.form).then(data => {
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
												url: '/pages/my/record'
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
						userApi.violationUpdate(this.form).then(data => {
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