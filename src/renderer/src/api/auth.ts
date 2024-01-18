import { httpConfig } from '@renderer/config'
import type { Result } from '@renderer/types/http'
import http from '@renderer/utils/request'

const url = ''

class Auth {
  login(params: Omit<LoginParam, 'flag'>) {
    return http.post<LoginParam, Result<string>>(url + '/login', {
      ...params,
      flag: httpConfig.flag
    })
  }
}

export const AuthApi = new Auth()

interface LoginParam {
  userName: string
  password: string
  flag: number
}
