import { form, post, postWithLoadTip, get } from '@/utils/request';

export function page(data: any): any {
  return post(`/api/dict/type/list`, data);
}
export function edit(data: any): any {
  if (data.dictId) {
    return postWithLoadTip(`/api/dict/type/update`, data);
  } else {
    return postWithLoadTip(`/api/dict/type/create`, data);
  }
}
export function deleteDictApi(data: any): any {
  return post(`/api/dict/type/delete`, data);
}

export function dataListPage(data: any): any {
  return post(`/api/dict/data/list`, data);
}
export function editData(data: any): any {
  if (data.dictCode) {
    return postWithLoadTip(`/api/dict/data/edit`, data);
  } else {
    return postWithLoadTip(`/api/dict/data/create`, data);
  }
}
export function dataListAdd(data: any): any {
  return post(`/api/dict/data/create`, data);
}
export function deleteDataApi(data: any): any {
  return post(`/api/dict/data/delete`, data);
}

export function getInfoDictApi(data: any): any {
  return form(`/api/dict/type/getInfo`, data);
}

export function getItrain_file_typeListApi(data: any): any {
  return get(`/api/dict/data/type/train_file_type`, data);
}

export function userAnswerPage(data: any): any {
  return post(`/api/train/exam/paper/answer/page`, data);
}

export function answerRead(id: any): any {
  return post(`/api/train/exam/paper/answer/read/${id}`, undefined);
}

export function answerEdit(data: any): any {
  return postWithLoadTip(`/api/train/exam/paper/answer/edit`, data);
}

export function nextJudge(id: any): any {
  return post(`/api/train/exam/paper/next/judge/${id}`, undefined);
}
// 查询字典数据的详细信息
export function getDictDataInfo(id: any): any {
  return get(`/api/dict/data/getInfo/${id}`, undefined);
}

// 查询字典数据的详细信息
export function getDictDataType(type: any): any {
  return get(`/api/dict/data/type/${type}`, undefined);
}
