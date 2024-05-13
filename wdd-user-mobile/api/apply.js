import {
	post,
	postWithLoading
} from '@/utils/request'

export default {
	list: () => post(`/api/apply/archive/list`),
	page: query => post('/api/apply/page', query),
	record: query => post('/api/apply/record', query),
	goApply: id => postWithLoading(`/api/apply/go/${id}`),
	cancelApply: (applyId, userApplyId) => postWithLoading(`/api/apply/cancel/${applyId}/${userApplyId}`)
}
