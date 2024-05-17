import { post, postWithLoadTip, get, form } from '@/utils/request';

// export function employeePage(data: any): any {
//     return post(`/api/userExtend/selectPageList`, data);
// }
export function employeePage(data: any): any {
  return post(`/api/user/v1/employee/page`, data);
}

export function employeeEdit(data: any): any {
  if (data.user.id === null) {
    return postWithLoadTip(`/api/user/v1/employee/create`, data);
  } else {
    return postWithLoadTip(`/api/user/v1/employee/update`, data);
  }
}

export function employeeSelect(id: any): any {
  return post(`/api/user/v1/employee/select/${id}`, undefined);
}

export function employeeDelete(id: any): any {
  return postWithLoadTip(`/api/user/employee/delete/${id}`, undefined);
}

export function employeeExport(data: any): any {
  return postWithLoadTip(`/api/user/v1/employee/export`, data);
}

export function adminPage(data: any): any {
  return post(`/api/user/admin/page`, data);
}

export function adminEdit(data: any): any {
  if (data.id === null) {
    return postWithLoadTip(`/api/user/admin/create`, data);
  } else {
    return postWithLoadTip(`/api/user/admin/update`, data);
  }
}

export function adminSelect(id: any): any {
  return post(`/api/user/admin/select/${id}`, undefined);
}

export function adminDelete(id: any): any {
  return postWithLoadTip(`/api/user/admin/delete/${id}`, undefined);
}

export function userByUserName(data: any): any {
  return post(`/api/user/selectByUserName`, data);
}
// 人员违规 培训列表
export function userExtendTrainPage(data: any): any {
  return post(`/api/userExtendTrain/pageTrain`, data);
}

// 人员违规 培训列表  新增
export function userExtendTrainInsert(data: any): any {
  return post(`/api/userExtendTrain/insert`, data);
}

// 人员违规 培训列表  删除
export function userExtendTrainDelete(data: any): any {
  return form(`/api/userExtendTrain/deleteById`, data);
}
// 人员违规 培训列表  修改
export function userExtendTrainUpdate(data: any): any {
  return post(`/api/userExtendTrain/update`, data);
}
// 人员违规 培训列表  详情
export function userExtendTrainDetail(data: any): any {
  return get(`/api/userExtendTrain/selectOne/` + data, '');
}

// 人员违规
export function userExtendViolationPage(data: any): any {
  return post(`/api/userExtendViolation/pageViolation`, data);
}

// 人员违规  新增
export function userExtendViolationInsert(data: any): any {
  return post(`/api/userExtendViolation/insert`, data);
}

// 人员违规  删除
export function userExtendViolationDelete(data: any): any {
  return form(`/api/userExtendViolation/deleteById`, data);
}

// 人员违规  修改
export function userExtendViolationUpdate(data: any): any {
  return post(`/api/userExtendViolation/update`, data);
}

// 人员违规  详情
export function userExtendViolationDetail(data: any): any {
  return post(`/api/userExtendViolation/pageViolation`, data);
}
