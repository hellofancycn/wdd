import {post,exportpost, postWithLoadTip} from '@/utils/request'

export function getCurrentUser(): any {
    return post(`/api/userExtend/selectList`, undefined);
}

export function update(data: any): any {
    return postWithLoadTip(`/api/userExtend/update`, data);
}

export function changePassword(data: any): any {
    return postWithLoadTip(`/api/user/changePassword`, data);
}

export function comment(data: any): any {
    return post(`/api/user/comment`, data);
}

export function event(data: any): any {
    return post(`/api/user/event`, data);
}

export function feedback(data: any): any {
    return postWithLoadTip(`/api/user/feedback`, data);
}

export function train(data: any): any {
    return post(`/api/user/train`, data);
}
//安全教育培训
export function extenInsert(data: any): any {
    return post(`/api/userExtendTrain/insert`, data);
}
export function extenUpdate(data: any): any {
    return post(`/api/userExtendTrain/update`, data);
}
export function extenDelete(id: any): any {
    return post(`/api/userExtendTrain/deleteById/${id}`, undefined);
}
export function extenList(data: any): any {
    return post(`/api/userExtendTrain/pageTrain`, data);
}
// 违章记录
export function violationInsert(data: any): any {
    return post(`/api/userExtendViolation/insert`, data);
}
export function violationUpdate(data: any): any {
    return post(`/api/userExtendViolation/update`, data);
}
export function violationDelete(id: any): any {
    return post(`/api/userExtendViolation/deleteById/${id}`, undefined);
}
export function violationList(data: any): any {
    return post(`/api/userExtendViolation/pageViolation`, data);
}

//一人一档导出
export function exportYryd(id:any) :any {
    return exportpost(`/api/wdd/yrydPlan/yryd?id=` + `${id}`,undefined)
}