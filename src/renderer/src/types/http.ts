export interface Result<T> {
  code: number
  data: T
  msg: string
}

export interface PageResult<T> extends Result<T[]> {
  total?: number
}
