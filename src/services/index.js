import { searchRepo } from '../api/github'
import githubDao from 'dao/github'
export const startCrawl = async () => {
  try {
    let crawled = 0
    let page = 1


    while (crawled < 2000) {

      const repos = await searchRepo('javascript', page)
      githubDao.create(repos)
      crawled += 100
      page += 1
    }


  } catch (error) {
    console.log(error)
    process.exit(1)
  }

}