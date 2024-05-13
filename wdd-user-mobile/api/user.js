import {
	post,
	postWithLoading,
	fileRequest,
	exportPost
} from '@/utils/request'

export default {
	getCurrentUser: () => post('/api/user/current'),
	update: query => postWithLoading('/api/user/update', query),
	changePassword: query => postWithLoading('/api/user/changePassword', query),
	comment: query => post('/api/user/comment', query),
	event: (query) => post('/api/user/event', query),
	changePicture: path => fileRequest('/api/upload/picture', path),
	feedback: query => postWithLoading('/api/user/feedback', query),
	train: (query) => post('/api/user/train', query),
	//培训记录
	extenInsert: query => post('/api/userExtendTrain/insert',query),
	extenUpdate: query => post('/api/userExtendTrain/update',query),
	extenDelete: id => post(`/api/userExtendTrain/deleteById?id=` + `${id}`),
	extenList: query => post('/api/userExtendTrain/pageTrain', query),
	extenSelectById: id => post(`/api/userExtendTrain/selectById?id=` + `${id}`),
	//违章记录
	violationInsert: query => post('/api/userExtendViolation/insert',query),
	violationUpdate: query => post('/api/userExtendViolation/update',query),
	violationDelete: id => post(`/api/userExtendViolation/deleteById?id=` + `${id}`),
	violationList: query => post('/api/userExtendViolation/pageViolation', query),
	violationSelectById: id => post(`/api/userExtendViolation/selectById?id=` + `${id}`),
	//一人一档导出
	// exportYryd: id => exportPost(`/api/wdd/yrydPlan/yryd?id=` + `${id}`),
	exportYryd: id => exportPost(`/api/wdd/yrydPlan/yryd/${id}`),
	// exportYryd: query => exportPost('/api/wdd/yrydPlan/yryd',query),
}