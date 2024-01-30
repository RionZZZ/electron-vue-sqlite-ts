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
    return new Promise(response =>
      User.findOne({ where: { userName } }).then(user => {
        if (!user) {
          User.create({ userName, phone, email, remark, password, role, status }).then(() => {
            response({ msg: '新增用户成功', code: 0 })
          })
        } else {
          response({ msg: '用户名已存在，请重新创建!', code: 1004 })
        }
      })
    )
  }

  private update(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id, phone, email, remark, password, status } = params
    return new Promise(response =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          response({ msg: '没找到用户信息!', code: 1001 })
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
    return new Promise(response =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          response({ msg: '没找到用户信息!', code: 1001 })
        } else {
          user.update({ password }).then(() => {
            response({ msg: '重置密码成功', code: 0 })
          })
        }
      })
    )
  }

  private changePassword(event: IpcMainInvokeEvent, params: Attributes<User>) {
    const { id, oldPassword, password } = params
    return new Promise(response =>
      User.findOne({ where: { id } }).then(user => {
        if (!user) {
          response({ msg: '没找到用户信息!', code: 1001 })
        } else {
          if (oldPassword !== user.password) {
            response({ msg: '原密码不正确!', code: 1002 })
          } else if (password === user.password) {
            response({ msg: '新旧密码一致，无需更改!', code: 1003 })
          } else {
            user.update({ password }).then(() => {
              response({ msg: '修改密码成功!', code: 0 })
            })
          }
        }
      })
    )
  }

  private destroy(event: IpcMainInvokeEvent, id: string[]) {
    return new Promise(response =>
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
    ipcMain.handle('user-reset-password', this.resetPassword),
      ipcMain.handle('user-change-password', this.changePassword),
      ipcMain.handle('user-destroy', this.destroy)
  }
}

export const userHandle = new UserHandle()
