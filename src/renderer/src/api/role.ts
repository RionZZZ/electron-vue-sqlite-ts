import type { Result, PageResult } from '@renderer/types/http'
import CRUD from './CRUD'
import http from '@renderer/utils/request'
const url = '/system/role'
import type { RoleListsData, RoleListsParam, menuTree, RoleForm, authTreeType } from '@renderer/types/role'

class Role extends CRUD {
  constructor() {
    super(url)
  }
  // 角色用户列表
  fetchRoleList(id: number | undefined, params: RoleListsParam) {
    return http.get<RoleListsParam, PageResult<RoleListsData>>(
      `/system/user/getUserByRole/${id || ''}`,
      params
    )
  }
  // 系统列表
  getSysList() {
    return http.request<Result<authTreeType[]>>('get', '/system/sys/list')
  }
  // 权限列表
  getAuthBySys(id: number) {
    return http.request<Result<menuTree[]>>('get', `/system/menu/getTreeMenuBySystem/${id}`)
  }
  // 权限列表
  getRoleInfo(id: number) {
    return http.request<Result<RoleForm & { menus: menuTree[] }>>(
      'get',
      `/system/role/getRoleInfo/${id}`
    )
  }
}

export const RoleApi = new Role()
