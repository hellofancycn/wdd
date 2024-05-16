import { post, postWithLoadTip } from '@/utils/request';

export function page(data: any): any {
  return post(`/api/teacher/page`, data);
}

export function select(id: any): any {
  return post(`/api/train/exam/paper/select/${id}`, undefined);
}

export function edit(data: any): any {
  if (data.id === null) {
    return postWithLoadTip(`/api/teacher/create`, data);
  } else {
    return postWithLoadTip(`/api/teacher/update`, data);
  }
}

export function getInfo(data: any): any {
  return postWithLoadTip(`/api/teacher/getInfo`, data);
}

export function deleteTeacherApi(data: any): any {
  return post(`/api/teacher/delete`, data);
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
