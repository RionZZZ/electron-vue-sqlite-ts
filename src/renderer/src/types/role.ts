export interface RoleListsParam {
  id?: number
  pageNum: number
  pageSize: number
}
export interface RoleForm {
  roleId: number
  roleName: string
  systemId: number
  systemName: string
  menuIds: any[]
}

export interface RoleListsData {
  nickName:string
  userName:string
  roleId: number
  roleName: number
  systemId: number
  systemName: number
  phoneNumber: string
  deptName: string
  status: number
}

export interface RoleTreeType {
  id: number
  name: string
  details: RoleTreeType[]
}
export interface authTreeType {
  id: number
  label: string
  children?: authTreeType[]
}
export interface menuTree {
  menuId: number
  menuName: string
  children: menuTree[]
}
