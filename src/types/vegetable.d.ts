type VegetableType = {
  db: { init: () => Promise }
  user: {
    findAll: (params: { offset?: number; limit?: number }) => Promise<UserType[]>
    findOne: (params: object) => Promise<UserType>
    create: (params: Partial<UserType>) => Promise<UserType>
    update: (params: Partial<UserType>) => Promise<UserType>
  }
}
