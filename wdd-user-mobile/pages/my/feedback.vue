<template>
	<view class="feedback-info">
		<uni-forms :value="form" ref="form" :rules="rules">
			<uni-forms-item name="contact">
				<view class="title"><span class="wdd-require">*</span>联系方式：</view>
				<uni-easyinput type="text" :inputBorder="false" v-model="form.contact" />
			</uni-forms-item>
			<uni-forms-item name="content">
				<view class="title"><span class="wdd-require">*</span>意见内容</view>
				<uni-easyinput type="textarea" :inputBorder="false" v-model="form.content" />
			</uni-forms-item>
			<uni-forms-item>
				<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="formSubmit">提交反馈</button>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
	import userApi from '@/api/user'
	export default {
		data() {
			return {
				form: {
					contact: null,
					content: null
				},
				rules: {
					contact: {
						rules: [{
							required: true,
							errorMessage: '请输入联系方式',
						}]
					},
					content: {
						rules: [{
							required: true,
							errorMessage: '请输入意见反馈内容',
						}]
					}
				}
			}
		},
		methods: {
			formSubmit() {
				this.$refs.form.submit().then(res => {
					userApi.feedback(this.form).then(data => {
						if (data.code === 1) {
							uni.showModal({
								title: '提示',
								content: '意见反馈提交成功',
								showCancel: false,
								success: function(res) {
									uni.navigateBack()
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
</script>

<style lang="scss">
	.feedback-info {
		padding-top: 20rpx;

		.title {
			padding: 10rpx 24rpx;
		}

		.uni-easyinput {
			background-color: #fff !important;
		}

	}
</style>
