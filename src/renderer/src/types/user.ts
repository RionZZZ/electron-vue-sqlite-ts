export interface UserListsParam {
  userName?: string
  deptId?: string
  roleId?: string
  status?: string
}

export interface UserData {
  deptId: number
  deptName:string
  entryTime?: string
  menuName: string
  nickName: string
  phoneNumber: string
  password:string
  roleName: string
  roleIds:(number | undefined)[]
  status:string
  systemId:number
  userId:number
  userName:string
}