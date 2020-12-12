import { getListTopic, searchRepo } from '../api/github'
import githubDao from 'dao/github'
import _ from 'lodash'
import delay from 'delay'

export const startCrawl = async () => {
  try {
    const topics = await getListTopic('javascript')
    const keywords = topics.items.map(topic => topic.name)

    for (const index in keywords) {
      const keyword = keywords[index]
      crawlWithKeyword(keyword)
    }
  } catch (error) {
    console.log("Get topic err" + error)
    process.exit(1)
  }

}

const crawlWithKeyword = async (keyword) => {
  try {
    let crawled = 0
    let page = 1


    while (crawled < 2000) {
      try {
        const repos = await searchRepo(keyword, page)

        console.log(repos.items.length, 'Repo saved !!!')

        repos.items.forEach(repo => {
          githubDao.createFinal(repo)
        })

        crawled += 100
        page += 1
        await delay(1000)
      } catch (error) {
        console.log("loop while err => " + error)

        process.exit(1)
      }


    }
  } catch (error) {

    if (_.get(error, 'response.status') === 403 || _.get(error, 'response.status') === 422) {
      console.log("Rate limited, skipping ...")
      return
    }
    console.log("loop err => " + error)

    process.exit(1)
  }
}


// let crawled = 3
// while (crawled < 2000) {
//   try {
//     a = 4

//     crawled += 100
//     console.log('doen')
//     await del
//   } catch (error) {
//     console.log("Err crawl with keyword")
//     if (_.get(error, 'response.status') === 403 || _.get(error, 'response.status') === 422) {
//       // console.log(error)
//       console.log("Rate limited, skipping ...")
//       // return
//     }
//     process.exit(1)
//   }


// }