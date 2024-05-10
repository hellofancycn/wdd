import {post,get, postWithLoadTip} from '@/utils/request'

export function page(data: any): any {
    return post(`/api/forum/page`, data);
}

export function edit(data: any): any {
    if (data.id === null) {
        return postWithLoadTip(`/api/forum/create`, data)
    } else {
        return postWithLoadTip(`/api/forum/update`, data)
    }
}

export function select(id: any): any {
    return post(`/api/forum/select/${id}`, undefined);
}

export function deleteForum(id: any): any {
    return postWithLoadTip(`/api/forum/delete/${id}`, undefined);
}

export function commentPage(data: any): any {
    return post(`/api/forum/comment/page`, data);
}
export function publishForum(id: any): any {
    return get(`/api/forum/publishForum?id=${id}`, undefined);
}
export function dePublishForum(id: any): any {
    return get(`/api/forum/dePublishForum?id=${id}`, undefined);
}

export function commentDelete(id: any): any {
    return postWithLoadTip(`/api/forum/comment/delete/${id}`, undefined);
}
export function commentPublish(id: any): any {
    return postWithLoadTip(`/api/forum/comment/publish/${id}`, undefined);
}
export function commentdePublish(id: any): any {
    return postWithLoadTip(`/api/forum/comment/dePublish/${id}`, undefined);
}
