<template>
	<view class="uni-numbox">
		<view @click="_calcValue('minus')" class="uni-numbox__minus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }">-</text>
		</view>
		<input :disabled="disabled" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" />
		<view @click="_calcValue('plus')" class="uni-numbox__plus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }">+</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			initValue: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				this.$emit("change", newVal);
			}
		},
		created() {
			if (this.initValue) {
				this.inputValue = this.value;
			} else {
				this.inputValue = null;
			}
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value -= step;
					if (value < this.min) {
						return;
					}
					if (value > this.max) {
						value = this.max
					}
				} else if (type === "plus") {
					value += step;
					if (value > this.max) {
						return;
					}
					if (value < this.min) {
						value = this.min
					}
				}

				if (-1 !== String(value).indexOf(".")) {
					this.inputValue = String(value.toFixed(1));
				} else {
					this.inputValue = String(value);
				}

			},
			_getDecimalScale() {
				return 1;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}

				if (-1 !== String(value).indexOf(".")) {
					this.inputValue = String(value.toFixed(1));
				} else {
					this.inputValue = String(value);
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 54rpx;
	/* #ifdef APP-NVUE */
	$box-line-height: 54tpx;
	/* #endif */
	$box-line-height: 54rpx;
	$box-width: 54rpx;

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: $box-height;
		line-height: $box-height;
		width: 240rpx;
	}

	.uni-numbox__value {
		background-color: $uni-bg-color;
		width: 80rpx;
		height: $box-height;
		text-align: center;
		font-size: $uni-font-size-lg;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-left-width: 0;
		border-right-width: 0;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		// line-height: $box-line-height;
		// text-align: center;
		//font-size: 20px;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-top-left-radius: $uni-border-radius-base;
		border-bottom-left-radius: $uni-border-radius-base;
		border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		border-width: 1rpx;
		border-style: solid;
		border-color: $uni-border-color;
		border-top-right-radius: $uni-border-radius-base;
		border-bottom-right-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		border-left-width: 0;
	}

	.uni-numbox--text {
		//font-size: 40rpx;
		color: $uni-text-color;
	}

	.uni-numbox--disabled {
		color: $uni-text-color-disable;
	}
</style>
