import { getListTopic, searchRepo } from '../api/github'
import githubDao from 'dao/github'
export const startCrawl = async () => {
  const topics = await getListTopic('javascript')
  const keywords = topics.items.map(topic => topic.name)
  console.log(keywords)
  // keywords.forEach(keyword => {
  // crawlWithKeyword(keyword)
  // })
  for (const index in keywords) {
    const keyword = keywords[index]
    await crawlWithKeyword(keyword)
  }


}

const crawlWithKeyword = async (keyword) => {
  try {
    let crawled = 0
    let page = 1


    while (crawled < 2000) {

      const repos = await searchRepo(keyword, page)
      // console.log()
      console.log(repos.items.length, 'Repo saved !!!')
      const savedRepos = await githubDao.createRepo(repos.items)
      savedRepos.forEach(repo => {
        // console.log(repo, '==repo==')
        githubDao.createFinal({ ...savedRepos[0]._doc })
      })
      // console.log({
      //   ...savedRepos[0]._doc
      // }, '=savedRepos')
      crawled += 100
      page += 1
    }
  } catch (error) {
    console.log(error, '==error==')
    if (error.response.status === 403 || error.response.status === 422) {
      console.log(error)
      console.log("Rate limited, skipping ...")
      return
    }
  }

}