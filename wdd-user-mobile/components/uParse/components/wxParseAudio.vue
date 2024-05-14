<template>
	<!--增加audio标签支持-->
	<!-- #ifdef H5 -->
	<audio :id="node.attr.id" :class="node.classStr" :style="node.styleStr" :src="node.attr.src" :loop="node.attr.loop"
	 :poster="node.attr.poster" :name="node.attr.name" :author="node.attr.author" controls></audio>
	<!-- #endif -->

	<!-- #ifdef APP-PLUS -->
	<audio :id="node.attr.id" :class="node.classStr" :style="node.styleStr" :src="node.attr.src" :loop="node.attr.loop"
	 :poster="node.attr.poster" :name="node.attr.name" :author="node.attr.author" controls></audio>
	<!-- #endif -->
	
	<!-- #ifdef MP-WEIXIN -->
	<view>
		<image src="/static/audio/play.png" @click="audioClick(node)" v-if="pauseShow" class="audio-image"></image>
		<image src="/static/audio/pause.png" @click="audioClick(node)" v-if="!pauseShow" class="audio-image"></image>
	</view>
	<!-- #endif -->
</template>


<script>
	export default {
		name: 'wxParseAudio',
		props: {
			node: {
				type: Object,
				default () {
					return {};
				},
			},
		},
		data() {
			return {
				pauseShow: false
			}
		},
		methods: {
			audioClick(node) {

				let src = node.attr.src
				let innerAudioContext = this.$root.$data.innerAudioContext
				let audioSrc = innerAudioContext.src
				if (audioSrc === '') {
					innerAudioContext.src = src
					innerAudioContext.play();
					innerAudioContext.playing = true
					this.pauseShow = true
				} else if (audioSrc === src) {
					if (innerAudioContext.playing) {
						innerAudioContext.pause();
						innerAudioContext.playing = false
						this.pauseShow = false
					} else {
						innerAudioContext.play();
						innerAudioContext.playing = true
						this.pauseShow = true
					}
				} else {
					//清理掉其他音频状态
					this.selectAudio(this.$root)
					innerAudioContext.src = src
					innerAudioContext.play();
					innerAudioContext.playing = true
					this.pauseShow = true
				}
			},
			selectAudio(element) {
				if (element.$options.name === 'wxParseAudio') {
					element.pauseShow = false
				}
				let children = element.$children
				if (children.length > 0) {
					for (let i = 0; i < children.length; i++) {
						this.selectAudio(children[i])
					}
				}
			}
		}
	};
</script>
