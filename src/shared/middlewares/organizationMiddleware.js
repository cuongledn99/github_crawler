import { resError } from 'utils/res'
import Errors from 'constants/errors'
import { assignDao, createConnection } from '../mongoUtils/connect'
import objectDaos from '../registerDao'
import { get as _get } from 'lodash'

function getDatabaseInfo (req) {
  const databaseInfo = req.user.organization.databaseInfo
  return databaseInfo
}

// export default async function (req, res, next) {
//   const dbInfo = getDatabaseInfo(req)
//   if (!dbInfo) {
//     resError(res, Errors.DB_CONNECTION_ORGNIZATION)
//     return
//   }
//   const mongoDbConnect = createConnection(dbInfo)
//   mongoDbConnect.then(
//     () => {
//       req.dao = assignDao(objectDaos, mongoDbConnect, dbInfo)
//       next()
//     },
//     err => {
//       resError(res, err)
//     }
//   )
// }

export default async function (req, res, next) {
  try {
    const dbInfo = getDatabaseInfo(req)
    if (!dbInfo) {
      resError(res, Errors.DB_CONNECTION_ORGNIZATION)
      return
    }
    req.databaseInfo = dbInfo
    req.tZ = _get(req.user, "organization.timeZone.utcOffset", "+07:00")
    const mongoDbConnect = await createConnection(dbInfo)
    req.dao = assignDao(objectDaos, mongoDbConnect, dbInfo)
    req.conn = mongoDbConnect
    next()
  } catch (error) {
    resError(res, error)
  }
}
