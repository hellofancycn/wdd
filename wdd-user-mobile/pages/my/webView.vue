<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			this.url = option.url
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
</style>
