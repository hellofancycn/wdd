import {
	post,
	postWithLoading
} from '@/utils/request'

export default {
	list: () => post('/api/train/archive/list'),
	pageList: query => post('/api/train/page', query),
	select: id => post(`/api/train/select/${id}`),
	start: id => postWithLoading(`/api/train/start/${id}`),
}