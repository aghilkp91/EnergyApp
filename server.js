/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : server.js
 * Date: 15/07/2022
 **/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
const db = require("./models");
const fileUpload = require('express-fileupload');

const corsSettings = {
  originL: "http://localhost:8081"
};

// enable files upload
server.use(fileUpload({
  createParentPath: true
}));

const api = require("./routes/index");
server.use(cors(corsSettings));
// Parse request of content-type - application/json
server.use(bodyParser.json());
// parse requests of content-type -application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/", api);
// set listening ports for request
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
// Uncomment following function if you want drop existing tables and re-sync database
// const dropDBFlag = true;
const dropDBFlag = false;

db.initDB(dropDBFlag)
  .then(() => {
    db.databaseConf.sync();
  })


// db.createParkDataIfNotPresent();
// db.createEnergyDataIfNotPresent();

