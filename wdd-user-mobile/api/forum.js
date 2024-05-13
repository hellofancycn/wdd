import {
	post,
	postWithLoading
} from '@/utils/request'

export default {
	pageList: query => post('/api/forum/page', query),
	add: query => postWithLoading('/api/forum/add', query),
	tree: () => post(`/api/forum/archive/tree`),
	list: () => post(`/api/forum/archive/list`),
	select: id => post(`/api/forum/select/${id}`),
	commentAdd: query => postWithLoading('/api/forum/comment/add', query),
	commentPageList: query => post('/api/forum/comment/page', query),
	commentDelete: id => post(`/api/forum/comment/delete/${id}`)
}
