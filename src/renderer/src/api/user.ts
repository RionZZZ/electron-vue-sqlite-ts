import CRUD from './CRUD'
import http from '@renderer/utils/request'
import type { Result } from '@renderer/types/http'
import type { DeptListData } from '@renderer/types/dept'
const url = '/system/user'

class User extends CRUD {
  constructor() {
    super(url)
  }
  changeStatus(data: StatusParam) {
    return http.request<Result<undefined>>('put',`${url}/changeStatus`, {data})
  }
  deptTree() {
    return http.get<undefined, Result<DeptListData>>(`${url}/deptTree`)
  }
  resetPwd(data: ResetParam) {
    return http.request<Result<undefined>>('put',`${url}/resetPwd`, {data})
  }
}

export const UserApi = new User()

interface StatusParam {
  userId: number
  status: string
}
interface ResetParam {
  userId: number
  password: string
}