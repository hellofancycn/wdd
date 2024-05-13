import {
	post,
	postWithLoading
} from '@/utils/request'

export default {
	login: query => postWithLoading(`/api/user/login`, query),
	logout: () => post(`/api/user/logout`),
	register: query => postWithLoading(`/api/user/register`, query),
	tree: () => post(`/api/user/department/tree`)
}
