import {
	post,
	fileRequest,
	postWithLoading
} from '@/utils/request'

export default {
	page: query => post('/api/practice/page', query),
	select: id => post(`/api/practice/select/${id}`),
	submit: form => postWithLoading('/api/practice/submit', form),
	random: id => post(`/api/practice/random/build/${id}`),
	read: id => post(`/api/practice/read/${id}`),
	edit: form => postWithLoading('/api/practice/edit', form),
	answerPage: query => post('/api/practice/answer/page', query),
	checkCodes: query => post(`/api/practice/checkCode`,query),
	errorPage:query =>post('/api/practice/errorPage',query)
}