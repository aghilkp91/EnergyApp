/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : routes.js
 * Date: 05/04/2022
 * Time: 01:45
 **/

const $login_controller = require('../controllers/login_controller');
const $checkAuth = require('../middelware/auth');
const $signup_controller = require('../controllers/signup_controller');
const $energy_controller = require('../controllers/energy_controller');
const $park_controller = require('../controllers/park_controller');


const express = require("express");
const router = express.Router();

//create
router.post('/login', $login_controller.postLogin);

//Handling Post Request
router.post('/signup', $signup_controller.postUser);
//Handling Get Request
router.get('/users', $checkAuth, $signup_controller.getAllUsers);
//Handling Get Request To Get The Unique
router.get('/users/id/:id', $checkAuth, $signup_controller.getUniqueUser);
//Handling Delete Request
router.delete('/users/id/:id', $checkAuth, $signup_controller.deleteUserById);
//Upating user details
router.put('/users/id/:id', $checkAuth, $signup_controller.updateUserById);


//Update Park details
router.put('/parks', $checkAuth, $park_controller.updateParkById);
//Get Park details by id
router.get('/parks/id/:id', $checkAuth, $park_controller.getParkDetailsById);
//Get Park details by energy type or timezone
router.get('/parks', $checkAuth, $park_controller.getParkDetailsByQueryParams);
//Create a new Park
router.post('/parks', $checkAuth, $park_controller.postPark);
//Delete a Park
router.delete('/parks/id/:id', $checkAuth, $park_controller.deleteParkById);

//Get Energy Details on different parameters
router.get('/energies', $checkAuth, $energy_controller.getEnergyDetailsByQueryParams);
// Upload file containing energy data to add it to db
router.post('/energies/file_upload', $checkAuth, $energy_controller.postEnergyDetails);

module.exports = router;