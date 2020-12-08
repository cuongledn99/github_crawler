import CameraErr from './../constants/errors'


export function resSuccess(res, object = {}, success = true) {
  res.json(Object.assign(object, { success }))
}
export function resError(res, messageError) {
  res.json({ error: true, message: messageError })
}
export const serviceUnavailabe = (res, message) => {
  res.status(503).send({ code: CameraErr.SERVICE_UNAVAILABLE, message })
}

export const networkError = (res, message) => {
  res.status(408).send({ code: CameraErr.NETWORK_ERROR, message })
}
export const timeoutError = (res, message) => {
  res.status(408).send({ code: CameraErr.TIMEOUT_ERROR, message })
}