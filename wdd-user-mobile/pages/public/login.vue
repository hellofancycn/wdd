<template>
	<view class="login-contain">
		<view class="login-content">
			<view class="wrapper">
				<view class="welcome">
					<image src="../../static/logo.png" class="logo-image"></image>
					<div>煤矿常态化培训系统</div>
				</view>
				<uni-forms :value="form" ref="form" :rules="rules">
					<view class="login-input-content">
						<uni-forms-item name="userName" class="login-user-name">
							<uni-easyinput type="text" :inputBorder="false" v-model="form.userName" placeholder="请输入用户名"
								prefixIcon="user-name" prefixSize="30" />
						</uni-forms-item>
						<uni-forms-item name="password">
							<uni-easyinput type="password" :inputBorder="false" v-model="form.password"
								placeholder="请输入密码" :showPasswordSize="30" prefixIcon="password-fill" prefixSize="30"
								@confirm="login" />
						</uni-forms-item>
					</view>
					<view class="login-agree">
						<view class="agree-check" :class="agree?'agree-check-seleted':''" @click="agreeClick">
							<uni-icons color="#FFFFFF" size="28" type="checkmarkempty" />
						</view>
						<view @click="agreeClick" class="agree-text">已阅读并同意维考</view>
						<view class="agree-link" @click="urlLink('https://www.mindskip.net/policy/wk/user.html')">《用户协议》
						</view>
						和
						<view class="agree-link" @click="urlLink('https://www.mindskip.net/policy/wk/privacy.html')">
							《隐私政策》</view>
					</view>
					<button class="confirm-btn action-button" @click="login">登录</button>
				</uni-forms>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="register-section">
				<span>智慧矿山考试系统</span>
				仅供企业内部员工使用，需要提供账号密码。没有账号?
				<text @click="goToRegister" class="wdd-user-login-register">马上注册</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="register-section" style="text-align: center;">
				没有账号?
				<span @click="goToRegister" class="wdd-user-login-register">马上注册</span>
			</view>
			<!-- #endif -->
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
	import publicApi from '@/api/public'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'

	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				agree: false,
				form: {
					userName: '',
					password: '',
				},
				rules: {
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
					}
				}
			}
		},
		onLoad() {},
		methods: {
			urlLink(url) {
				uni.navigateTo({
					url: `/pages/my/webView?url=${url}`
				})
			},
			agreeClick() {
				this.agree = !this.agree
			},
			login() {
				this.$refs.form.submit().then(res => {
					if (!this.agree) {
						uni.showToast({
							icon: 'none',
							title: '请先阅读并同意协议'
						});
						return
					}
					publicApi.login(aesEncryptStr(this.form)).then(re => {
						if (re.code === 1) {
							uni.clearStorageSync();
							uni.setStorageSync(Token_Store_Key, re.response.token);
							uni.reLaunch({
								url: '/pages/index/index'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: re.message
							});
						}
					})
				}).catch(e => {})
			},
			goToRegister() {
				uni.reLaunch({
					url: '/pages/public/register'
				});
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
		height: 100%;
	}

	.login-contain {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
		height: 100%;


		.login-content {
			margin-top: -200rpx;
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
						width: 300rpx;
						height: 200rpx;
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



			.wdd-user-login-register {
				margin-left: 10rpx;
			}

			.register-section {
				width: 100%;
				font-size: $font-sm+2rpx;
				color: $font-color-base;
				margin-top: 80rpx;

				text {
					color: $font-color-spec;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
