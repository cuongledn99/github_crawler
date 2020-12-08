var { getFetch, postFetch } = require("utils/fetch");
var md5Hex = require("crypto-js/md5");
var { Base64 } = require("js-base64");
import _ from "lodash";
const { CAMERA_PASSWORD, CAMERA_USERNAME, CAMERA_HOST } = process.env;
import { DEFAULT_TIMEOUT } from './../../config'

export const generateAuthDigist = async (
  serverUrl,
  username,
  password,
  method
) => {
  let cameraNone = await getFetch(serverUrl + "/api/getNonce", {}, { timeout: DEFAULT_TIMEOUT });

  let digest = md5Hex(username + ":" + cameraNone.reply.realm + ":" + password);
  let partialHa2 = md5Hex(`${method}` + ":");
  let simplifiedHa2 = md5Hex(
    digest + ":" + cameraNone.reply.nonce + ":" + partialHa2
  );

  let authDigest = Base64.encode(
    username + ":" + cameraNone.reply.nonce + ":" + simplifiedHa2
  );

  return authDigest;
};

export const generateGETAuth = async () => {
  return generateAuthDigist(
    CAMERA_HOST,
    CAMERA_USERNAME,
    CAMERA_PASSWORD,
    "GET"
  );
};
const generatePOSTAuth = async () => {
  return await generateAuthDigist(
    CAMERA_HOST,
    CAMERA_USERNAME,
    CAMERA_PASSWORD,
    "POST"
  );
};

export const searchCameras = async (serverUrl, rtspLink) => {
  const encodedRtsp = encodeURIComponent(rtspLink)

  const auth = await generateGETAuth();
  let requestURL = `${serverUrl}/api/manualCamera/search?auth=${auth}&start_ip=${encodedRtsp}`;

  let result = await getFetch(requestURL, {}, { timeout: DEFAULT_TIMEOUT });

  return result.reply.processUuid;
};

export const checkStatus = async (serverUrl, uuid) => {

  const encodedUuid = encodeURIComponent(uuid)
  const auth = await generateGETAuth();

  let requestURL = `${serverUrl}/api/manualCamera/status?auth=${auth}&uuid=${encodedUuid}`;

  let status = await getFetch(requestURL, {}, { timeout: DEFAULT_TIMEOUT });

  return status.reply;
};

/**
 * 
 * @param {*} serverUrl 
 * @param {*} username 
 * @param {*} password 
 * @param {*} cameraInfo có dạng như object sau
 * {
            "existsInPool": false,
            "manufacturer": "THIRD_PARTY_COMMON",
            "name": "GENERIC_RTSP-101",
            "uniqueId": "23863e2ab6ce15008788c49cf381f110",
            "url": "rtsp://113.160.117.227:1554/Streaming/Channels/101",
            "vendor": "GENERIC_RTSP"
        }
 * }
 */
export const add = async (serverUrl, cameraInfo = {}, user, password) => {
  const auth = await generatePOSTAuth();

  let cameras = [cameraInfo];
  let requestURL = `${serverUrl}/api/manualCamera/add?auth=${auth}`;

  let result = await postFetch(requestURL,
    {
      user: user,
      password: password,
      cameras,
    },
    null,
    null,
    { timeout: DEFAULT_TIMEOUT }
  );

  return result;
};
export const getCameraList = async (serverUrl, auth = null) => {
  // console.log('===get auth')
  let authClone = auth
  if (authClone === null) {
    authClone = await generateGETAuth();
  }
  // console.log(authClone, '====authClone')

  // console.log('===get auth done')


  let requestURL = `${serverUrl}/ec2/getCamerasEx?auth=${authClone}`;
  let result = await getFetch(requestURL, {}, { timeout: DEFAULT_TIMEOUT });
  return result;
};
export const getCameraId = async ({ serverUrl = null, physicalId = null }) => {
  let camList = await getCameraList(serverUrl);

  let info = _.filter(camList, ["physicalId", physicalId]);
  let result = _.get(info, "[0].id", null);

  return result;
};

/**
 * delete camera
 * - if delete success, return the camera's id just delete
 * - if delete fail, throw an error in pre-defined format that explain the reason.
 * @param {*} serverUrl
 * @param {*} camId camera's id
 */
export const deleteCam = async ({ serverUrl = null, camId = null }) => {
  const auth = await generatePOSTAuth();

  let requestURL = `${serverUrl}/ec2/removeResource?auth=${auth}`;

  let result = await postFetch(requestURL,
    { id: camId },
    null,
    null,
    { timeout: DEFAULT_TIMEOUT }
  );

  return result.id;
};
export const getThumbnail = async ({
  serverUrl = null,
  camId = null,
  width = 300,
  height = 300,
}, auth = null) => {
  let authClone = auth

  if (authClone === null) {
    authClone = await generateGETAuth();
  }
  // const auth = await generateGETAuth();

  let requestURL = `${serverUrl}/ec2/cameraThumbnail?auth=${authClone}&cameraId=${camId}&imageFormat=png&width=${width}&height=${height}`;

  return requestURL;
};
