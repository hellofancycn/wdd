export default {
	data() {
		return {
			share: {
				title: '',
				path: '',
				imageUrl: ''
			}
		}
	},
	onShareAppMessage(res) {
		let pages = getCurrentPages(),
			view = pages[pages.length - 1];
		this.share.title = `分享给好友`;
		this.share.path = `/${view.route}`;
		return this.share;
	},
	onShareTimeline(res) {
		let pages = getCurrentPages(),
			view = pages[pages.length - 1];
		this.share.title = `分享到朋友圈`;
		this.share.path = `/${view.route}`;
		return this.share;
	}
}
