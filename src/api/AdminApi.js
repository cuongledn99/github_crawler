import { ADMIN_API } from '../config'
import { getFetch } from '../utils/fetch'

export function getOrganizationById (organizationId) {
  return getFetch(`${ADMIN_API}/organization/public-crawler/${organizationId}`)
}

export default {
  getOrganizationById
}
