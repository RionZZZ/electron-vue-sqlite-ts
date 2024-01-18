import { ipcMain } from 'electron'
import { Attributes, FindOptions, WhereOptions } from 'sequelize'
import { User } from '../models'

class UserHandle {
  private async findAll(options: FindOptions<Attributes<User>>) {
    console.log(options)

    return User.findAll({
      order: [['createdAt', 'DESC']],
      ...options
    }).then((users) => {
      if (!users) {
        return []
      }
      return users.map((user) => user.toJSON())
    })
  }

  private async findOne(where: WhereOptions<Attributes<User>>) {
    return User.findOne({
      where
    }).then((user) => {
      if (!user) {
        return null
      }
      return user.toJSON()
    })
  }

  register() {
    ipcMain.handle('user-find-all', () => this.findAll)
    ipcMain.handle('user-find-one', () => this.findOne)
  }
}

export const userHandle = new UserHandle()
