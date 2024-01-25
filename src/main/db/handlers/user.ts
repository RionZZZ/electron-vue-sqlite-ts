import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { Attributes, FindOptions, Op, WhereOptions } from 'sequelize'
import { User } from '../models'
import { DEFAULT_USER_STATUS, RESET_PASSWORD } from '@main/constants'

class UserHandle {
  private async findAll(event: IpcMainInvokeEvent, params: Partial<User>) {
    const { userName } = params
    const where = { userName: { [Op.like]: `%${userName}%` } }
    return User.findAll({
      order: [['createdAt', 'DESC']],
      where
    }).then(users => {
      if (!users) {
        return []
      }
      return users.map(user => user.toJSON())
    })
  }

  private async findAndCountAll(
    event: IpcMainInvokeEvent,
    params: Partial<User> & VegetablePagination
  ) {
    const { userName, limit, offset } = params
    const where = { userName: { [Op.like]: `%${userName}%` } }
    return User.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      where
    }).then(res => {
      const { count } = res
      const pages = limit ? Math.ceil(count / limit) : 1
      const hasNextPage = pages > offset! + 1
      return {
        ...res,
        pages,
        hasNextPage
      }
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
    const status = DEFAULT_USER_STATUS
    return new Promise((response, reject) =>
      User.create({ userName, phone, email, remark, password, role, status }).then(() => {
        response({ msg: '新增用户成功' })
      })
    )
  }

  private async update(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id, phone, email, remark, password, status } = params
    return new Promise((response, reject) =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          reject('no user!')
        } else {
          user.update({ phone, email, remark, password, status }).then(() => {
            response({ msg: '修改用户成功' })
          })
        }
      })
    )
  }

  register() {
    ipcMain.handle('user-find-all', this.findAll)
    ipcMain.handle('user-find-and-count-all', this.findAndCountAll)
    ipcMain.handle('user-find-one', this.findOne)
    ipcMain.handle('user-create', this.create)
    ipcMain.handle('user-update', this.update)
  }
}

export const userHandle = new UserHandle()
