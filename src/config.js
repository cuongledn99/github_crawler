export const PORT = 5023;

export const GITHUB_API = 'https://api.github.com'
export const GITHUB_TOKEN = 'your token'

export const MONGODB_OPTIONS = {
  database: `your connection string`,
  db_options: {
    user: 'user',
    pass: 'pass',
    native_parser: true,
    poolSize: 20,
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 480000,
    keepAlive: 300000,
    sslValidate: false,
  },
}



export default {
  PORT,
  MONGODB_OPTIONS
};
