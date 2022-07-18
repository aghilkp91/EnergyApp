/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : load_data.js
 * Date: 16/07/2022
 * Time: 12:05
 **/

const fs = require('fs');
const csv = require('csv');
const path = require("path");
const db = require('../models');
const async = require('async');
const { zonedTimeToUtc } = require("date-fns-tz");


/**
 * This function is to load park info into database
 * Here we read each row and add it to database
 **/
exports.loadParkData = function(db_park) {
    return new Promise(function(resolve){
        const PARK_INFO_CSV_FILE = path.join(__dirname,"park_info.csv"); 
        const park_info = fs.createReadStream(PARK_INFO_CSV_FILE);
        var parser = csv.parse({
            delimiter: ',',
            columns: true
        })

        var inserter = async.cargo(function (tasks, inserterCallback) {
            db_park.bulkCreate(tasks).then(function() {
                inserterCallback();
            });
        },
        100);

        parser.on('readable', function(){
            while(line = parser.read()) {
                var result = {
                    parkName: line['park_name'],
                    timezone: line['timezone'],
                    energyType: line['energy_type']
                }
                inserter.push(result);
            }
        });

        parser.on('end', function(){
            inserter.drain();
            resolve();
        });

        park_info.pipe(parser)
    });
};

/**
 * This function is to energy park info into database
 * Here we read each row and create an array
 * And we do bulk create for every 1000 rows read
 * bulk create help us reduce the number of write requests to db
 **/
exports.loadEnergyData = (db_park, db_energy) => {
    // return new Promise(function(resolve,reject){
        const files = fs.readdirSync(__dirname)
            .filter(function(file) {
                return (file.indexOf(".") !== 0) && (file !== "load_data.js") && (file !== "park_info.csv");
            });
        files.map((file) => {
            const filePath = path.join(__dirname, file);
            updateEnergyDBWithDataSeperate(filePath, db_park, db_energy);
        })
}

exports.updateEnergyDBWithDataSeperate = (file, db_park, db_energy) => {
    return new Promise(function(resolve,reject){
        const park_name = file.split('/').at(-1).split(".")[0];
        console.log(park_name);
        db_park.findAll({
            where: {parkName: park_name}
        }).then(result => {
            loopAndAddDataToEnergyTable(result, file, db_energy)
            resolve();
        }).catch(err  => {
            console.log("Error finding park id :" + err.message);
            reject(err);
        })
    });
}

const loopAndAddDataToEnergyTable = (parkId, filePath, db_energy) => {
    const input = fs.createReadStream(filePath);    
    var parser = csv.parse({
            delimiter: ',',
            columns: true
    });

    var inserter = async.cargo(function (tasks, inserterCallback) {
        db_energy.bulkCreate(tasks).then(function() {
            inserterCallback();
        });
    },
    5000);

    parser.on('readable', function(){
        while(line = parser.read()) {
            time = zonedTimeToUtc(line['datetime'], parkId[0].dataValues.timezone);
            var result = {
                energyTime: line['datetime'],
                energyTimeUTC: time,
                energyInMW: line['MW'],
                parkId: parkId[0].dataValues.id
            }
            // console.log(time + line['datetime']);
            inserter.push(result);
        }
    });

    parser.on('end', function(){
        inserter.drain();
    });

    input.pipe(parser);
}
