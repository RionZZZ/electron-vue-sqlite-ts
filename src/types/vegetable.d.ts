type VegetableType = {
  db: { init: () => Promise }
  user: VegetableCurd<UserType>
}

type VegetableCurd<T> = {
  findAll: (params: Partial<T>) => Promise<T[]>
  findAndCountAll: (
    params: Partial<T> & VegetablePagination
  ) => Promise<VegetablePaginationResponse<T>>
  findOne: (params: Partial<T>) => Promise<T>
  create: (params: Partial<T>) => Promise<T>
  update: (params: Partial<T>) => Promise<T>
}

type VegetablePagination = {
  offset: number
  limit: number
}

type VegetablePaginationResponse<T> = {
  rows: T[]
  count: number
  pages: number
  hasNextPage: boolean
}
