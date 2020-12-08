import mongoose from 'mongoose'

/**
 * Get connection from socket history
 * @param dbName
 * @returns {*}
 */
export function getConnection(dbInfo) {
  return mongoose.connections.find(
    connection =>
      connection.name === dbInfo.name &&
      connection.host === dbInfo.address &&
      connection.user === dbInfo.user &&
      connection.pass === dbInfo.pwd &&
      `${connection.port}` === `${dbInfo.port}`
  )
}

/**
 * Db options to connect
 * @param dbInfo
 * @returns {{urlPath: string, options: {native_parser: boolean, poolSize: number, user, pass, useMongoClient: boolean, promiseLibrary}}}
 */
function getOptionsDb(dbInfo) {
  let address = dbInfo.address
  if(process.env.isDev){
    address = process.env.MONGO_DEV
  }
  return {
    urlPath: `mongodb://${address}:${dbInfo.port}/${dbInfo.name}`,
    options: {
      user: dbInfo.user,
      pass: dbInfo.pwd,
      native_parser: true,
      poolSize: 20,
      useMongoClient: true,
      promiseLibrary: global.Promise,
      autoReconnect: true,
      useNewUrlParser: true,
      socketTimeoutMS: 480000,
      keepAlive: 300000,
      sslValidate: false,
    }
  }
}

/**
 * Create connection new or old
 * @param dbInfo
 * @returns {*}
 */
export function createConnection (dbInfo) {
  const dbConnection = getConnection(dbInfo)
  if (dbConnection) return dbConnection
  const dbOptions = getOptionsDb(dbInfo)
  return mongoose.createConnection(dbOptions.urlPath, dbOptions.options)
}

/**
 * Create Model with connection
 * @param conn
 * @param modelName
 * @param ModelSchema
 */
export function createModel(conn, modelName, ModelSchema) {
  return conn.model(modelName, ModelSchema)
}

/**
 * Inject model to dao
 * @param conn
 * @param Dao
 * @returns {*}
 */
export function createDao(conn, Dao, dbInfo) {
  return new Dao(createModel(conn, Dao.model.name, Dao.model.schema), dbInfo)
}

/**
 * Assign connection to dao, model
 * @param objectDaos
 * @param mongoDbConnect
 * @returns {{}}
 */
export function assignDao(objectDaos, mongoDbConnect, dbInfo) {
  let dao = {}
  Object.keys(objectDaos).forEach(objectKey => {
    if (objectDaos[objectKey]) {
      dao[objectKey] = createDao(mongoDbConnect, objectDaos[objectKey], dbInfo)
    }
  })
  return dao
}
