<template>
	<view class="container">
		<!-- <view>
			<view class="inputBox">
				<input type="text" class="input" v-model="keyword" placeholder="输入培训班（内容）查找" />
				<image src="../../static/search.png" class="searchIcon"></image>
				<button class="search-btn" @click="search">搜索</button>
			</view>
		</view> -->
		<button @click="addRecord" class="cu-btn block bg-blue margin-tb-sm lg action-button">添加</button>
		<view v-if="noneShow" class="none-contain">
			<image src="../../static/none.png" class="none-image"></image>
			<view class="none-text">
				暂无内容
			</view>
		</view>
		<view class="content">
			<ul>
				<li v-for="(item,index) in tableData" :key="index">
					<view class="classifyBox">
						{{item.violation}}
					</view>
					<button class="delete" @click="deleteExamine(item.id)">删除</button>
					<image src="../../static/right.png" mode="" @click="gotexamineDetail(item.id)"></image>
				</li>
			</ul>
			<uni-load-more :status="more" v-if="!noneShow"></uni-load-more>
		</view>

	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniForms from '@/components/uni-forms/uni-forms.vue'
	import uniFormsItem from '@/components/uni-forms-item/uni-forms-item.vue'
	import userApi from '@/api/user'
	import {
		Token_Store_Key,
		Copyright
	} from '@/utils/common'

	export default {
		components: {
			uniForms,
			uniPopup,
			uniFormsItem
		},
		data() {
			return {
				queryParam: {
					pageIndex: 1,
					pageSize: 10
					// trainClassname: null
				},
				tableData: [],
				total: 0,
				keyword: '',
				searchResult: [],
				more: null,
				noneShow: false,
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			load() {
				userApi.violationList(this.queryParam).then(res => {
					console.log(res)
					const re = res.response
					this.queryParam.pageIndex = re.pageNum
					this.tableData = this.tableData.concat(re.list)
					this.total = re.total
					this.noneShow = this.total === 0
				})
			},
			loading() {
				userApi.violationList(this.queryParam).then(res => {
					console.log(res)
					this.tableData = res.response.list
				})
			},
			onReachBottom() {
				this.more = 'loading'
				if (this.tableData.length < this.total) {
					++this.queryParam.pageIndex
					this.load()
				} else {
					this.more = 'noMore'
				}
			},
			gotexamineDetail(id) {
				console.log(id)
				uni.navigateTo({
					url: '/pages/my/recordDetail?id=' + id
				})
			},
			addRecord() {
				uni.redirectTo({
					url: '/pages/my/recordDetail'
				})
			},
			deleteExamine(item) {
				console.log(item)
				userApi.violationDelete(item).then(res => {
					console.log(res)
					if (res.code == 1) {
						uni.showToast({
							title: '删除成功',
							icon: 'success',
						})
						this.loading()
					}
				})
			}
		}
	}
</script>
<style lang='scss'>
	.container {
		background-color: #fff;
	}

	.inputBox {
		display: flex;
		padding: 0 10rpx 0 10rpx;
	}

	.input {
		display: inline-block;
		width: 76%;
		height: 70rpx;
		margin: 0 20rpx 0 30rpx;
		opacity: 1;
		font-size: 28rpx;
		margin-top: 10px;
		background: rgba(255, 255, 255, 1);
		padding-left: 40px;
		border: 2rpx solid rgb(130, 100, 20);
		border-radius: 10rpx;
		box-sizing: border-box;
		position: relative;
	}

	.search-btn {
		font-size: 30rpx;
		background-color: #fff;
		height: 80rpx;
		margin-top: 15rpx;
		display: inline-block;
	}

	.searchIcon {
		position: absolute;
		left: 30px;
		top: 30rpx;
		width: 50rpx;
		height: 50rpx;
		opacity: 1;
	}

	.content {
		ul {
			list-style: none;

			li {
				padding: 40rpx 0 30px 0;
				position: relative;

				.classifyBox {
					width: 200px;
					font-size: 30rpx;
					font-weight: 500;
					letter-spacing: 0rpx;
					line-height: 40rpx;
					text-overflow: ellipsis;
					/* 溢出显示省略号 */
					overflow: hidden;
					/* 溢出隐藏 */
					white-space: nowrap;
				}

				image {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: 40rpx;
					right: 30rpx;
					vertical-align: middle;

				}

				.delete {
					font-size: 11px;
					color: #fff;
					width: 50px;
					height: 25px;
					line-height: 25px;
					background-color: red;
					position: absolute;
					top: 40rpx;
					right: 100rpx;
					vertical-align: middle;

				}
			}
		}
	}
</style>