import type { Result, PageResult } from '@renderer/types/http'
import http from '@renderer/utils/request'

export default class CRUD {
  private url
  constructor(url: string) {
    this.url = url
  }

  // 查询
  fetchList<T, P>(params?: T) {
    return http.get<T, PageResult<P>>(`${this.url}/list`, params)
  }
  // 新增
  create<T>(data: T) {
    return http.post<T, Result<any>>(`${this.url}/add`, data)
  }
  // 详情
  detail<T>(id: number) {
    return http.get<undefined, Result<T>>(`${this.url}/${id}`)
  }
  // 修改
  update<T>(data: T) {
    return http.request<Result<any>>('put', `${this.url}/edit`, { data })
  }
  // 删除
  delete(data: number[]) {
    return http.request<Result<any>>('delete', `${this.url}/delete`, { data })
  }
}
