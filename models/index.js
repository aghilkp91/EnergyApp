/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : Sequelize.js
 * Date: 15/07/2022
 * Time: 23:33
 **/
const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const {loadParkData, loadEnergyData} = require("../data/load_data");

const database = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

fs.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
  const model = require(path.join(__dirname, file))(
    database,
    Sequelize
);
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.databaseConf = database;

// function to drop existing tables and re-sync database
db.dropRestApiTable = (dropDBFlag) => {
  return new Promise(function(resolve,reject){
    if(!dropDBFlag){
      console.log("DB is not dropped")
      return resolve();
    }
    db.databaseConf.sync({ force: true })
    .then(() => {
      console.log("Table just dropped and db re-synced.");
      resolve();
    })
    .catch((err) => {
      console.log("Error while dropping tables");
      reject(err);
    });
  })
};

// fs.readdirSync(__dirname)
// .filter(function(file) {
//   return (file.indexOf(".") !== 0) && (file !== "index.js");
// }).forEach(function(file) {
//   const model = require(path.join(__dirname, file))(
//     database,
//     Sequelize
// );
//   db[model.name] = model;
// });

// db.users = require("./user")(database, Sequelize);
// db.parks = require("./park")(database, Sequelize);
// db.energies = require("./energy")(database, Sequelize);

db.createParkDataIfNotPresent = () => {
  return new Promise(function(resolve,reject){
    db.park.findAll({})
    .catch(err => {
      console.log(`Error loading data: ${err.message}`);
      reject(err);
    })
    .then(result => {
      if (result.length < 1) {
        console.log("Park records not present. So datebase seeding is performed");
        loadParkData(db.park)
        .then(() => {
          resolve();
        })
      } else {
          console.log("Park records already present. So not seeding the database");
          resolve();
      }
    });
  });
}

db.createEnergyDataIfNotPresent = () => {
  return new Promise(function(resolve,reject){
    db.energy.findAll({})
    .catch(err => {
      console.log(`Error loading data: ${err.message}`);
      reject(err);
    })
    .then(result => {
      if (result.length < 1) {
        console.log("Energy records not present. So datebase seeding is performed");
        loadEnergyData(db.park, db.energy);
      } else {
          console.log("Energy records already present. So not seeding the database");
      }
      resolve();
    });
  });
}

db.initDB = (dropDBFlag) => {
  return new Promise(function(resolve,reject){
    db.dropRestApiTable(dropDBFlag)
      .then(() => {
        db.createParkDataIfNotPresent()
        .then(() => {
          db.createEnergyDataIfNotPresent()
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
        })
        .catch(err => {
          reject(err);
        })
      })
      .catch(err => {
        reject(err);
      })
  });
}

module.exports = db;
