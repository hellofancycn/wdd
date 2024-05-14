<template>
	<!-- #ifdef MP-WEIXIN -->
	<uParse :content="content" />
	<!-- #endif -->

	<!-- #ifdef H5 -->
	<view v-html="content" />
	<!-- #endif -->
	
	<!-- #ifdef APP-PLUS -->
	<view v-html="content" />
	<!-- #endif -->
</template>

<script>
	import uParse from '@/components/uParse/wxParse.vue'

	export default {
		name: 'renderHtml',
		components: {
			uParse
		},
		props: {
			content: {
				type: String,
				default: '',
			}
		}
	}
</script>

<style>

</style>
