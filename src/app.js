import "./loadEnv";
import bodyParser from "body-parser";
import express from "express";

import { PORT } from "./config";
import { searchRepo } from './api/github';
import { startCrawl } from './services';
import manageConnectDatabase from './utils/db'

////



// Init app express
const app = express();

app.use(function (req, res, next) {
  if (app.get("env") === "development") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Cache-Control, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Setup body parser
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json());

const test = () => { console.log('testestesrt') }

manageConnectDatabase()

startCrawl()



// Routes
// import { postFetch } from './utils/fetch'
// app.get('/cuongtest', async (req, res, next) => {
//   try {
//     console.log('hello from cuongtest')
//     await postFetch('http://localhost:5003/cuongtest', {}, null, null, { timeout: 500 })
//     return res.send('ok')
//   } catch (error) {
//     console.log(error, '===error from cuong test')
//   }
// })

app.get("/ping", async (req, res, next) => {
  res.send("pong")
});

app.listen(PORT, () => {
  console.log(`start server on ${PORT}`);
});
