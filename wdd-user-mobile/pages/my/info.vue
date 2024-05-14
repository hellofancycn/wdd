<template>
	<view class="user-info">
		<uni-forms :value="form" ref="form" :border="false">
			<uni-forms-item name="realName" label="姓名" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.realName" placeholder="真实姓名" />
			</uni-forms-item>
			<uni-forms-item name="sex" label="性别" :required="true">
				<view class="form-sex-item">
					<radio-group @change="radioChange">
						<label>
							<radio value="1" checked="true" v-if="form.sex === 1" style="transform:scale(0.7)"
								color="#68bfd6" />
							<radio value="1" v-else-if="form.sex !== 1" style="transform:scale(0.7)" color="#68bfd6" />
							男
						</label>
						<label>
							<radio value="2" checked="true" v-if="form.sex === 2" style="transform:scale(0.7)"
								color="#68bfd6" />
							<radio value="2" v-else-if="form.sex !== 2" style="transform:scale(0.7)" color="#68bfd6" />
							女
						</label>
					</radio-group>
				</view>
			</uni-forms-item>
			<uni-forms-item name="nation" label="民族" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.nation" placeholder="民族" />
			</uni-forms-item>
			<uni-forms-item name="birthDay" label="出生日期" :required="true">
				<uni-datetime-picker type="date" v-model="form.birthDay" return-type="string"
					class="form-birthDay-item"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="nativePlace" label="籍贯" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.nativePlace" placeholder="籍贯" />
			</uni-forms-item>
			<uni-forms-item name="health" label="健康状况" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.health" placeholder="健康状况" />
			</uni-forms-item>
			<uni-forms-item name="idCard" label="身份证号" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.idCard" placeholder="身份证号" />
			</uni-forms-item>
			<uni-forms-item name="email" label="邮箱" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.email" placeholder="邮箱" />
			</uni-forms-item>
			<uni-forms-item name="phone" label="手机号" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.phone" placeholder="手机号" />
			</uni-forms-item>
			<uni-forms-item name="jobTitle" label="工种" :required="true">
				<uni-easyinput type="text" :inputBorder="false" v-model="form.jobTitle"
					:styles="disable.jobTitle?disableStyle:enableStyle" placeholder="工作单位及职务/工种" />
			</uni-forms-item>
			<!-- <uni-forms-item name="imagePath" label="证书" :required="true">
				<view class="portrait-box" @click="chooseImage">
					<div class="path" v-if="form.path===null" />
					<image class="portrait" :src="form.path" v-else></image>
				</view>
			</uni-forms-item>
			<uni-forms-item name="birthDay" label="证书到期日期" label-width="120px" :required="true">
				<uni-datetime-picker type="date" v-model="form.birthDay" return-type="string"
					class="form-birthDay-item"></uni-datetime-picker>
			</uni-forms-item> -->
		</uni-forms>
		<view class="uni-form-item uni-column">
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="formSubmit">保存</button>
			<button class="cu-btn block bg-blue margin-tb-sm lg action-button" @click="formExport">一人一档导出</button>
		</view>

	</view>
</template>

<script>
	import userApi from '@/api/user'

	export default {
		data() {
			return {
				form: {
					realName: null,
					idCard: null,
					workNo: null,
					jobTitle: null,
					sex: null,
					birthDay: null,
					phone: null,
					createTime: null,
					imagePath: null,
					email: null,
					nation: null,
					nativePlace: null,
					health: null,
					path: null
				},
				disable: {
					realName: false,
					idCard: false,
					workNo: false,
					jobTitle: false
				},
				rules: {
					realName: {
						rules: [{
							required: true,
							errorMessage: '请输入真实姓名',
						}]
					},
					sex: {
						rules: [{
							required: true,
							errorMessage: '请选择性别',
						}]
					},
					birthDay: {
						rules: [{
							required: true,
							errorMessage: '请选择出生日期',
						}]
					},
					nativePlace: {
						rules: [{
							required: true,
							errorMessage: '请输入籍贯',
						}]
					},
					nation: {
						rules: [{
							required: true,
							errorMessage: '请输入民族',
						}]
					},
					health: {
						rules: [{
							required: true,
							errorMessage: '请输入健康状况',
						}]
					},
					idCard: {
						rules: [{
							required: true,
							errorMessage: '请输入身份证号',
						}]
					},
					email: {
						rules: [{
								required: true,
								errorMessage: '请输入邮箱',
							},
							{
								format: 'email',
								errorMessage: '请输入正确的邮箱地址',
							}
						]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请输入手机号',
						}]
					},
					jobTitle: {
						rules: [{
							required: true,
							errorMessage: '请输入工作单位及职务/工种',
						}]
					}
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
		onLoad() {
			this.load()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			disableForm() {
				if (this.form.realName !== null && this.form.realName.length > 0) {
					this.disable.realName = true
				}
				if (this.form.idCard !== null && this.form.idCard.length > 0) {
					this.disable.idCard = true
				}
				if (this.form.workNo !== null && this.form.workNo.length > 0) {
					this.disable.workNo = true
				}
				if (this.form.jobTitle !== null && this.form.jobTitle.length > 0) {
					this.disable.jobTitle = true
				}
			},
			load() {
				userApi.getCurrentUser().then(re => {
					this.form = re.response
					this.disableForm()
					console.log(re, '9900')
				}).finally(error => {
					uni.stopPullDownRefresh()
				})
			},
			onPullDownRefresh() {
				this.load()
			},
			radioChange(e) {
				this.form.sex = e.detail.value
			},
			chooseImage() {
				let _this = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0];
						userApi.changePicture(tempFilePath).then(data => {
							if (data.code === 1) {
								this.userInfo.imagePath = data.response
							} else {
								uni.showToast({
									icon: 'none',
									title: data.message
								});
							}
						})
					}
				});
			},
			formSubmit() {
				this.$refs.form.submit().then(res => {
					userApi.update(this.form).then(data => {
						if (data.code === 1) {
							uni.showModal({
								title: '提示',
								content: '个人资料修改成功',
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
			},
			formExport() {
				userApi.exportYryd(this.form.id).then(res => {
					const currentDate = new Date();
					const year = currentDate.getFullYear();
					const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
					const day = currentDate.getDate().toString().padStart(2, '0');
					const time = year + '年' + month + '月' + day + '日';
					let blob = new Blob([res], {
						type: 'application/zip;charset=utf-8'
					});
					console.log(blob)
					// 创建 href 超链接，点击进行下载
					window.URL = window.URL || window.webkitURL;
					let href = URL.createObjectURL(blob);
					let downA = document.createElement("a");
					downA.href = href;
					downA.download = '一人一档' + '-' + this.form.realName + '-' + time;
					downA.click();
					// 销毁超连接
					window.URL.revokeObjectURL(href);
				})
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

		.path {
			width: 260rpx;
			height: 150rpx;
			border: 1rpx solid #ccc;
		}

		.portrait {
			width: 260rpx;
			height: 150rpx;
			border: 1rpx solid #ccc;
		}
	}
</style>