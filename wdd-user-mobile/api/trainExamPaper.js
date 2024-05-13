import {
	post,
	postWithLoading,
	fileRequest
} from '@/utils/request'

export default {
	select: (uId, pId) => post(`/api/train/exam/paper/select/${uId}/${pId}`),
	cheat: id => post(`/api/train/exam/paper/cheat/${id}`),
	submit: (uId, form) => postWithLoading(`/api/train/exam/paper/submit/${uId}`, form),
}