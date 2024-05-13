import {
	post,
	postWithLoading
} from '@/utils/request'

export default {
	list: () => post('/api/course/ware/archive/list'),
	pageList: query => post('/api/course/ware/page', query),
	watch: query => post(`/api/course/ware/watch`, query),
	select: id => post(`/api/course/ware/select/${id}`),
	submit: form => postWithLoading('/api/course/ware/question/submit', form),
}