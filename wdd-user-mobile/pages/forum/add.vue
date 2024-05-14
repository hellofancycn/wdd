<template>
	<view>
		<view class="container">
			<view class="wrapper">
				<uni-forms :value="form" ref="form" class="forum-content">
					<view class="forum-input-content">

						<uni-forms-item name="forumArchiveId" class="forum-bottom">
							<view class="forum-archive-item" @click="forumArchiveClick">
								<div class="forum-archive-left">分类：</div>
								<div class="forum-archive-right">{{level}}</div>
							</view>
						</uni-forms-item>


						<uni-forms-item name="title" class="forum-bottom">
							<uni-easyinput type="text" :inputBorder="false" v-model="form.title" placeholder="请输入文章标题"
								class="forum-content-item" />
						</uni-forms-item>

						<uni-forms-item name="content" class="forum-bottom">
							<uni-easyinput type="textarea" :autoHeight="true" :inputBorder="false"
								v-model="form.content" placeholder="请输入文章内容" class="forum-content-item-area" />
						</uni-forms-item>

						<view class="confirm-btn action-button" @click="forumSubmit">提交</view>
					</view>
				</uni-forms>
			</view>
			<tki-tree ref="tkitree" :range="forumArchiveList" rangeKey="name" :selectParent="true"
				@confirm="forumArchiveConfirm" title="文章分类"></tki-tree>
		</view>
	</view>
</template>

<script>
	import {
		aesEncryptStr
	} from '@/utils/index'

	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import tkiTree from '@/components/tki-tree/tki-tree.vue';
	import forumApi from '@/api/forum'

	export default {
		components: {
			uniIcons,
			tkiTree
		},
		data() {
			return {
				form: {
					forumArchiveId: null,
					title: null,
					content: null
				},
				level: '',
				forumArchiveList: [],
				rules: {
					title: {
						rules: [{
							required: true,
							errorMessage: '请输入文章标题',
						}]
					},
					content: {
						rules: [{
							required: true,
							errorMessage: '请输入文章内容'
						}]
					}
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			forumArchiveClick() {
				let _this = this
				forumApi.tree().then(re => {
					this.forumArchiveList = re.response
					_this.$refs.tkitree._show();
				})
			},
			forumArchiveConfirm(item) {
				this.form.forumArchiveId = item.id
				this.level = item.level
			},
			forumSubmit() {
				this.$refs.form.submit().then(res => {
					forumApi.add(this.form).then(re => {
						if (re.code === 1) {
							let pages = getCurrentPages()
							if (pages.length >= 2) {
								var prepage = pages[pages.length - 2]
								if (prepage.route === 'pages/forum/index') {
									prepage.$vm.refresh()
								}
								uni.navigateBack()
							}

						} else {
							uni.showToast({
								icon: 'none',
								title: re.message
							});
						}
					})
				}).catch(e => {})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #f6f6f6;
	}

	.wrapper {
		z-index: 90;
		padding-bottom: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.forum-content {
		width: 100%;
	}

	.back-btn {
		position: absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}


	.forum-input-content {

		.forum-bottom {
			padding-bottom: 20rpx !important;
		}
	}

	.confirm-btn {
		width: 100%;
		height: 80rpx;
	}


	.forum-archive-item {
		display: flex;
		flex-direction: row;
		justify-content: left;
		height: 90rpx;
		background-color: #FFFFFF !important;

		.forum-archive-left {
			width: 130rpx;
			height: 60rpx;
			font-size: 28rpx;
			color: rgb(118, 118, 118);
			margin-top: 20rpx;
			margin-left: 30rpx;
		}

		.forum-archive-right {
			height: 60rpx;
			font-size: 30rpx;
			color: #303133;
			width: 100%;
			margin-top: 20rpx;
			overflow: hidden;
		}
	}



	.forum-content-item-area {
		display: flex;
		flex-direction: row;
		justify-content: left;
		min-height: 600rpx;
		background-color: #FFFFFF !important;
		padding: 20rpx;
	}
</style>
