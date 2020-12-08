import { resError } from 'utils/res'
import Errors from 'constants/errors'
import AuthApi from 'api/AuthApi'
import httpContext from 'express-http-context'
import _ from 'lodash'

export default async function authMiddleware (req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers['authorization']
  if (!token) {
    resError(res, Errors.NOT_TOKEN)
    return
  }
  try {
    const resData = await AuthApi.getMe(token)
    if (resData.error) {
      res.json(resData)
      return
    }
    req.user = resData.data
    req.token = token
    httpContext.set('user', req.user)

    let databaseInfo = _.get(req.user, 'organization.databaseInfo', undefined)
    httpContext.set('databaseInfo', databaseInfo)

    next()
  } catch (e) {
    resError(res, e.message)
  }
}
