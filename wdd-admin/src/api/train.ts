import {post, postWithLoadTip,exportpost} from '@/utils/request'

export function page(data: any): any {
    return post(`/api/train/course/page`, data);
}

export function edit(data: any): any {
    if (data.plan.train.id === null) {
        return postWithLoadTip(`/api/train/course/createPlan`, data)
    } else {
        return postWithLoadTip(`/api/train/course/update`, data)
    }
}

export function deleteTrain(id: any): any {
    return postWithLoadTip(`/api/train/course/delete/${id}`, undefined);
}

export function select(id: any): any {
    return post(`/api/train/course/select/${id}`, undefined);
}

export function info(id: any): any {
    return post(`/api/train/course/detail/${id}`, undefined);
}

export function userPage(data: any): any {
    return post(`/api/train/course/detail/page`, data);
}

export function userExport(data: any): any {
    return postWithLoadTip(`/api/train/course/detail/export`, data);
}


export function userCourseWarePage(data: any): any {
    return post(`/api/train/course/detail/course/ware/page`, data);
}
// export function createPlan(data: any): any {
//     return post(`/api/train/course/createPlan`, data);
// }
// 一期一挡导出
export function exportPlan(id: any): any {
    return exportpost(`/api/train/export/exportPlan?planId=` + `${id}`, undefined);
}
//一人一档
export function exportUser(id: any): any {
    return exportpost(`/api/user/export/yryd?id=` + `${id}`, undefined);
}

