export const PORT = 5023;

export const GITHUB_API = 'https://api.github.com'
export const GITHUB_TOKEN = 'f8736c1169ac5c7c892e5bd7f301c4ae1b96cbdb'

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

export const KEYWORDS = [
  'adonisjs',
  'meteorjs',
  'koajs',
  'happijs',
  'derbyjs',
  'totaljs',
  'j2ee',
  'asp.net',
  'jquery',
  'laravel',
  'Xamarin',
  'javascript',
  'nodejs',
  'reactjs',
  'vuejs',
  'java',
  'angular',
  'vue2',
  'expressjs',
  'loopback',
  'loopback2',
  'loopback3',
  'loopback4',
  'nestjs',
  'strongloop',
  'nextjs',
  'sais',
  'python',
  'python2',
  'python3',
  'dotnet',
  'html',
  'css',
  'scss',
  'sass',
  'less',
  'html5',
  'ruby',
  'php',
  'django',
  'c++',
  'react native',
  'golang',
  'angularjs',
  'spring',
  'ios',
  'koltin',
  'android',
  'c#',
  'erp',
  'magento',
  'blockchain',
  'unity',
  'Dropwizard',
  'Grails',
  'GWT'
]

export default {
  PORT,
  MONGODB_OPTIONS
};
