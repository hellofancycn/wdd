<template>
	<view class="password-info">
		<uni-forms :value="form" ref="form">
			<uni-forms-item name="oldPassword">
				<view class="title"><span class="wdd-require">*</span>旧密码：</view>
				<uni-easyinput type="password" :inputBorder="false" v-model="form.oldPassword" :showPasswordSize="30" />
			</uni-forms-item>
			<uni-forms-item name="newPassword">
				<view class="title"><span class="wdd-require">*</span>新密码：</view>
				<uni-easyinput type="password" :inputBorder="false" v-model="form.newPassword" :showPasswordSize="30" />
			</uni-forms-item>
			<uni-forms-item name="confirmPassword">
				<view class="title"><span class="wdd-require">*</span>确认密码：</view>
				<uni-easyinput type="password" :inputBorder="false" v-model="form.confirmPassword"
					:showPasswordSize="30" />
			</uni-forms-item>
		</uni-forms>


		<view class="uni-form-item uni-column">
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="formSubmit">提交</button>
		</view>

	</view>
</template>

<script>
	import {
		Token_Store_Key
	} from '@/utils/common'
	import {
		aesEncryptStr
	} from '@/utils/index'
	import userApi from '@/api/user'

	export default {
		data() {
			return {
				form: {
					oldPassword: null,
					newPassword: null,
					confirmPassword: null
				},
				rules: {
					oldPassword: {
						rules: [{
								required: true,
								errorMessage: '请输入旧密码',
							},
							{
								minLength: 5,
								maxLength: 100,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					newPassword: {
						rules: [{
								required: true,
								errorMessage: '请输入新密码',
							},
							{
								minLength: 5,
								maxLength: 100,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					confirmPassword: {
						rules: [{
								required: true,
								errorMessage: '请输入确认密码',
							},
							{
								minLength: 5,
								maxLength: 100,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									let age = parseInt(value)
									if (value !== data.newPassword) {
										callback('两次密码输入不一致')
									}
									return true
								}
							}
						]
					}
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			formSubmit() {
				this.$refs.form.submit().then(res => {
					userApi.changePassword(aesEncryptStr(this.form)).then(data => {
						if (data.code === 1) {
							uni.showModal({
								title: '提示',
								content: '密码修改成功',
								showCancel: false,
								success: function(res) {
									uni.removeStorageSync(Token_Store_Key);
									uni.reLaunch({
										url: '/pages/public/login'
									})
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
	.password-info {
		padding-top: 20rpx;

		.title {
			padding: 10rpx 24rpx;
		}

		.uni-easyinput {
			background-color: #fff !important;
		}

		.form-sex-item {
			height: 72rpx;
			background-color: #FFF;
			line-height: 72rpx !important;
		}

		.form-birthDay-item {
			height: 72rpx;
			background-color: #FFF;
			line-height: 72rpx !important;
		}
	}
</style>
