<template>
	<view class="register-contain">
		<view class="register-content">
			<view class="wrapper">
				<!-- <view class="welcome">
					<image src="../../static/logo.png" class="logo-image"></image>
				</view> -->
				<uni-forms :value="form" ref="form" :rules="rules">
					<view class="register-input-content">

						<uni-forms-item name="departmentId" ref="departmentFormItem">
							<view class="department-item" @click="departmentClick">
								<div class="department-left">
									<uni-icons color="#c0c4cc" size="30" type="department" />
								</div>
								<div class="department-right" :class="departmentSelect?'department-select':''">{{level}}
								</div>
							</view>
						</uni-forms-item>

						<uni-forms-item name="userName">
							<uni-easyinput type="text" :inputBorder="false" v-model="form.userName" placeholder="请输入用户名"
								prefixIcon="user-name" prefixSize="30" />
						</uni-forms-item>

						<uni-forms-item name="realName">
							<uni-easyinput type="text" :inputBorder="false" v-model="form.realName"
								placeholder="请输入真实姓名" prefixIcon="real-name" prefixSize="30" />
						</uni-forms-item>

						<uni-forms-item name="password">
							<uni-easyinput type="password" :inputBorder="false" v-model="form.password"
								placeholder="请输入密码" :showPasswordSize="30" prefixIcon="password-fill" prefixSize="30" />
						</uni-forms-item>

						<uni-forms-item name="confirmPassword">
							<uni-easyinput type="password" :inputBorder="false" v-model="form.confirmPassword"
								placeholder="请输入确认密码" :showPasswordSize="30" prefixIcon="pass-confirm"
								prefixSize="30" />
						</uni-forms-item>
						<view class="login-agree">
							<view class="agree-check" :class="agree?'agree-check-seleted':''" @click="agreeClick">
								<uni-icons color="#FFFFFF" size="28" type="checkmarkempty" />
							</view>
							<view @click="agreeClick" class="agree-text">已阅读并同意维考</view>
							<view class="agree-link" @click="urlLink('https://www.mindskip.net/policy/wk/user.html')">
								《用户协议》
							</view>
							和
							<view class="agree-link"
								@click="urlLink('https://www.mindskip.net/policy/wk/privacy.html')">
								《隐私政策》</view>
						</view>
					</view>
					<button class="confirm-btn action-button" @click="register">注册</button>
				</uni-forms>
			</view>
			<view class="register-section">
				已有账号?
				<text @click="goToLogin" class="wdd-user-login-register">马上登录</text>
			</view>
			<tki-tree ref="tkitree" :range="departmentList" rangeKey="name" :selectParent="true"
				@confirm="departmentConfirm" title="部门">
			</tki-tree>
		</view>
	</view>
</template>

<script>
	import {
		aesEncryptStr
	} from '@/utils/index'

	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import tkiTree from '@/components/tki-tree/tki-tree.vue';
	import publicApi from '@/api/public'

	export default {
		components: {
			uniIcons,
			tkiTree
		},
		data() {
			return {
				form: {
					departmentId: null,
					userName: '',
					realName: '',
					password: '',
					confirmPassword: '',
					agree: true
				},
				level: '请选择部门 ',
				departmentList: [],
				departmentSelect: false,
				agree: false,
				rules: {
					departmentId: {
						rules: [{
							required: true,
							errorMessage: '请选择部门'
						}]
					},
					userName: {
						rules: [{
								required: true,
								errorMessage: '请输入用户名',
							},
							{
								pattern: '^[A-Za-z0-9]{5,24}$',
								errorMessage: '用户名由5位以上字母和数字组成',
							}
						]
					},
					realName: {
						rules: [{
							required: true,
							errorMessage: '请输入真实姓名'
						}]
					},
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 5,
								maxLength: 100,
								errorMessage: '密码长度在5个字符之上',
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
								errorMessage: '确认密码长度在5个字符之上',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value !== data.password) {
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
		onLoad() {

		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			urlLink(url) {
				uni.navigateTo({
					url: `/pages/my/webView?url=${url}`
				})
			},
			agreeClick() {
				this.agree = !this.agree
			},
			departmentClick() {
				let _this = this
				publicApi.tree().then(re => {
					this.departmentList = re.response
					_this.$refs.tkitree._show();
				})
			},
			departmentConfirm(item) {
				this.form.departmentId = item.id
				this.level = item.level
				this.departmentSelect = true
				this.$refs.departmentFormItem.errMsg = ''
			},
			register() {
				this.$refs.form.submit().then(res => {
					if (!this.agree) {
						uni.showToast({
							icon: 'none',
							title: '请先阅读并同意协议'
						});
						return
					}
					publicApi.register(aesEncryptStr(this.form)).then(re => {
						if (re.code === 1) {
							this.goToLogin()
						} else {
							uni.showToast({
								icon: 'none',
								title: re.message
							});
						}
					})
				}).catch(e => {})
			},
			goToLogin() {
				uni.reLaunch({
					url: '/pages/public/login'
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
		height: 100%;
	}


	.register-contain {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
		height: 100%;
	}


	.register-content {
		width: 90%;

		.wrapper {

			width: 100%;

			.welcome {
				font-size: 46rpx;
				color: #555;
				text-shadow: 2rpx 0rpx 2rpx rgba(0, 0, 0, .3);
				text-align: center;
				margin-bottom: 80rpx;


				.logo-image {
					width: 400rpx;
					height: 100rpx;
				}
			}


			.login-agree {

				margin-top: 36rpx;
				color: #646464;
				font-size: 22rpx;
				display: flex;
				align-items: center;

				.agree-check {
					margin-right: 10rpx;
					width: 32rpx;
					height: 32rpx;
					border-radius: 50rpx;
					border: 2rpx solid #68bfd6;
					color: #68bfd6;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.agree-check-seleted {
					background-color: #68bfd6;
					color: #FFFFFF;
				}


				.agree-link {
					font-size: 22rpx;
					display: inline;
					color: #333333;
				}
			}


			.confirm-btn {
				margin-top: 30rpx;
				padding: 0rpx !important;
				width: 100%;
				height: 76rpx;
				line-height: 76rpx;
				background: $uni-color-primary;
				color: #ffffff;
				font-size: 30rpx;
			}
		}
	}






	.register-section {
		width: 100%;
		font-size: $font-sm+2rpx;
		color: $font-color-base;
		text-align: center;
		margin-top: 80rpx;

		text {
			color: $font-color-spec;
			margin-left: 10rpx;
		}
	}



	.department-item {
		display: flex;
		flex-direction: row;
		justify-content: left;



		.department-left {
			width: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.department-right {
			font-size: 28rpx;
			color: grey;
			width: 100%;
			overflow: hidden;
			padding-left: 0rpx;
		}

		.department-select {
			color: #333333;
		}
	}
</style>
