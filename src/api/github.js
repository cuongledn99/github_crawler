import { CATEGORY_API } from 'config'
import { getFetch } from 'utils/fetch'
import { GITHUB_API, GITHUB_TOKEN } from '../config'

export const searchRepo = async (keyword, page) => {
  // return getFetch(`${GITHUB_API}/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&per_page=100&page=11`, null, null, GITHUB_TOKEN)
  return getFetch(`${GITHUB_API}/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&per_page=100&page=${page}`, null, null, GITHUB_TOKEN)
}

export const getListTopic = async (keyword) => {
  // console.log('==getListTopic==')
  // console.log(`${GITHUB_API}/search/topics?q=${keyword}&per_page=100`)
  return getFetch(`${GITHUB_API}/search/topics?q=${keyword}&per_page=100`, null, null)
}




