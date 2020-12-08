import Errors from 'constants/errors'
import { resError } from 'utils/res'
import AdminApi from 'api/AdminApi'
/**
 * Protected route
 * @param req
 * @param res
 * @param next
 */
export default async function getOrganizationInfo(req, res, next) {
  try {
    const organizationId = req.headers['organization']
    if (!organizationId) {
      resError(res, Errors.ORGANIZATION_NOT_FOUND)
      return
    }
    const resData = await AdminApi.getOrganizationById(organizationId)
    if (resData.success) {
      req.user = { organization: resData.data }
      next()
    } else resError(res, resData.message)
  } catch (e) {
    resError(res, e.message)
  }
}
