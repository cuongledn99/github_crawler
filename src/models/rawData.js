const mongoose = require('mongoose')

const Type = mongoose.SchemaTypes

const RawData = new mongoose.Schema({
  total_count: Number,
  incomplete_results: Boolean,
  items: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})


export default mongoose.model('rawData', RawData)
