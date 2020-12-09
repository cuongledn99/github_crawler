const mongoose = require('mongoose')

const Type = mongoose.SchemaTypes

const Repository = new mongoose.Schema({
  default_branch: String,
  open_issues: Number,
  forks: Number,
  language: String,
  watchers_count: Number,
  homepage: String,
  clone_url: String,
  pushed_at: String,
  updated_at: String,
  created_at: String,
  comments_url: String,
  tags_url: String,
  branches_url: String,
  assignees_url: String,
  collaborators_url: String,
  contributors_url: String,
  url: String,
  description: String,
  html_url: String,
  owner: Object,
  full_name: String,
  name: String,
  id: String,
  node_id: String
})


export default mongoose.model('repositories2', Repository)
