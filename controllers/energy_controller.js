/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : energy_controller.js
 * Date: 15/07/2022
 * Time: 22:08
 **/

const $db = require("../models");
const $energies = $db.energy;
const $parks = $db.park;
const { Op } = require('sequelize')
const path = require("path");
const loadData = require("../data/load_data"); 

const tempFolder = path.join(__dirname,"../tmp/");

//Get Park details by energy type
/**
 * Possible parameters to search :
 * energyType - Solar or Wind
 * timezone - Any available timezone 
 * parkName - Any parkname from park_info.csv
 * startTime - energyTimeUTC >= startTime will be returned
 * endTime - energyTimeUTC <= endTime will be returned
 * limit - Number of search results. Default 10
 * offset - Search returned from offset. Default 0
 */
exports.getEnergyDetailsByQueryParams = async (req, res, next) => {
    try {
        const $energyType = req.query.energyType;
        const $timezone = req.query.timezone;
        const $parkName = req.query.parkName;
        const $startTime = req.query.startTime;
        const $endTime = req.query.endTime;
        const $offset = req.query.offset || 0;
        const $limit = req.query.limit || 10;
        const energyQueryParams = {};
        const parkQueryParams = {};
        if($energyType && $energyType !== "") {
            parkQueryParams["energyType"] = $energyType;
        }
        if($timezone && $timezone !== "") {
            parkQueryParams["timezone"] = $timezone;
        }
        if($parkName && $parkName !== "") {
            parkQueryParams["parkName"] = $parkName;
        }
        let energyflag = false;
        const energydates = {};
        let time;
        if($startTime && $startTime !== "") {
            time = new Date($startTime + "Z").toUTCString();
            energydates[Op.gte] = time.toString();
            energyflag = true;
        }
        if($endTime && $endTime !== "") {
            const time2 = new Date($endTime + "Z").toUTCString();
            energydates[Op.lte] = time2.toString();
            energyflag = true;
        }
        if(energyflag) {
            energyQueryParams["energyTimeUTC"] = energydates;
        }
        
        await $energies.findAndCountAll({
            include: [{
                model: $parks,
                where: parkQueryParams
            }],
            where: energyQueryParams,
            offset: $offset,
            limit: $limit
        }).catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(404).send({
                Error: {
                    message: err.message
                }
            });
        }).then(result => {
            if (result.length < 1) {
                console.log(`Error: data not found`);
                res.status(404).send({
                    Error: {
                        message: `Park details not found in the system`
                    }
                });
            } else {
                res.status(200).send({
                    message: `Park details fetched successfully`,
                    success: result
                });
            }
        });
        next();
    } catch (err){
        next(err);
    }
}

exports.postEnergyDetails = (req, res, next) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "input") to retrieve the uploaded file
            let energyInput = req.files.input;

            new_file = tempFolder + energyInput.name;   
            console.log(new_file)         
            //Use the mv() method to place the file in upload directory (i.e. "tmp")
            energyInput.mv(new_file);

            //Load data to database
            loadData.updateEnergyDBWithDataSeperate(new_file, $db.park, $db.energy)
            .then(() => {
                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: energyInput.name,
                        mimetype: energyInput.mimetype,
                        size: energyInput.size
                    }
                });    
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}