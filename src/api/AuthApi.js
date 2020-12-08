import { AUTH_API } from 'config'
import { getFetch } from 'utils/fetch'

export function getMe (token) {
  return getFetch(AUTH_API + '/auth/me', undefined, undefined, token)
}

export default {
  getMe
}
