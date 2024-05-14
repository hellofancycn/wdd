import { post } from '@/utils/request'

export default {
  page: query => post('/api/credential/page', query)
}
