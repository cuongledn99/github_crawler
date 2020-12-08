import express from "express";
import * as cameraHelper from "utils/camera";
import Joi, { object } from "joi";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator();
import _ from "lodash";
import { CAMERA_PASSWORD, CAMERA_USERNAME, CAMERA_HOST, DEFAULT_TIMEOUT } from "./../../config";
import CameraErr from './../../constants/errors'
import * as cameraRes from './../../utils/res'

const router = express.Router();

/**
 * add cam bằng rtsp
 * nếu có lỗi trả về link stream là null
 */
router.post(
  "/",
  validator.body(
    Joi.object().keys({
      rtsp: Joi.string().required(),
    })
  ),
  async (req, res, next) => {
    try {
      // return cameraRes.networkError(res, 'Lỗi đường truyền đến máy chủ camera nx')
      // return cameraRes.serviceUnavailabe(res, 'Lỗi không xác định từ máy chủ camera nx')

      // console.log(req.body, '===body')
      const { rtsp } = req.body;
      let processId = await cameraHelper.searchCameras(CAMERA_HOST, rtsp);

      // tách user, password từ rtsp link
      let username = ''
      let pass = ''
      try {
        let splitedPart = _.split(rtsp, ":");
        username = splitedPart[1].split("/").join("");
        pass = _.split(splitedPart[2], "@")[0];
      } catch (error) {
        return res.status(409).send({
          code: CameraErr.INVALID_RTSP,
          message: 'Rtsp ko hợp lệ'
        })
      }

      // console.time('aa')
      let status = await fetchStatusUntilDone(CAMERA_HOST, processId);
      // console.timeEnd('aa')

      let camInfo = _.get(status, "cameras[0]", null);


      let liveStreamURL = "";

      let cameraId = "";
      if (!_.isNull(camInfo)) {
        // console.time('bb')
        await cameraHelper.add(CAMERA_HOST, camInfo, username, pass);
        // console.timeEnd('bb')
        // console.time('cc')
        cameraId = await fetchCamIdUntilNotNull(CAMERA_HOST, camInfo.uniqueId);
        // console.timeEnd('cc')
        // console.time('dd')
        const auth = await cameraHelper.generateGETAuth();
        // console.timeEnd('dd')
        liveStreamURL = `${CAMERA_HOST}/media/${cameraId}.mpjpeg?auth=${auth}&rt`;
        cameraId = cameraId.split("{").join("");
        cameraId = cameraId.split("}").join("");
      }

      res.send({ cameraId, liveStreamURL });
      next();
    } catch (error) {
      console.log('====error add camera')
      console.log(error.message);
      console.log('====error add camera========')
      responseAllCameraError(res, error)
    }
  }
);

/**
 * get list camera
 */
router.get("/", async (req, res, next) => {
  try {

    // console.log('hello from get list')
    // console.time('getauth')
    const auth = await cameraHelper.generateGETAuth();
    // console.timeEnd('getauth')
    // console.log(auth, '====auth')
    // console.log(typeof auth)
    // console.log('==run1==')
    // console.time('getlist')
    let result = await cameraHelper.getCameraList(CAMERA_HOST, auth);
    // console.timeEnd('getlist')

    // console.log('==run2==')

    // auth = await auth
    result = _.map(result, async (camInfo) => {
      let liveStreamURL = `${CAMERA_HOST}/media/${camInfo.id}.mpjpeg?auth=${auth}&rt`;
      let lastThumbnail = await cameraHelper.getThumbnail({
        serverUrl: CAMERA_HOST,
        camId: camInfo.id,
      }, auth);

      return {
        id: camInfo.id,
        mac: camInfo.mac,
        status: camInfo.status,
        url: camInfo.url,
        liveStreamURL,
        lastThumbnail,
      };
    });
    result = await Promise.all(result);
    // console.log('==run3==')


    res.send({ data: result });
    next();
  } catch (error) {
    console.log('===error get list camera')
    console.log(error.message)
    console.log('===error get list camera========')
    responseAllCameraError(res, error)
  }
});

// NOTE: route này vẫn chạy ok, nhưng hiện tại ko có service nào sử dụng nên tạm đóng
/**
 * delete camera
 */
// router.delete(
//   "/:cameraId",
//   validator.params(
//     Joi.object().keys({
//       cameraId: Joi.string().required(),
//     })
//   ),
//   async (req, res, next) => {
//     try {
//       const { cameraId } = req.params;

//       const result = await cameraHelper.deleteCam({
//         serverUrl: CAMERA_HOST,
//         camId: cameraId,
//       });

//       res.send({ data: result });
//     } catch (error) {
//       console.log(error, '=======error delete cam')
//       responseAllCameraError()
//     }
//   }
// );

export default router;

const responseAllCameraError = (res, error) => {
  // console.log(error)
  if (error.code === 'ENOTFOUND') {
    return cameraRes.networkError(res, 'Lỗi đường truyền đến máy chủ camera nx')
  } else if (error.code === 'ECONNREFUSED') {
    return cameraRes.serviceUnavailabe(res, 'Service nx die rồi !!!')
  } else if (error.code === 'ECONNRESET') {
    return cameraRes.networkError(res, 'Kết nối đến service nx bị đứt khi đang requests !!!')
  } else if (error.code === 'ECONNABORTED') {
    return cameraRes.timeoutError(res, `Request đến nx bị timeout ==> ${DEFAULT_TIMEOUT} ms!!!`)
  }

  return cameraRes.serviceUnavailabe(res, 'Lỗi không xác định từ máy chủ camera nx')
}

let percentage = 0;
async function fetchStatusUntilDone(CAMERA_HOST, processId) {
  const status = await cameraHelper.checkStatus(CAMERA_HOST, processId);
  percentage = _.get(status, "status.current", 0);

  if (percentage == 100) {
    return status;
  } else {
    sleep(200);
    return fetchStatusUntilDone(CAMERA_HOST, processId);
  }
}

async function fetchCamIdUntilNotNull(serverUrl, physicalId) {
  let camId = await cameraHelper.getCameraId({
    serverUrl,
    physicalId,
  });
  if (!_.isNull(camId)) return camId;

  sleep(100);
  return fetchCamIdUntilNotNull(serverUrl, physicalId);
}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
