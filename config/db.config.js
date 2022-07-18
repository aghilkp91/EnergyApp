/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : db.config.js
 * Date: 15/07/2022
 **/
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "pass",
  DB: "energyapp",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
