import { app, ipcMain } from 'electron'
import { dirname, join } from 'path'
import { Sequelize } from 'sequelize-typescript'
import { User } from './models'
import { userHandle } from './handlers'

const DB_PATH = app.isPackaged
  ? join(dirname(app.getPath('exe')), '/db/vegetable.sqlite')
  : join(app.getAppPath(), '/db/vegetable_dev.sqlite')
console.log(DB_PATH)

const db = {
  connection: null as Sequelize | null,
  connect: async () => {},
  registerHandlers: () => {}
}

db.connect = async () => {
  if (db.connection) {
    return
  }
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_PATH,
    models: [User]
  })

  db.connection = sequelize

  await sequelize.query('PRAGMA foreign_keys = false;')
  await sequelize.sync()
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  await sequelize.query('VACUUM')

  userHandle.register()
}

db.registerHandlers = () => {
  ipcMain.handle('db-init', async () => {
    return db
      .connect()
      .then(() => {
        return { state: 'connected' }
      })
      .catch(error => {
        return {
          state: 'error',
          error
        }
      })
  })
}

export default db
