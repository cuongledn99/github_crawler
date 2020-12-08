export const PORT = 5023;

export const GITHUB_API = 'https://api.github.com'
export const GITHUB_TOKEN = '822f5fde13ed498950df76aa19f22392f8088c0e'

export const MONGODB_OPTIONS = {
  database: `mongodb://103.89.85.226/github`,
  db_options: {
    user: 'dev',
    pass: '123',
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
