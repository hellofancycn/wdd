import {
	post,
	fileRequest,
	postWithLoading
} from '@/utils/request'

export default {
	list: () => post(`/api/exam/paper/archive/list`),
	cheat: id => post(`/api/exam/paper/cheat/${id}`),
	select: (type, id) => post(`/api/exam/paper/select/${type}/${id}`),
	page: query => post('/api/exam/paper/page', query),
	facePicture: query => postWithLoading(`/api/exam/paper/face`, query),
	uploadFace: path => fileRequest('/api/upload/face', path),
}
