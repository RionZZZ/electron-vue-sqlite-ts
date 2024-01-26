import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { Attributes, Op, WhereOptions } from 'sequelize'
import { User } from '../models'
import { DEFAULT_USER_STATUS, RESET_PASSWORD } from '@main/constants'

class UserHandle {
  private findAll(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { userName, status } = params

    const where: { userName?: object; status?: object } = {}
    userName && (where.userName = { [Op.like]: `%${userName}%` })
    status && (where.status = { [Op.eq]: status })

    return User.findAll({
      order: [['createdAt', 'DESC']],
      where
    }).then(users => {
      console.log(users)

      if (!users) {
        return []
      }
      return users.map(user => user.toJSON())
    })
  }

  private findAndCountAll(
    event: IpcMainInvokeEvent,
    params: Attributes<User> & VegetablePagination
  ) {
    const { userName, limit, offset } = params

    const where: { userName?: object } = {}
    userName && (where.userName = { [Op.like]: `%${userName}%` })
    return User.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      where
    }).then(res => {
      const { count, rows } = res
      const pages = limit ? Math.ceil(count / limit) : 1
      const hasNextPage = pages > offset! + 1
      const data = rows.map(row => row.toJSON())
      return {
        data,
        count,
        pages,
        hasNextPage
      }
    })
  }

  private findOne(event: IpcMainInvokeEvent, where: WhereOptions<Attributes<User>>) {
    return User.findOne({
      where
    }).then(user => {
      if (!user) {
        return null
      }
      return user.toJSON()
    })
  }

  private create(event: IpcMainInvokeEvent, params: User) {
    const { userName, phone, email, remark, role } = params
    const password = RESET_PASSWORD
    const status = DEFAULT_USER_STATUS
    return new Promise((response, reject) =>
      User.create({ userName, phone, email, remark, password, role, status }).then(() => {
        response({ msg: '新增用户成功', code: 0 })
      })
    )
  }

  private update(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id, phone, email, remark, password, status } = params
    return new Promise((response, reject) =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          reject('没找到用户信息!')
        } else {
          user.update({ phone, email, remark, password, status }).then(() => {
            response({ msg: '修改用户成功', code: 0 })
          })
        }
      })
    )
  }

  private resetPassword(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id } = params
    const password = RESET_PASSWORD
    return new Promise((response, reject) =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          reject('没找到用户信息!')
        } else {
          user.update({ password }).then(() => {
            response({ msg: '重置密码成功', code: 0 })
          })
        }
      })
    )
  }

  private destroy(event: IpcMainInvokeEvent, id: string[]) {
    return new Promise((response, reject) =>
      User.findAll({
        where: { id }
      }).then(users => {
        users.map(user => user.destroy())
        response({ msg: `删除成功${users.length}条数据`, code: 0 })
      })
    )
  }

  register() {
    ipcMain.handle('user-find-all', this.findAll)
    ipcMain.handle('user-find-and-count-all', this.findAndCountAll)
    ipcMain.handle('user-find-one', this.findOne)
    ipcMain.handle('user-create', this.create)
    ipcMain.handle('user-update', this.update)
    ipcMain.handle('user-reset-password', this.resetPassword)
    ipcMain.handle('user-destroy', this.destroy)
  }
}

export const userHandle = new UserHandle()
