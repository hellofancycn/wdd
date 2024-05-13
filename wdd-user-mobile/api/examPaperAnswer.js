import {
	post,
	postWithLoading,
	fileRequest
} from '@/utils/request'

export default {
	pageList: query => post('/api/exam/paper/answer/page', query),
	answerSubmit: form => postWithLoading('/api/exam/paper/answer/submit', form),
	read: id => post(`/api/exam/paper/answer/read/select/${id}`),
	monitorSubmit: form => post('/api/exam/paper/answer/monitor', form),
	capturePicture: (paperId, path) => fileRequest(`/api/exam/paper/answer/camera/${paperId}`, path),
	capturePictureH5: query => post('/api/exam/paper/answer/camera/h5', query)
}
