import type { Pagination } from '@renderer/types/config'
import type { UserData } from '@renderer/types/user'
import CRUD from './CRUD'
import http from '@renderer/utils/request'
import type { PageResult } from '@renderer/types/http'

const url = '/system/dept'

class Dept extends CRUD {
  constructor() {
    super(url)
  }

  fetchUserList(params: UserListParam) {
    return http.get<UserListParam, PageResult<UserData>>(url + '/getUserByDept', params)
  }
}

export const DeptApi = new Dept()

type UserListParam = {
  deptId?: number
} & Pagination
