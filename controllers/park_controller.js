/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : park_controller.js
 * Date: 15/07/2022
 * Time: 22:08
 **/

const $db = require("../models");
const userObj = $db.park;


//Updating Park name, timezone, energyType
exports.updateParkById = (req, res, next) => {

    const $parkId = req.params.id;
    userObj.findAll({
        where: {id: $parkId}
    }).catch(err => {
        console.log(`Error: ${err.message}`);
        res.status(404).send({
            Error: {
                message: err.message
            }
        });
    }).then(result => {
        const resu = result[0].dataValues;
        if (result.length < 1) {
            console.log(`Error: data not found`);
            res.status(404).send({
                Error: {
                    message: `Park details not found in the system`
                }
            });
        } else {
            const updateObj = {}
            if (req.body.parkName && req.body.parkName !== "") {
                updateObj.parkName = req.body.parkName;
            }
            if (req.body.energyType && req.body.energyType !== "") {
                updateObj.energyType = req.body.energyType;
            }
            if (req.body.timezone && req.body.timezone !== "") {
                updateObj.timezone = req.body.timezone;
            }

            userObj.update(updateObj, {
                where: {id: $parkId}
            }).catch(err => {
                console.log(`Error: ${err.message}`);
                res.status(404).send({
                    Error: {
                        message: err.message
                    }
                });
            }).then(resul => {
                console.log(`Updated park details for id: ${$parkId}`);
                res.status(200).send({
                    message: `Updated the park fields successfully`
                });
            });
        }
    })
}

//Get park details of the id
exports.getParkDetailsById = (req, res, next) => {

    const $userId = req.query.id;
    userObj.findAll({
        where: {id: $userId}
    }).catch(err => {
        console.log(`Error: ${err.message}`);
        res.status(404).send({
            Error: {
                message: err.message
            }
        });
    }).then(result => {
        const resu = result;
        if (result.length < 1) {
            console.log(`Error: data not found`);
            res.status(404).send({
                Error: {
                    message: `Park details not found in the system`
                }
            });
        } else {

            res.status(200).send({
                message: `Park Details fetched successfully`,
                park: resu
            });
        }
    });
}

//Get Park details by energy type
exports.getParkDetailsByQueryParams = (req, res, next) => {

    const $energyType = req.query.energyType;
    const $timezone = req.query.timezone;
    const queryParams = {};
    if($energyType && $energyType !== "") {
        queryParams["energyType"] = $energyType
    }
    if($timezone && $timezone !== "") {
        queryParams["timezone"] = $timezone
    }
    
    userObj.findAndCountAll({
        where: queryParams
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
}

//Adding new Park data
exports.postPark = (req, res, next) => {
    const paramID = req.body.parkName;
    userObj.findAll({
        where: {parkName: paramID}
    })
    .then(data => {
        if (data.length >= 1) {
            console.log(`Error: duplicate Park Name`);
            res.status(404).send({
                Error: {
                    message: `duplicate Park Name. Use update operater to update en exisiting park detail`
                }
            });
        } else {
            if (paramID === "" || req.body.timezone === "" || req.body.energyType === "") {
                console.log(`Error: empty fields found`);
                res.status(404).send({
                    Error: {
                        message: `parkName, timezone and energyType cannot be empty`
                    }
                });
            } else {
                
                const $data = {parkName: paramID, timezone: req.body.timezone, energyType: req.body.energyType};
                userObj.create($data).then(data => {
                    console.log(`New park details added for ${data.parkName}`);
                    res.status(200).send({
                        success: {
                            message: `Park Details added successfully`
                        }
                    });
                }).catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(404).send({
                        Error: {
                            message: err.message
                        }
                    });
                });
            }
        }
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving existing data."
        });
    });
};

//Delete Data From The DataBases
exports.deleteParkById = (req, res, next) => {

    const $userId = req.params.id;
    userObj.findAll({
        where: {id: $userId}
    }).catch(err => {
        console.log(`Error: ${err.message}`);
        res.status(404).send({
            Error: {
                message: err.message
            }
        });
    }).then(result => {
        if (result.length < 1) {
            console.log(`Error: data not found for deletion`);
            res.status(404).send({
                Error: {
                    message: `data not existing in system for deleting`
                }
            });
        } else {
            userObj.destroy({
                where: {id: $userId}
            }).catch(err => {
                console.log(`Error: ${err.message}`);
                res.status(404).send({
                    Error: {
                        message: err.message
                    }
                });
            }).then(result => {
                console.log(`Deleted: ${result}`);
                res.status(200).send({
                    message: `User ${$userId} successfully deleted`,
                });
            })
        }
    });
};
