import {post, postWithLoadTip} from '@/utils/request'

export function page(data: any): any {
    return post(`/api/dict/type/list`, data);
}
export function dataListPage(data: any): any {
    return post(`/api/dict/data/type/list`, data);
}
export function dataListAdd(data: any): any {
  return post(`/api/dict/data/create`, data);
}
export function edit(data: any): any {
    if (data.dictId) {
      return postWithLoadTip(`/api/dict/type/update`, data)
    } else {
      return postWithLoadTip(`/api/dict/type/create`, data)
    }
}
export function deleteDictApi(data: any): any {
    return post(`/api/dict/type/delete`, data);
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
