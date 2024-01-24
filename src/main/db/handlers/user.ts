import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { Attributes, FindOptions, WhereOptions } from 'sequelize'
import { User } from '../models'
import { RESET_PASSWORD } from '@main/constants'

class UserHandle {
  private async findAll(event: IpcMainInvokeEvent, options: FindOptions<Attributes<User>>) {
    return User.findAll({
      order: [['createdAt', 'DESC']],
      ...options
    }).then(users => {
      if (!users) {
        return []
      }
      return users.map(user => user.toJSON())
    })
  }

  private async findOne(event: IpcMainInvokeEvent, where: WhereOptions<Attributes<User>>) {
    return User.findOne({
      where
    }).then(user => {
      if (!user) {
        return null
      }
      return user.toJSON()
    })
  }

  private async create(event: IpcMainInvokeEvent, params: User) {
    const { userName, phone, email, remark, role } = params
    const password = RESET_PASSWORD
    const status = '1'
    return User.create({ userName, phone, email, remark, password, role, status }).then(user =>
      user.toJSON()
    )
  }

  private async update(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id, phone, email, remark } = params
    return User.findOne({ where: { id } }).then(user => {
      if (!user) {
        throw new Error('no user!')
      } else {
        user.update({ phone, email, remark })
      }
    })
  }

  register() {
    ipcMain.handle('user-find-all', this.findAll)
    ipcMain.handle('user-find-one', this.findOne)
    ipcMain.handle('user-create', this.create)
    ipcMain.handle('user-update', this.update)
  }
}

export const userHandle = new UserHandle()
