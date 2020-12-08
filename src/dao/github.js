import rawData from 'models/rawData'
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
  }
}
