import { CATEGORY_API } from 'config'
import { getFetch } from 'utils/fetch'

export function getSysConfig () {
  return getFetch(`${CATEGORY_API}/config`)
}

export function getConfigWQI (token) {
  return Promise.all([
    getFetch(`${CATEGORY_API}/config/wqi-mea-table`, undefined, undefined, token),
    getFetch(`${CATEGORY_API}/config/wqi-weight-param`, undefined, undefined, token),
    getFetch(`${CATEGORY_API}/config/wqi-cal-param`, undefined, undefined, token)
  ])
}

export default {
  getSysConfig,
  getConfigWQI
}
