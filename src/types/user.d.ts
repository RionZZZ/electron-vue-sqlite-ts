type UserType = {
  id: string
  userName: string
  phone: string
  password?: string
  email?: string
  remark?: string
  role: 'user' | 'admin' | ' finance'
  status: '0' | '1'
  createdAt?: string
  updateAt?: string
}

type VegetableUser<T> = {
  resetPassword: (params: Partial<T>) => Promise
  changePassword: (params: Partial<T> & { oldPassword: string }) => Promise
}
