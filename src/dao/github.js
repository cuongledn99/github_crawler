import rawData from 'models/rawData'
import repositories from 'models/repositories'
import finalModel from 'models/finalModel'
import { getFetch } from 'utils/fetch'
import { GITHUB_API, GITHUB_TOKEN } from '../config'


export default {
  async find({ minIndex, itemPerPage }, query = {}) {
    const results = await CacheNotificationPush.find(query, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
      .skip(minIndex)
      .limit(itemPerPage)

    return results
  },
  create(data) {
    rawData.create(data)
  },
  createRepo(data) {
    return repositories.insertMany(data)
  },

  async createFinal(repo) {
    // const demo = {
    //   default_branch: "master"
    // }
    // const aa = await cuongModel.create(demo)
    // console.log(repo)

    // // console.log('run 1s')
    const contributors = await getFetch(repo.contributors_url, null, null, GITHUB_TOKEN)
    // console.log(contributors.length, 'contributors==')
    contributors.forEach(async con => {
      // console.log(con, '==con===')
      // console.log({
      //   ...repo,
      //   contributorUrl: con.html_url
      // })
      finalModel.create({
        ...repo,
        contributor: con.html_url
      })
      // aa.save()
      // console.log(aa)
      // process.exit(1)

    })

  }
}
