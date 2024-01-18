export interface DeptListData {
  deptId: number
  deptName: string
  parentId: number
  parentName: string
  ancestors: number
  children?: DeptListData
}
