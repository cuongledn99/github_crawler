import { CATEGORY_API } from 'config'
import { getFetch } from 'utils/fetch'
import { GITHUB_API, GITHUB_TOKEN } from '../config'
import _ from 'lodash'

export const searchRepo = async (keyword, page) => {
  try {
    const result = await getFetch(`${GITHUB_API}/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&per_page=100&page=${page}`, null, null, GITHUB_TOKEN)
    return result
  } catch (error) {
    console.log("Rate limited, skipping ...")
    return {
      items: []
    }
    // if (_.get(error, 'response.status') === 403 || _.get(error, 'response.status') === 422 || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    //   console.log("Rate limited, skipping ...")
    //   return {
    //     items: []
    //   }
    // }
    // console.log("Search repo err => " + typeof error)
    // console.log("Search repo err => " + error.code)
    // console.log("Search repo err => " + JSON.stringify(error))

    // process.exit(1)
  }
  // return getFetch(`${GITHUB_API}/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&per_page=100&page=11`, null, null, GITHUB_TOKEN)
}

export const getListTopic = async (keyword) => {
  try {
    const result = await getFetch(`${GITHUB_API}/search/topics?q=${keyword}&per_page=100&page=3`, null, null)
    return result
  } catch (error) {
    console.log("get list topi err")

    process.exit(1)
  }
  // console.log(`${GITHUB_API}/search/topics?q=${keyword}&per_page=100`)
}

// export const getListContributor = 




