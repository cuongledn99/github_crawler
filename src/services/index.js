import { getListTopic, searchRepo } from '../api/github'
import githubDao from 'dao/github'
export const startCrawl = async () => {
  const topics = await getListTopic('javascript')
  const keywords = topics.items.map(topic => topic.name)
  keywords.forEach(keyword => {
    try {
      crawlWithKeyword(keyword)
    } catch (error) {
      if (error.response.status === 403 || error.response.status === 422) {
        return
      }
      process.exit(1)
    }
  })

}

const crawlWithKeyword = async (keyword) => {
  let crawled = 0
  let page = 1


  while (crawled < 2000) {

    const repos = await searchRepo(keyword, page)
    githubDao.create(repos)
    crawled += 100
    page += 1
  }
}