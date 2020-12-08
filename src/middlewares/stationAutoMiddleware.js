import Errors from 'constants/errors'
import { resError } from 'utils/res'
import CategoryApi from 'api/CategoryApi'
/**
 * Protected route
 * @param req
 * @param res
 * @param next
 */
export async function stationAutoMiddleware (req, res, next) {
  try {
    const key = req.body.key
    const item = await req.dao.stationAutoDao.findOne({ key })
    if (item) {
      resError(res, Errors.KEY_EXISTED)
    } else {
      next()
    }
  } catch (e) {
    resError(res, e.message)
  }
}

/* MAKE  khong dùng logic cứng này nữa, lấy giá trị người dùng cấu hình trong  */
// export async function getSystemConfigs (req, res, next) {
//   try {
//     let systemConfigs = await CategoryApi.getSysConfig()
//     req.systemConfigs = systemConfigs.data.stationAuto.warning
//     next()
//   } catch (e) {
//     next()
//   }
// }
