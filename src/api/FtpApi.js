import { FTP_API } from 'config'
import { putFetch } from 'utils/fetch'

export function removeFTP (path) {
  return putFetch(`${FTP_API}/ftp/remove`, {
    path: path
  })
}

export default {
  removeFTP
}
