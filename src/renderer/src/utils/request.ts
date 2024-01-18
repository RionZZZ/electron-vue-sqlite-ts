import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  // type AxiosResponse,
  type Method
} from 'axios'
import { httpConfig } from '@renderer/config'
import NProgress from '@renderer/modules/progress'
import { UserStore } from '@renderer/stores'
import { ElMessage } from 'element-plus'

const userStore = UserStore()
const { logout } = userStore

const defaultConfig: AxiosRequestConfig = {
  timeout: httpConfig.requestTimeout,
  baseURL: httpConfig.baseURL,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest',
    'flag': httpConfig.flag
  }
  // paramsSerializer: {
  //   serialize: stringify as unknown as CustomParamsSerializer
  // }
}

class _Http {
  constructor() {
    console.log('_Http constructor')
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)

  private httpInterceptorsRequest() {
    _Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start()
        const { token } = UserStore()
        if (token) {
          config.headers!.Authorization = token
        }

        if (config.method === 'get') {
          config.params = {
            t: new Date().getTime(),
            ...config.params
          }
        }
        return config
      },
      error => {
        console.log('request error')
        return Promise.reject(error)
      }
    )
  }

  private httpInterceptorsResponse() {
    _Http.axiosInstance.interceptors.response.use(
      res => {
        NProgress.done()
        // 未设置状态码则默认成功状态
        const code = res.data.code
        if (code && code !== 0) {
          ElMessage({
            message: res.data.msg,
            type: 'error',
            offset: 40
          })
          // token过期或不存在
          if (code === 401) {
            logout()
          }
        }
        return res.data
      },
      err => {
        let message = '服务器错误，请稍后尝试'
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              message = '请求错误(400)'
              break
            case 401:
              message = '未授权，请重新登录(401)'
              break
            case 403:
              message = '拒绝访问(403)'
              break
            case 404:
              message = '请求出错(404)'
              break
            case 408:
              message = '请求超时(408)'
              break
            case 500:
              message = '服务器错误(500)'
              break
            case 501:
              message = '服务未实现(501)'
              break
            case 502:
              message = '网络错误(502)'
              break
            case 503:
              message = '服务不可用(503)'
              break
            case 504:
              message = '网络超时(504)'
              break
            case 505:
              message = 'HTTP版本不受支持(505)'
              break
            default:
              message = `连接出错(${err.response.status})!`
          }

          ElMessage({
            message,
            type: 'error',
            offset: 40
          })

          return Promise.reject(err)
        }
      }
    )
  }

  public request<T>(method: Method, url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
    const config = {
      method,
      url,
      ...requestConfig
    }
    return _Http.axiosInstance.request(config)
  }

  public get<T, P>(url: string, params?: T, requestConfig?: AxiosRequestConfig): Promise<P> {
    return this.request<P>('get', url, { params, ...requestConfig })
  }
  public post<T, P>(url: string, data: T, requestConfig?: AxiosRequestConfig): Promise<P> {
    return this.request<P>('post', url, { data, ...requestConfig })
  }
}

export default new _Http()
