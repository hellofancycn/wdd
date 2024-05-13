import {post, postWithLoadTip, postSync} from '@/utils/request'

export function list(): any {
    return post(`/api/train/archive/list`, undefined);
}

export function page(data: any): any {
    return post(`/api/train/page`, data);
}

export function select(id: any): any {
    return post(`/api/train/select/${id}`, undefined);
}


export function start(id: any): any {
    return postSync(`/api/train/start/${id}`, undefined);
}
