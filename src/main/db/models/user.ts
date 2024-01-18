import { Table, Model, Column, DataType, IsUUID, Default, AllowNull } from 'sequelize-typescript'

@Table({
  modelName: 'User',
  tableName: 'users',
  underscored: true
})
export class User extends Model<User> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string

  @Column(DataType.STRING)
  password: string

  @AllowNull(false)
  @Column(DataType.STRING)
  phone: string

  @Column(DataType.STRING)
  email: string

  @Column(DataType.STRING)
  remark: string
}
