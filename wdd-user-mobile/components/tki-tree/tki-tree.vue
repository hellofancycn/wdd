<template xlang="wxml">
	<view class="tki-tree">
		<view class="tki-tree-mask" :class="{'show':showTree}" @tap="_cancel"></view>
		<view class="tki-tree-cnt" :class="{'show':showTree}">
			<view class="tki-tree-bar">
				<view class="tki-tree-bar-cancel" :style="{'color':cancelColor}" hover-class="hover-c">{{title}}</view>
			</view>
			<view class="tki-tree-view">
				<scroll-view class="tki-tree-view-sc" :scroll-y="true">
					<block v-for="(item, index) in treeList" :key="index">
						<view class="tki-tree-item" :style="[{
							paddingLeft: item.rank*15 + 'px',
							zIndex: item.rank*-1 +50
						}]" :class="{
							border: border === true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild,
							open: item.open,
						}">
							<view class="tki-tree-label">
								<uni-icons color="#333333" size="30" type="tree-up"
									v-if="!item.lastRank&&item.showChild" class="tree-icon"
									@tap="_treeItemTap(item, index)" />
								<uni-icons color="#333333" size="30" type="tree-down"
									v-if="!item.lastRank&&!item.showChild" class="tree-icon"
									@tap="_treeItemTap(item, index)" />
								<view @tap="selectTap(item, index)" class="tki-tree-label-name">{{item.name}}</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		components: {
			uniIcons
		},
		name: "tki-tree",
		props: {
			range: {
				type: Array,
				default: function() {
					return []
				}
			},
			idKey: {
				type: String,
				default: 'id'
			},
			rangeKey: {
				type: String,
				default: 'label'
			},
			title: {
				type: String,
				default: ''
			},
			multiple: { // 是否可以多选
				type: Boolean,
				default: false
				// default: true
			},
			selectParent: { //是否可以选父级
				type: Boolean,
				default: false
			},
			foldAll: { //折叠时关闭所有已经打开的子集，再次打开时需要一级一级打开
				type: Boolean,
				default: false
			},
			confirmColor: { // 确定按钮颜色
				type: String,
				default: '' // #07bb07
			},
			cancelColor: { // 取消按钮颜色
				type: String,
				default: '' // #757575
			},
			titleColor: { // 标题颜色
				type: String,
				default: '' // #757575
			},
			lastIcon: { // 没有子集的ic
				type: String,
				default: ''
			},
			border: { // 是否有分割线
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				showTree: false,
				treeList: [],
				selectIndex: -1,
			}
		},
		computed: {},
		methods: {
			_show() {
				this.showTree = true
			},
			_hide() {
				this.showTree = false
			},
			_cancel() {
				this._hide()
				this.$emit("cancel", '');
			},
			_confirm() {
				// 处理所选数据
				let rt = [],
					obj = {};
				this.treeList.forEach((v, i) => {
					if (this.treeList[i].checked) {
						obj = {}
						obj.parents = this.treeList[i].parents
						obj = Object.assign(obj, this.treeList[i].source)
						// 移除子元素
						delete obj.child
						rt.push(obj)
					}
				})
				this._hide()
				this.$emit("confirm", rt);
			},
			//扁平化树结构
			_renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
				list.forEach(item => {
					this.treeList.push({
						id: item[this.idKey],
						name: item[this.rangeKey],
						source: item,
						parentId, // 父级id数组
						parents, // 父级id数组
						rank, // 层级
						showChild: true, //子级是否显示
						open: true, //是否打开
						show: true, // 自身是否显示
						hideArr: [],
						orChecked: item.checked ? item.checked : false,
						checked: item.checked ? item.checked : false,
						level: item.level
					})
					if (Array.isArray(item.child) && item.child.length > 0) {
						// console.log(item)
						let parentid = [...parentId],
							parentArr = [...parents],
							childid = [...childid];
						delete parentArr.child
						parentid.push(item[this.idKey]);
						parentArr.push({
							[this.idKey]: item[this.idKey],
							[this.rangeKey]: item[this.rangeKey]
						})
						this._renderTreeList(item.child, rank + 1, parentid, parentArr);
					} else {
						this.treeList[this.treeList.length - 1].lastRank = true;
					}
				})
				// console.log(list)
			},
			// 处理默认选择
			_defaultSelect() {
				this.treeList.forEach((v, i) => {
					if (v.checked) {
						this.treeList.forEach((v2, i2) => {
							if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
								v2.show = true
								if (v.parentId.includes(v2.id)) {
									v2.showChild = true;
									v2.open = true;
								}
							}
						})
					}
				})
			},
			selectTap(item, index) {
				this._hide()
				this.$emit("confirm", this.treeList[index]);
				return;
			},
			// 点击
			_treeItemTap(item, index) {
				if (item.lastRank === true) {
					this._hide()
					this.$emit("confirm", this.treeList[index]);
					return;
				}
				let list = this.treeList;
				let id = item.id;
				item.showChild = !item.showChild;
				item.open = item.showChild ? true : !item.open;
				list.forEach((childItem, i) => {
					if (item.showChild === false) {
						//隐藏所有子级
						if (!childItem.parentId.includes(id)) {
							return;
						}
						if (!this.foldAll) {
							if (childItem.lastRank !== true && !childItem.open) {
								childItem.showChild = false;
							}
							// 为隐藏的内容添加一个标记
							if (childItem.show) {
								childItem.hideArr[item.rank] = id
							}
						} else {
							if (childItem.lastRank !== true) {
								childItem.showChild = false;
							}
						}
						childItem.show = false;
					} else {
						// 打开子集
						if (childItem.parentId[childItem.parentId.length - 1] === id) {
							childItem.show = true;
						}
						// 打开被隐藏的子集
						if (childItem.parentId.includes(id) && !this.foldAll) {
							// console.log(childItem.hideArr)
							if (childItem.hideArr[item.rank] === id) {
								childItem.show = true;
								if (childItem.open && childItem.showChild) {
									childItem.showChild = true
								} else {
									childItem.showChild = false
								}
								childItem.hideArr[item.rank] = null
							}
							// console.log(childItem.hideArr)
						}
					}
				})
				// console.log(this.treeList)
			},
			_treeItemSelect(item, index) {
				this._hide()
				this.$emit("confirm", this.treeList[index]);
			},
			// 处理单选多选
			_fixMultiple(index) {
				if (!this.multiple) {
					// 如果是单选
					this.treeList.forEach((v, i) => {
						if (i != index) {
							this.treeList[i].checked = false
						} else {
							this.treeList[i].checked = true
						}
					})
				}
			},
			// 重置数据
			_reTreeList() {
				this.treeList.forEach((v, i) => {
					this.treeList[i].checked = v.orChecked
				})
			},
			_initTree(range = this.range) {
				this.treeList = [];
				this._renderTreeList(range);
				this.$nextTick(() => {
					this._defaultSelect(range)
				})
			}
		},
		watch: {
			range(list) {
				this._initTree(list);
			},
			multiple() {
				if (this.range.length) {
					this._reTreeList();
				}
			},
			selectParent() {
				if (this.range.length) {
					this._reTreeList();
				}
			},
		},
		mounted() {
			this._initTree();
		}
	}
</script>

<style lang="scss" scoped>
	.tki-tree-mask {
		position: fixed;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 9998;
		background-color: rgba(0, 0, 0, 0.6);
		opacity: 0;
		transition: all 0.3s ease;
		visibility: hidden;
	}

	.tki-tree-mask.show {
		visibility: visible;
		opacity: 1;
	}

	.tki-tree-cnt {
		position: fixed;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 9999;
		top: 160rpx;
		transition: all 0.3s ease;
		transform: translateY(100%);
	}

	.tki-tree-cnt.show {
		transform: translateY(0);
	}

	.tki-tree-bar {
		background-color: #fff;
		height: 72rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		border-bottom-width: 1rpx !important;
		border-bottom-style: solid;
		border-bottom-color: #f5f5f5;
		font-size: 32rpx;
		color: #757575;
		line-height: 1;
	}

	.tki-tree-bar-confirm {
		color: #07bb07;
	}

	.tki-tree-view {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		top: 72rpx;
		background-color: #fff;
		padding-top: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 20rpx;
	}

	.tki-tree-view-sc {
		height: 100%;
		overflow: hidden;
	}

	.tki-tree-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		color: #757575;
		line-height: 1;
		height: 0;
		opacity: 0;
		transition: 0.2s;
		position: relative;
		overflow: hidden;
	}


	.tki-tree-item.show {
		height: 70rpx;
		opacity: 1;
	}


	.tki-tree-item.showchild:before {
		transform: rotate(90deg);
	}

	.tki-tree-item.last:before {
		opacity: 0;
	}

	.tki-tree-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 16rpx;
	}

	.tki-tree-label {
		flex: 1;
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1.2;
	}

	.tki-tree-label-name {
		width: 100%;
	}

	.tki-tree-check {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tki-tree-check-yes,
	.tki-tree-check-no {
		width: 40rpx;
		height: 40rpx;
		border-top-left-radius: 20%;
		border-top-right-radius: 20%;
		border-bottom-right-radius: 20%;
		border-bottom-left-radius: 20%;
		border-top-width: 1rpx;
		border-left-width: 1rpx;
		border-bottom-width: 1rpx;
		border-right-width: 1rpx;
		border-style: solid;
		border-color: #07bb07;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}

	.tki-tree-check-yes-b {
		width: 24rpx;
		height: 24rpx;
		border-top-left-radius: 20%;
		border-top-right-radius: 20%;
		border-bottom-right-radius: 20%;
		border-bottom-left-radius: 20%;
		background-color: #07bb07;
	}

	.tki-tree-check .radio {
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		border-bottom-left-radius: 50%;
	}

	.tki-tree-check .radio .tki-tree-check-yes-b {
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		border-bottom-left-radius: 50%;
	}

	.hover-c {
		opacity: 0.6;
	}


	.tree-icon {
		margin: 0 6rpx;
	}

	.tag-rate {
		.uni-rate {
			padding-top: 8rpx !important;
		}
	}
</style>
