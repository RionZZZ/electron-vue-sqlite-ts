import { Table, Model, Column, DataType, IsUUID, Default, AllowNull } from 'sequelize-typescript'

@Table({
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: true
})
export class User extends Model {
  @IsUUID('all')
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string

  @AllowNull(false)
  @Column(DataType.STRING)
  userName: string

  @Column(DataType.STRING)
  password: string

  @AllowNull(false)
  @Column(DataType.STRING)
  phone: string

  @Column(DataType.STRING)
  email: string

  @Column(DataType.STRING)
  remark: string

  @AllowNull(false)
  @Column(DataType.ENUM('admin', 'user', 'finance'))
  role: 'admin' | 'user' | 'finance'

  @AllowNull(false)
  @Default(1)
  @Column(DataType.ENUM('0', '1'))
  status: '0' | '1'
}
