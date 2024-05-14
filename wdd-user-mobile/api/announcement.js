import {
	post
} from '@/utils/request'

export default {
	list: () => post(`/api/announcement/archive/list`),
	page: query => post('/api/announcement/page', query),
	select: id => post(`/api/announcement/select/${id}`),
	read: id => post(`/api/announcement/read/${id}`)
}
