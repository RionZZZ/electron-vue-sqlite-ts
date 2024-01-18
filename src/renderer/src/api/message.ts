import CRUD from './CRUD'
import http from '@renderer/utils/request'

const url = '/news'

class Message extends CRUD {
  constructor() {
    super(url)
  }

  fetchNews<T>(params: T) {
    return http.get<T, any>('/allNews', params)
  }
}

export const MessageApi = new Message()
