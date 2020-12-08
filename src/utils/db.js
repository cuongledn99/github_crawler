import config from '../config'
import mongoose from 'mongoose'
import { exec } from 'child_process'

mongoose.Promise = global.Promise

let connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      config.MONGODB_OPTIONS.database,
      config.MONGODB_OPTIONS.db_options,
      (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      }
    )
  })
}
export default async function manageConnectDatabase () {
  let db = mongoose.connection
  db.on('connecting', () => console.log('connecting to MongoDB...'))
  db.on('error', (error) => {
    console.error('Error in MongoDb connection: ' + error)
    mongoose.disconnect()
  })
  db.on('connected', () =>
    console.log(
      'Mongoose default connection open to: ' + config.MONGODB_OPTIONS.database
    )
  )
  db.once('open', () => console.log('MongoDB connection opened!'))
  db.on('reconnected', () => console.log('MongoDB reconnected!'))
  db.on('disconnected', async () => {
    console.log('MongoDB disconnected!')

    setTimeout(() => {
      connect()
        .then((result) => console.log('connect success !!!'))

        .catch((err) =>
          console.log('lost Internet connection - no connect to mongodb ' + err)
        )
    }, 5000)
  })
  connect()
    .then((result) => console.log('connect success !!!'))
    .catch((err) =>
      console.log('lost Internet connection - no connect to mongodb ' + err)
    )
  process.on('SIGINT', function () {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose default connection disconnected through app termination'
      )
      process.exit(0)
    })
  })
}

export function restoreDatabase (
  host,
  databaseName,
  user,
  pass,
  path,
  isAtlas = false
) {
  return new Promise(async (resolve, reject) => {
    let cmdLine = `mongorestore --host ${host} --username ${user} --password ${pass} --db ${databaseName}`
    if (isAtlas) {
      cmdLine += ' --ssl --authenticationDatabase admin'
    }
    cmdLine += ` "${path}"`
    exec(cmdLine, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        let output = stdout || stderr
        console.log(output)
        resolve(output)
      }
    })
  })
}

export function removeDatabase (databasename) {
  return new Promise((resolve, reject) => {
    exec(
      `mongo ${databasename} --eval "db.dropDatabase()"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }
    )
  })
}
